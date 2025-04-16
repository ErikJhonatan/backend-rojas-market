const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const sequelize = require('../libs/sequalize');
const { models } = sequelize;

const includes = [
  { association: 'customer', include: [{ association: 'user', attributes: ['id', 'email', 'role'] }] },
  { association: 'items', through: { attributes: ['amount'] }, include: [{ association: 'category' }] },
];

class OrderService {
  async authorizeCustomer(customerId, actor, transaction) {
    if (!actor?.sub) throw boom.unauthorized();
    const customer = await models.Customer.findByPk(customerId, { transaction });
    if (!customer) throw boom.notFound('Customer not found');
    if (actor.role !== 'admin' && Number(customer.userId) !== Number(actor.sub)) {
      throw boom.forbidden('Customer access denied');
    }
    return customer;
  }

  async lockedOrder(id, actor, transaction) {
    const order = await models.Order.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!order) throw boom.notFound('Order not found');
    await this.authorizeCustomer(order.customerId, actor, transaction);
    return order;
  }

  async create(data, actor) {
    return sequelize.transaction(async transaction => {
      await this.authorizeCustomer(data.customerId, actor, transaction);
      return models.Order.create({ customerId: data.customerId }, { transaction });
    });
  }

  async addItem(data, actor, existingTransaction) {
    if (!Number.isSafeInteger(data.amount) || data.amount <= 0) throw boom.badRequest('Invalid amount');
    if (!existingTransaction) {
      return sequelize.transaction(transaction => this.addItem(data, actor, transaction));
    }
    const transaction = existingTransaction;
    const { orderId, productId, amount } = data;
    await this.lockedOrder(orderId, actor, transaction);
    const product = await models.Product.findByPk(productId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!product) throw boom.notFound('Product not found');
    if (product.stock < amount) throw boom.badRequest('Insufficient stock');
    let item = await models.OrderProduct.findOne({ where: { orderId, productId }, transaction });
    if (item) {
      item = await item.update({ amount: item.amount + amount }, { transaction });
    } else {
      item = await models.OrderProduct.create({ orderId, productId, amount }, { transaction });
    }
    await product.update({ stock: product.stock - amount }, { transaction });
    return item;
  }

  async find(actor) {
    if (!actor?.sub) throw boom.unauthorized();
    return models.Order.findAll({
      include: [
        { ...includes[0], ...(actor.role === 'admin' ? {} : { where: { userId: actor.sub }, required: true }) },
        includes[1],
      ], order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id, actor, transaction) {
    const order = await models.Order.findByPk(id, { include: includes, transaction });
    if (!order) throw boom.notFound('Order not found');
    await this.authorizeCustomer(order.customerId, actor, transaction);
    return order;
  }

  async update(id, changes, actor) {
    return sequelize.transaction(async transaction => {
      const order = await this.lockedOrder(id, actor, transaction);
      await this.authorizeCustomer(changes.customerId ?? order.customerId, actor, transaction);
      return order.update({ customerId: changes.customerId ?? order.customerId }, { transaction });
    });
  }

  async delete(id, actor) {
    return sequelize.transaction(async transaction => {
      const order = await this.lockedOrder(id, actor, transaction);
      const items = await models.OrderProduct.findAll({ where: { orderId: id }, order: [['productId', 'ASC']], transaction });
      for (const item of items) {
        const product = await models.Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
        if (!product) throw boom.notFound('Product not found');
        await product.update({ stock: product.stock + item.amount }, { transaction });
      }
      await models.OrderProduct.destroy({ where: { orderId: id }, transaction });
      await order.destroy({ transaction });
      return { id };
    });
  }

  async createWithItems({ customerId, items }, actor) {
    if (!Array.isArray(items) || !items.length) throw boom.badRequest('Items required');
    return sequelize.transaction(async transaction => {
      await this.authorizeCustomer(customerId, actor, transaction);
      const order = await models.Order.create({ customerId }, { transaction });
      for (const item of [...items].sort((a, b) => a.productId - b.productId)) {
        await this.addItem({ orderId: order.id, productId: item.productId, amount: item.amount }, actor, transaction);
      }
      return this.findOne(order.id, actor, transaction);
    });
  }

  async getOrderStats(actor) {
    if (actor?.role !== 'admin') throw boom.forbidden();
    const totalOrders = await models.Order.count();
    const todayOrders = await models.Order.count({ where: { createdAt: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) } } });
    return { totalOrders, todayOrders };
  }

  async removeItem(orderId, productId, actor) {
    return sequelize.transaction(async transaction => {
      await this.lockedOrder(orderId, actor, transaction);
      const product = await models.Product.findByPk(productId, { transaction, lock: transaction.LOCK.UPDATE });
      const item = await models.OrderProduct.findOne({ where: { orderId, productId }, transaction });
      if (!product || !item) throw boom.notFound('Order item not found');
      await product.update({ stock: product.stock + item.amount }, { transaction });
      await item.destroy({ transaction });
      return { message: 'Item removed successfully' };
    });
  }
}
module.exports = OrderService;
