
require('dotenv').config();
const config = {
    env: process.env.NODE_ENV || 'development',
    user_db: process.env.USER_DB || 'root',
    password_db: process.env.PASSWORD_DB || '',
    host_db: process.env.HOST_DB || 'localhost',
    name_db: process.env.NAME_DB || 'my_store_data',
    port_db: process.env.PORT_DB || 3306,
    dialect: process.env.DIALECT || 'mysql',
};

module.exports = {config};
