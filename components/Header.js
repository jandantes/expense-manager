import PropTypes from 'prop-types';
import Link from 'next/link';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core//Avatar';

import MenuDrop from './MenuDrop';

import { styleToolbar } from '../lib/utils/shared-styles';

const optionsMenu = [
  {
    text: 'Profile',
    href: '/profile',
  },
  {
    text: 'Log out',
    href: '/logout',
    noPrefetch: true,
  },
];

function Header({ user }) {
  return (
    <div>
      {user ? (
        <Toolbar style={styleToolbar}>
          <Grid container direction="row" justify="space-around" alignItems="center">
            <Grid item sm={10} xs={9} style={{ textAlign: 'left' }}>
              <Link prefetch href="/">
                <a>
                  <Avatar
                    src="/static/images/logo.png"
                    alt="Logo"
                    style={{ margin: '0px auto 0px 20px' }}
                  />
                </a>
              </Link>
            </Grid>
            <Grid item sm={1} xs={3} style={{ textAlign: 'right' }}>
              <div style={{ whiteSpace: ' nowrap' }}>
                {user.avatarUrl ? (
                  <MenuDrop options={optionsMenu} src={user.avatarUrl} alt="Avatar" />
                ) : null}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      ) : null}
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

Header.defaultProps = {
  user: null,
};

export default Header;
