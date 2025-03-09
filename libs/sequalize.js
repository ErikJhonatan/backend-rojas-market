// Suggested code may be subject to a license. Learn more: ~LicenseLog:3321035341.
const {config} = require('../config/config');
const { Sequelize } = require('sequelize');

const USER = encodeURIComponent(config.user_db);
const PASSWORD = encodeURIComponent(config.password_db);

const URI = `postgres://${USER}:${PASSWORD}@${config.host_db}:${config.port_db}/${config.name_db}`;

const sequelize = new Sequelize(URI, {
        dialect:'postgres',
        logging: true
    }
);

module.exports = sequelize;