const boom = require('@hapi/boom');
const { config } = require('../config/config');
function checkApiKey(req, res, next) {
  const apiKey = req.headers['api-key'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized('Invalid API Key'));
  }
}

module.exports = {checkApiKey}
