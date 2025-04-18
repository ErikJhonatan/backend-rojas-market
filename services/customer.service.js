const boom = require('@hapi/boom');
const { models } = require('../libs/sequalize');
const bcrypt = require('bcrypt');
class CustomerService {
  constructor () {}
  async find() {
    const rta = await models.Customer.findAll({
      include: ['user']
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
    const { email, password } = data.user;
    const hash = await bcrypt.hash(password, 10);

    const userExist = await models.User.findOne({
      where: {
        email,
      },
    });
    if (userExist) {
      throw boom.conflict('user already exists');
    }
    // create user and customer
    const newUser = await models.User.create({
      email: data.user.email,
      password: hash
    });
    const userId = newUser.id;
    data.userId = userId;
    const newCustomer = await models.Customer.create(data, {
      include: ['user']
    });
    newCustomer.user = newUser;
    delete newCustomer.user.dataValues.password;
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
