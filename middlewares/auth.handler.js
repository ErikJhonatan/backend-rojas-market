const boom = require('@hapi/boom');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api-key'];
  if (apiKey === '123456') {
    next();
  } else {
    next(boom.unauthorized('Invalid API Key'));
  }
}

module.exports = {checkApiKey}
