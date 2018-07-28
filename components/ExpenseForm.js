import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import DatePicker from 'material-ui-pickers/DatePicker';
import { Save } from '@material-ui/icons';
import NProgress from 'nprogress';


import { styleFabBottomRight } from '../lib/utils/shared-styles';
import { addExpense } from '../lib/api/expense';
import { getCategories } from '../lib/api/category';
import notify from '../lib/utils/notifier';

class ExpenseForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expense: {},
      categories: [],
    };
  }

  async componentDidMount() {
    try {
      const categories = await getCategories();
      this.setState({ categories }); // eslint-disable-line
    } catch (err) {
      console.log(err); // eslint-disable-line
    }
  }

  save = async () => {
    NProgress.start();
    try {
      await addExpense(this.state.expense);
      const { handleClose } = this.props;
      handleClose();
      notify('Saved');
      NProgress.done();
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  }

  render() {
    return (
      <div>
        <Grid
          container
          spacing={8}
          justify="space-around"
          style={{ marginBottom: 75 }}
        >
          <Grid item xs={12}>
            <TextField
              onChange={(event) => {
                this.setState({
                  expense: Object.assign({}, this.state.expense, {
                    title: event.target.value,
                  }),
                });
              }}
              value={this.state.expense.title || ''}
              label="Title"
              type="text"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label="Date"
                fullWidth
                margin="normal"
                format="MMM DD, YYYY"
                disableFuture
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.expense.date || null}
                onChange={(date) => {
                  this.setState({
                    expense: Object.assign({}, this.state.expense, { date }),
                  });
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={(event) => {
                this.setState({
                  expense: Object.assign({}, this.state.expense, {
                    value: event.target.value,
                  }),
                });
              }}
              value={this.state.expense.value || ''}
              InputProps={{ inputProps: { min: 0.01 } }}
              label="Value"
              type="number"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Category"
              onChange={(event) => {
                this.setState({
                  expense: Object.assign({}, this.state.expense, {
                    CategoryId: event.target.value,
                  }),
                });
              }}
              value={this.state.expense.CategoryId || ''}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            >
              {this.state.categories.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button
          style={styleFabBottomRight}
          variant="fab"
          color="primary"
          onClick={this.save}
        >
          <Save />
        </Button>
      </div>
    );
  }
}

ExpenseForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default ExpenseForm;
