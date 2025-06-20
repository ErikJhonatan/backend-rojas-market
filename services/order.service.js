const boom = require('@hapi/boom');

const { models } = require('./../libs/sequalize');

class OrderService {
  constructor() {}

  async create(data) {
    const { customerId } = data;
    const customer = await models.Customer.findByPk(customerId);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    const { orderId, productId, amount } = data;

    // Verificar que el pedido existe
    const order = await models.Order.findByPk(orderId);
    if (!order) {
      throw boom.notFound('Order not found');
    }

    // Verificar que el producto existe
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    // Verificar que hay suficiente stock
    if (product.stock < amount) {
      throw boom.badRequest(
        `Insufficient stock. Available: ${product.stock}, Requested: ${amount}`
      );
    }

    const newItem = await models.OrderProduct.create(data);

    // Actualizar el stock del producto
    await product.update({
      stock: product.stock - amount,
    });

    return newItem;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        {
          association: 'items',
          through: {
            attributes: ['amount'], // Incluir la cantidad del producto en el pedido
          },
          include: [
            {
              association: 'category',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        {
          association: 'items',
          through: {
            attributes: ['amount'], // Incluir la cantidad del producto en el pedido
          },
          include: [
            {
              association: 'category',
            },
          ],
        },
      ],
    });

    if (!order) {
      throw boom.notFound('Order not found');
    }

    return order;
  }

  async update(id, changes) {
    const order = await this.findOne(id);
    const updatedOrder = await order.update(changes);
    return updatedOrder;
  }

  async delete(id) {
    const order = await this.findOne(id);

    // Restaurar el stock de los productos antes de eliminar el pedido
    const orderItems = await models.OrderProduct.findAll({
      where: { orderId: id },
      include: [
        {
          association: 'product',
        },
      ],
    });

    // Restaurar stock de cada producto
    for (const item of orderItems) {
      await item.product.update({
        stock: item.product.stock + item.amount,
      });
    }

    await order.destroy();
    return { id };
  }

  async createWithItems(orderData) {
    const { customerId, items } = orderData;

    // Verificar que el cliente existe
    const customer = await models.Customer.findByPk(customerId);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }

    // Verificar stock de todos los productos antes de crear el pedido
    for (const item of items) {
      const product = await models.Product.findByPk(item.productId);
      if (!product) {
        throw boom.notFound(`Product with id ${item.productId} not found`);
      }
      if (product.stock < item.amount) {
        throw boom.badRequest(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.amount}`
        );
      }
    }

    // Crear el pedido
    const newOrder = await models.Order.create({ customerId });

    // Agregar todos los productos al pedido
    for (const item of items) {
      await this.addItem({
        orderId: newOrder.id,
        productId: item.productId,
        amount: item.amount,
      });
    }

    // Retornar el pedido completo con sus productos
    return await this.findOne(newOrder.id);
  }

  async getOrderStats() {
    const totalOrders = await models.Order.count();
    const todayOrders = await models.Order.count({
      where: {
        createdAt: {
          [models.Sequelize.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return {
      totalOrders,
      todayOrders,
    };
  }

  async removeItem(orderId, productId) {
    const orderItem = await models.OrderProduct.findOne({
      where: { orderId, productId },
      include: [
        {
          association: 'product',
        },
      ],
    });

    if (!orderItem) {
      throw boom.notFound('Order item not found');
    }

    // Restaurar el stock del producto
    await orderItem.product.update({
      stock: orderItem.product.stock + orderItem.amount,
    });

    // Eliminar el item del pedido
    await orderItem.destroy();

    return { message: 'Item removed successfully' };
  }
}

module.exports = OrderService;
