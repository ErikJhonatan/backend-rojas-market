const { Strategy, ExtractJwt } = require('passport-jwt');
const { models } = require('../../../libs/sequalize');
const { config } = require('./../../../config/config');
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}

const JwtStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await models.User.findByPk(payload.sub);
    if (!user) return done(null, false);
    return done(null, { sub: user.id, role: user.role });
  } catch (error) {
    return done(error, false);
  }
});
module.exports = JwtStrategy;
