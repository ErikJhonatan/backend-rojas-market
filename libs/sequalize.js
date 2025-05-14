const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models');

const sequelize = new Sequelize(
  config.name_db,
  config.user_db,
  config.password_db,
  {
    host: config.host_db,
    port: config.port_db,
    dialect: config.dialect,
    logging: true,
  }
);

setupModels(sequelize);

module.exports = sequelize;
