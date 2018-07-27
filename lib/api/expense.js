import sendRequest from '../utils/send-request';

const BASE_PATH = '/api/v1/expenses';

export const getExpenses = () =>
  sendRequest(`${BASE_PATH}/`, {
    method: 'GET',
  });

export const getExpense = ({ slug }) =>
  sendRequest(`${BASE_PATH}/detail/${slug}`, {
    method: 'GET',
  });

export const addExpense = data =>
  sendRequest(`${BASE_PATH}/add`, {
    body: JSON.stringify(data),
  });
