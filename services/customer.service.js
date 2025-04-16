const boom = require('@hapi/boom');
const sequelize = require('../libs/sequalize');
const { models } = sequelize;
const bcrypt = require('bcrypt');
class CustomerService {
  constructor () {}
  async find(actor) {
    const rta = await models.Customer.findAll({
      where: actor.role === 'admin' ? {} : {userId: actor.sub},
      include: [{association: 'user', attributes: {exclude: ['password']}}, 'orders']
    }
    );
    return rta;
  }

  async findOne(id, transaction) {
    const customer = await models.Customer.findByPk(id, {
      transaction,
      ...(transaction ? {lock: transaction.LOCK.UPDATE} : {}),
    });
    if (!customer) {
      throw boom.notFound('customer not found');
    }
    return customer;
  }

  async create(data) {

    const payload = {...data};
    if (data.user) payload.user = {...data.user, password: await bcrypt.hash(data.user.password, 10), role: 'customer'};
    const newCustomer = await models.Customer.create(payload, {
      include: ['user']
    });
    if (newCustomer.user) delete newCustomer.user.dataValues.password;
    return newCustomer;
  }

  async update(id, changes, actor) {
    return sequelize.transaction(async transaction => {
      const customer = await this.findOne(id, transaction);
      if (actor.role !== 'admin' && Number(customer.userId) !== Number(actor.sub)) throw boom.forbidden();
      const data = {...changes};
      if (actor.role !== 'admin') delete data.userId;
      return customer.update(data, {transaction});
    });
  }

  async delete(id, actor) {
    return sequelize.transaction(async transaction => {
      const model = await this.findOne(id, transaction);
      if (actor.role !== 'admin' && Number(model.userId) !== Number(actor.sub)) throw boom.forbidden();
      if (await models.Order.count({where: {customerId: id}, transaction})) throw boom.conflict('Customer has orders');
      await model.destroy({transaction});
      return { rta: true };
    });
  }
}

module.exports = CustomerService;
