require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  user_db: process.env.USER_DB || 'mysql',
  password_db: process.env.PASSWORD_DB || 'mysql',
  host_db: process.env.HOST_DB || 'localhost',
  name_db: process.env.NAME_DB || 'my_database',
  port_db: process.env.PORT_DB || 5432,
  dialect: 'mysql',
  apiKey: process.env.API_KEY || 'default_api_key',
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

module.exports = { config };
