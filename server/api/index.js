const categoriesApi = require('./category');

function api(server) {
  server.use('/api/v1/categories', categoriesApi);
}

module.exports = api;
