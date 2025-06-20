const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const lastName = Joi.string();
const phone =  Joi.string();
const address = Joi.string();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password =  Joi.string();

const getCustomerSchema = Joi.object({
  id: id.required(),
});

const createCustomerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  address: address.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required(),
    role: Joi.string().valid('customer').default('customer')
  }).optional(),
});

const updateCustomerSchema = Joi.object({
  name,
  lastName,
  phone,
  address,
  userId
});

module.exports = { getCustomerSchema, createCustomerSchema, updateCustomerSchema };
