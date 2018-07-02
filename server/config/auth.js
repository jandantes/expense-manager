const passport = require('passport');
const Strategy = require('passport-google-oauth').OAuth2Strategy;
const _ = require('lodash');
const Sequelize = require('sequelize');

const { Op } = Sequelize;
const { User } = require('../models');
const generateSlug = require('../utils/slugify');

const publicFields = [
  'id',
  'displayName',
  'email',
  'avatarUrl',
  'slug',
  'isAdmin',
];

async function signInOrSignUp({
  googleId,
  email,
  googleToken,
  displayName,
  avatarUrl,
}) {
  const user = await User
    .findOne({
      where: {
        googleId: {
          [Op.eq]: googleId,
        },
      },
      attributes: publicFields,
    });

  if (user) {
    const modifier = {};
    if (googleToken.accessToken) {
      modifier.googleToken = googleToken.accessToken;
    }

    if (googleToken.refreshToken) {
      modifier.refreshToken = googleToken.refreshToken;
    }

    if (_.isEmpty(modifier)) {
      return user;
    }

    await User.update({
      modifier,
    }, {
      where: {
        googleId: {
          [Op.eq]: googleId,
        },
      },
    });

    return user;
  }

  const slug = await generateSlug(User, displayName);
  const userCount = await User.count();

  const newUser = await User
    .create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
      isAdmin: userCount === 0,
    });

  return _.pick(newUser, publicFields);
}

function auth({ ROOT_URL, server }) {
  const verify = async (accessToken, refreshToken, profile, verified) => {
    let email;
    let avatarUrl;

    if (profile.emails) {
      email = profile.emails[0].value;
    }

    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
    }

    try {
      const user = await signInOrSignUp({
        googleId: profile.id,
        email,
        googleToken: accessToken,
        displayName: profile.displayName,
        avatarUrl,
      });
      verified(null, user);
    } catch (err) {
      verified(err);
      console.log(err); // eslint-disable-line
    }
  };
  passport.use(new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${ROOT_URL}/oauth2callback`,
    },
    verify,
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User
      .findOne({
        where: { id: { [Op.eq]: id } },
        attributes: publicFields,
      })
      .then((user) => {
        done(null, user.get());
      });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get('/auth/google', (req, res, next) => {
    const options = {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    };

    if (req.query && req.query.next && req.query.next.startsWith('/')) {
      req.session.next_url = req.query.next;
    } else {
      req.session.next_url = null;
    }

    passport.authenticate('google', options)(req, res, next);
  });

  server.get(
    '/oauth2callback',
    passport.authenticate('google', {
      failureRedirect: '/login',
    }),
    (req, res) => {
      if (req.user && req.user.isAdmin) {
        res.redirect('/');
      } else if (req.session.next_url) {
        res.redirect(req.session.next_url);
      } else {
        res.redirect('/');
      }
    },
  );

  server.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
}

module.exports = auth;
