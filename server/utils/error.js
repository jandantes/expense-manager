const logger = require('./logs');

const generateMessage = (err, model) => {
  logger.error(err);
  const type = err.message.split(':').shift();

  if (err.name === 'SequelizeUniqueConstraintError') {
    return `${model} already exists.`;
  }

  switch (type) {
    case 'notNull Violation':
      return `${model} is required.`;
    default:
  }
  return err.message;
};

module.exports = { generateMessage };
