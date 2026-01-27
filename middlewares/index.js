// middlewares/index.js
const logger = require('./logger');
const errorHandler = require('./errorHandler');

module.exports = {
  logger,
  errorHandler
};