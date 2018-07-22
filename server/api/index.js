const categoriesApi = require('./category');
const expenseApi = require('./expense');

function api(server) {
  server.use('/api/v1/categories', categoriesApi);
  server.use('/api/v1/expenses', expenseApi);
}

module.exports = api;
