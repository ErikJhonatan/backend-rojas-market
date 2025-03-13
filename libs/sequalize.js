const { Sequelize } = require('sequelize');
require('dotenv').config();
const setupModels = require('../db/models');

const sequelize = new Sequelize(
  process.env.DB_NAME|| 'my_store_data',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: true,
  }
);

setupModels(sequelize);

module.exports = sequelize;
