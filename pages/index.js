/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Add, Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Slide from '@material-ui/core/Slide';

import withAuth from '../lib/utils/with-auth';
import withLayout from '../lib/utils/with-layout';
import { styleFabUpperRight, styleFabBottomRight } from '../lib/utils/shared-styles';
import ExpenseForm from '../components/ExpenseForm';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Index extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { fullScreen } = this.props;
    return (
      <div style={{ padding: '30px 5%' }}>
        <Head>
          <title>Expense Manager</title>
        </Head>
        <Grid container justify="center" alignItems="stretch" spacing={24}>
          <Grid item xs={12}>
            <Typography variant="headline">
              Dashboard
            </Typography>
          </Grid>
        </Grid>
        <Dialog
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <IconButton onClick={this.handleClose} aria-label="Back" style={styleFabUpperRight}>
            <Close />
          </IconButton>
          <DialogTitle>New Expense</DialogTitle>
          <DialogContent>
            <ExpenseForm handleClose={this.handleClose} />
          </DialogContent>
        </Dialog>
        <Button
          style={styleFabBottomRight}
          variant="fab"
          color="primary"
          onClick={this.handleClickOpen}
        >
          <Add />
        </Button>
      </div>
    );
  }
}

Index.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};


export default withAuth(withLayout(withMobileDialog()(Index)));
