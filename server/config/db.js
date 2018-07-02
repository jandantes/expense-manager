/* eslint-disable */
require('dotenv').config();
const {
  DB_HOST_PROD,
  DB_PORT_PROD,
  DB_USER_PROD,
  DB_PASSWORD_PROD,
  DB_PROD,
} = process.env;

module.exports = {
  "development": {
    "user": "root",
    "password": null,
    "database": "expense_manager_dev",
    "host": "127.0.0.1",
    "port": "3306",
  },
  "test": {
    "user": "root",
    "password": null,
    "database": "expense_manager_test",
    "host": "127.0.0.1",
    "port": "3306",
  },
  "production": {
    "user": DB_USER_PROD,
    "password": DB_PASSWORD_PROD,
    "database": DB_PROD,
    "host": DB_HOST_PROD,
    "port": DB_PORT_PROD,
  }
};

