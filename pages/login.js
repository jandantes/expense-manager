import Head from 'next/head';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import withAuth from '../lib/utils/with-auth';
import withLayout from '../lib/utils/with-layout';
import { styleLoginButton } from '../lib/utils/shared-styles';

const Login = () => (
  <div style={{ textAlign: 'center' }}>
    <Head>
      <title>Expense Manager - Login</title>
    </Head>
    <div id="login">
      <Card style={{ width: '250px', margin: '10% auto' }}>
        <CardContent>
          <Avatar
            src="/static/images/logo.png"
            alt="Expense"
            style={{ margin: '10px auto 30px' }}
          />
          <p><small>You’ll be logged in for 3 days unless you log out manually.</small></p>
          <br />
          <Button variant="raised" style={styleLoginButton} href="/auth/google">
            <img
              src="/static/images/G.svg"
              alt="Log in with Google"
            />
            &nbsp;&nbsp;&nbsp; Log in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default withAuth(withLayout(Login), { logoutRequired: true });
