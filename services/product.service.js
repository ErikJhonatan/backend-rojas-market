const boom = require('@hapi/boom');
const { models } = require('../libs/sequalize');
const { Op } = require('sequelize');

class ProductsService {
  async create(data) {
    const { categoryId } = data;

    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      throw boom.notFound('category not found');
    }

    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find(query) {
    const options = {
      include: ['category'],
      where: {}
    }
    const {limit, offset} = query;
    const { price } = query;
    if (price) {
      options.where.price = price;
    }
    const {price_min, price_max} = query;
    if (price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max
      };
    }

    if (limit && offset) {
      if (limit > 0 && offset >= 0) {
        options.limit = parseInt(limit, 10);
        options.offset = parseInt(offset, 10);
      }
    }

    const rta = await models.Product.findAll(options);
    return rta;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category']
    });
    if (!product) {
      throw boom.notFound('product not found');
    }
    return product;
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    if (!product) {
      throw boom.notFound('product not found');
    }
    const rta = await product.update(changes);
    return rta;
  }

  async delete(id) {
    const product = await this.findOne(id);
    if (!product) {
      throw boom.notFound('product not found');
    }
    await product.destroy();
    return { id };
  }

}

module.exports = ProductsService;
