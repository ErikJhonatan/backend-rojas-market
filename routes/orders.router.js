const express = require('express');
const passport = require('passport');

const OrderService = require('../services/order.service');
const validatorHandler = require('../middlewares/validator.handler');
const {
	getOrderSchema,
	createOrderSchema,
  addProductSchema,
} = require('../schemas/order.schema');

const router = express.Router();
const service = new OrderService();

router.get(
	'/:id',
	validatorHandler(getOrderSchema, 'params'),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const order = await service.findOne(id);
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
			const newOrder = await service.create(body);
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
      const order = await service.addItem(body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;
