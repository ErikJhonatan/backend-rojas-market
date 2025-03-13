const { config } = require('../config/config')

module.exports = {
  development: {
    ...config
  },
  production: {
    ...config
  },
}
