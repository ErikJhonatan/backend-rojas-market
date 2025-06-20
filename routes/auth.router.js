const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { config } = require('./../config/config');

const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', {session: false}),
  (req, res, next) => {
    try {
      const user = req.user;
      const payload = {
        sub: user.id,
        role: user.role
      };
      const token = jwt.sign(payload, config.jwtSecret, {
        // 2h
        expiresIn: '2h'
      });
      res.status(200).json({
        user,
        token
      });
    } catch (error) {
      next(error);
    }
  }
)

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
