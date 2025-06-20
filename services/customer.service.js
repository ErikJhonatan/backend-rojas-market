const boom = require('@hapi/boom');
const { models } = require('../libs/sequalize');
const bcrypt = require('bcrypt');
class CustomerService {
  constructor () {}
  async find() {
    const rta = await models.Customer.findAll({
      include: ['user', 'orders']
    }
    );
    return rta;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id);
    if (!customer) {
      throw boom.notFound('customer not found');
    }
    return customer;
  }

  async create(data) {

    const newCustomer = await models.Customer.create(data, {
      include: ['user']
    });
    return newCustomer;
  }

  async update(id, changes) {
    const customer = await this.findOne(id);
    const rta = await customer.update(changes);
    return rta;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }
}

module.exports = CustomerService;
