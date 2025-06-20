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

function checkAdminRole(req, res, next){
  const user = req.user;
  if (user.role === 'admin') {
    next();
  } else {
    next(boom.unauthorized('You are not an admin'));
  }
}

module.exports = {checkApiKey, checkAdminRole};
