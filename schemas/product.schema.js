const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(15);
const price = Joi.number().integer().min(10);
const price_min = Joi.number().integer().min(10);
const price_max = Joi.number().integer().min(10);
const description = Joi.string().min(10).max(100);
const categoryId = Joi.number().integer().min(1);
const image = Joi.string().uri();
const limit = Joi.number().integer().min(1).max(50);
const offset = Joi.number().integer().min(0);

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  image: image.required(),
  categoryId: categoryId.required()
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  description: description,
  categoryId: categoryId,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  limit: limit,
  offset: offset,
  price: price,
  price_min: price_min,
  price_max: price_max.when('price_min', {
    is: Joi.number().integer().min(10),
    then: Joi.required()
  })
})

module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema };
