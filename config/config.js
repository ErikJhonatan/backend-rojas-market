
require('dotenv').config();
const config = {
    env: process.env.NODE_ENV || 'dev',
    user_db: process.env.USER_DB,
    password_db: process.env.PASSWORD_DB,
    host_db: process.env.HOST_DB,
    name_db: process.env.NAME_DB,
    port_db: process.env.PORT_DB
};

module.exports = {config};