const Joi = require('joi');

const id = Joi.number().integer().positive()
const customerId = Joi.number().integer().positive();
const orderId = Joi.number().integer().positive();
const productId = Joi.number().integer().positive();
const amount = Joi.number().integer().positive();


const getOrderSchema = Joi.object({
	id: id.required(),
})

const createOrderSchema = Joi.object({
	customerId: customerId.required(),
  items: Joi.array().min(1).items(Joi.object({ productId: productId.required(), amount: amount.required() })),
});

const addProductSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
});

module.exports = {
	getOrderSchema,
	createOrderSchema,
  addProductSchema,
  updateOrderSchema: Joi.object({customerId}).min(1),
}
