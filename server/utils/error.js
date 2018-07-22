const logger = require('./logs');

const generateMessage = (err, model) => {
  logger.error(err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return `${model} already exists.`;
  }

  const type = err.message.split(':');
  const field = type[1].split(' ')[1].replace(/\./g, ' ');

  switch (type.shift()) {
    case 'notNull Violation':
      return `${field} is required.`;
    default:
      return 'There was a problem with your request.';
  }
};

module.exports = { generateMessage };
