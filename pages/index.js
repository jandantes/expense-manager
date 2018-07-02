/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import withAuth from '../lib/utils/with-auth';
import withLayout from '../lib/utils/with-layout';

class Index extends React.Component {
  render() {
    return (
      <div style={{ padding: '30px 5%' }}>
        <Head>
          <title>Expense Manager</title>
        </Head>
        <Grid container justify="center" alignItems="stretch">
          <Grid item xs={12}>
            <Typography variant="headline">
              Dashboard
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withAuth(withLayout(Index));
