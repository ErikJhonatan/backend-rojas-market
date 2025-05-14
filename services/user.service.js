const boom = require('@hapi/boom');
const {models} = require('../libs/sequalize');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.findByEmail(data.email);
    if (user) {
      throw boom.conflict('email already exists');
    }
    const newUser = await models.User.create({
      ...data,
      password: hash
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find() {
    const users = await models.User.findAll({
      include: ['customer']
    });
    return users;
  }
  // find by email
  async findByEmail(email) {
    const user = await models.User.findOne({
      where: {email}
    });
    return user;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await models.User.findByPk(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await models.User.findByPk(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
