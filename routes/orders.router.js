const express = require('express');
const passport = require('passport');

const OrderService = require('../services/order.service');
const validatorHandler = require('../middlewares/validator.handler');
const {
  getOrderSchema,
  createOrderSchema,
  addProductSchema,
  updateOrderSchema,
} = require('../schemas/order.schema');

const router = express.Router();
const service = new OrderService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const orders = await service.find(req.user);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/stats', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try { res.json(await service.getOrderStats(req.user)); } catch (error) { next(error); }
});

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id, req.user);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(createOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = body.items
        ? await service.createWithItems(body, req.user)
        : await service.create(body, req.user);
      res.status(201).json({ newOrder });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/add-item',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(addProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const order = await service.addItem(body, req.user);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id', passport.authenticate('jwt', {session: false}),
  validatorHandler(getOrderSchema, 'params'), validatorHandler(updateOrderSchema, 'body'),
  async (req, res, next) => {
    try { res.json(await service.update(req.params.id, req.body, req.user)); } catch (error) { next(error); }
  });
router.delete('/:id', passport.authenticate('jwt', {session: false}),
  validatorHandler(getOrderSchema, 'params'), async (req, res, next) => {
    try { res.json(await service.delete(req.params.id, req.user)); } catch (error) { next(error); }
  });

module.exports = router;
