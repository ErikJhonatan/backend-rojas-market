const { config } = require('../config/config')

module.exports = {
  development: {
    "username": "root",
    "password": null,
    "database": "store_bd",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    ...config
  },
}
