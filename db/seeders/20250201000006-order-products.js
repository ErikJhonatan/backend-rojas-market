'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orderProducts = [];

    // Crear relaciones aleatorias entre órdenes y productos
    for (let orderId = 1; orderId <= 8; orderId++) {
      // Cada orden tendrá entre 1 y 4 productos
      const numProducts = faker.number.int({ min: 1, max: 4 });
      const usedProducts = new Set();

      for (let i = 0; i < numProducts; i++) {
        let productId;
        // Evitar productos duplicados en la misma orden
        do {
          productId = faker.number.int({ min: 1, max: 25 });
        } while (usedProducts.has(productId));

        usedProducts.add(productId);

        orderProducts.push({
          order_id: orderId,
          product_id: productId,
          amount: faker.number.int({ min: 1, max: 5 }),
          created_at: faker.date.recent({ days: 30 })
        });
      }
    }

    await queryInterface.bulkInsert('order_product', orderProducts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_product', null, {});
  }
};
