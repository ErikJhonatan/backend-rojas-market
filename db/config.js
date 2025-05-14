const { config } = require('../config/config')

module.exports = {
  development: {
    username: config.user_db,
    password: config.password_db,
    database: config.name_db,
    host: config.host_db,
    port: config.port_db,
    dialect: config.dialect
  },
  production: {
    username: config.user_db,
    password: config.password_db,
    database: config.name_db,
    host: config.host_db,
    port: config.port_db,
    dialect: config.dialect
  },
}
