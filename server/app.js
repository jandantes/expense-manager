const express = require('express');
const compression = require('compression');
const session = require('express-session');
const SqlStore = require('express-mysql-session')(session);
const next = require('next');
const helmet = require('helmet');

const auth = require('./config/auth');
const api = require('./api');
const logger = require('./utils/logs');
const models = require('./models');

require('dotenv').config();

const { PORT, NODE_ENV, SESSION_SECRET } = process.env;

const dev = NODE_ENV !== 'production';
const port = PORT || 8585;
const ROOT_URL = dev ? `http://localhost:${port}` : URL;
const sqlStoreOptions = require('./config/db')[NODE_ENV];

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(compression());
  server.use(express.json());

  // potential fix for Error: Can't set headers
  // try with Chrome Dev Tools open/close

  // pass all Nextjs's request to Nextjs server
  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });

  server.get('/static/*', (req, res) => {
    handle(req, res);
  });

  sqlStoreOptions.schema = {
    tableName: 'Sessions',
    columnNames: {
      session_id: 'sessionId',
      expires: 'expires',
      data: 'data',
    },
  };

  const sessionStore = new SqlStore(sqlStoreOptions);

  const sess = {
    name: 'expense-manager.sid',
    secret: SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  };

  if (!dev) {
    server.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  server.use(session(sess));

  auth({ server, ROOT_URL });

  api(server);

  server.get('*', (req, res) => handle(req, res));

  models.sequelize.sync().then(() => {
    // starting express server
    server.listen(port, (err) => {
      if (err) throw err;
      logger.info(`> Ready on ${ROOT_URL}`);
    });
  });
});
