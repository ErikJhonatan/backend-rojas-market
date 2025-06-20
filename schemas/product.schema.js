const Joi = require('joi');

const id = Joi.number().integer().min(1).required();
const name = Joi.string().min(3).max(15);
const price = Joi.number().min(0.1);
const price_min = Joi.number().integer().min(10);
const price_max = Joi.number().integer().min(10);
const description = Joi.string().min(10).max(100);
const categoryId = Joi.number().integer().min(1);
const image = Joi.string().uri();
const limit = Joi.number().integer().min(1).max(50);
const offset = Joi.number().integer().min(0);
const stock = Joi.number().integer().min(0);
const stockMin = Joi.number().integer().min(0);
const code = Joi.string().min(3).max(20);

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  image: image.required(),
  categoryId: categoryId.required(),
  stock: stock.required(),
  stockMin: stockMin.required(),
  code: code.required()
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  description: description,
  categoryId: categoryId,
  stock: stock,
  stockMin: stockMin,
  code: code,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  limit: limit,
  offset: offset,
  price: price,
  price_min: price_min.default(0),
  price_max: price_max.min(Joi.ref('price_min')),
})

module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema };
