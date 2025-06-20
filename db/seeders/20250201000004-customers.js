'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Buscar el usuario admin por email para obtener su id
    const [adminUser] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@example.com'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!adminUser) {
      throw new Error('Usuario admin no encontrado');
    }

    const customers = [];

    // Crear 4 customers que pertenecen al usuario admin
    for (let i = 1; i <= 4; i++) {
      customers.push({
        name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        phone: faker.phone.number('+51 9## ### ###'),
        address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`,
        created_at: new Date()
      });
    }

    await queryInterface.bulkInsert('customers', customers, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
