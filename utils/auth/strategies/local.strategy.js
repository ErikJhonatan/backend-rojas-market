const {Strategy} = require('passport-local');
const UserService = require('./../../../services/user.service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const service = new UserService();

const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, pass, done) => {
    try {
      const user = await service.findByEmail(email)
      if (!user) done(boom.unauthorized(), false);
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) done(boom.unauthorized(), false);
      delete user.dataValues.password; // remove password from user object
      done(null, user);
    } catch (error) {
      done(error, false);
    }
});

module.exports = LocalStrategy;
