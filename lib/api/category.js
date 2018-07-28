import sendRequest from '../utils/send-request';

const BASE_PATH = '/api/v1/categories';

export const getCategories = () =>
  sendRequest(`${BASE_PATH}/`, {
    method: 'GET',
  });
