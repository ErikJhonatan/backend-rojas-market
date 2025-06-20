'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orders = [];

    // Crear órdenes aleatorias para los customers (IDs 1-4)
    for (let i = 0; i < 8; i++) {
      orders.push({
        customer_id: faker.random.numeric({ min: 1, max: 4 }),
        created_at: faker.date.recent(30)
      });
    }

    await queryInterface.bulkInsert('orders', orders, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
