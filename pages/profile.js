/* eslint react/prefer-stateless-function: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


import withAuth from '../lib/utils/with-auth';
import withLayout from '../lib/utils/with-layout';

const ProfileDetails = ({ user }) => (
  <div style={{ padding: '30px 5%' }}>
    <Head>
      <title>Expense Manager - Profile</title>
    </Head>
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="headline">
          Profile
        </Typography>
        <Grid item xs={12} sm={6}>
          <Paper style={{ marginTop: 20 }} elevation={1}>
            <List>
              <ListItem>
                <ListItemText primary="Display Name" secondary={user.displayName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

class Profile extends React.Component {
  render() {
    return <ProfileDetails {...this.props} {...this.state} />;
  }
}

ProfileDetails.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    displayName: PropTypes.string,
  }),
};

ProfileDetails.defaultProps = {
  user: null,
};

export default withAuth(withLayout(Profile));
