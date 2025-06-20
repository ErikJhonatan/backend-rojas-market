'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Obtener las categorías existentes
    const categories = await queryInterface.sequelize.query(
      "SELECT id, name FROM categories ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const products = [];

    // Productos de Electrónicos
    const electronicsCategory = categories.find(cat => cat.name === 'Electrónicos');
    for (let i = 0; i < 5; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.datatype.number({ min: 100, max: 2000, precision: 0.01 }),
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
        code: faker.random.alphaNumeric(8).toUpperCase(),
        stock: faker.datatype.number({ min: 10, max: 100 }),
        stock_min: faker.datatype.number({ min: 5, max: 15 }),
        category_id: electronicsCategory.id,
        created_at: faker.date.past()
      });
    }

    // Productos de Ropa
    const ropaCategory = categories.find(cat => cat.name === 'Ropa');
    for (let i = 0; i < 5; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.datatype.number({ min: 20, max: 200, precision: 0.01 }),
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
        code: faker.random.alphaNumeric(8).toUpperCase(),
        stock: faker.datatype.number({ min: 20, max: 150 }),
        stock_min: faker.datatype.number({ min: 10, max: 25 }),
        category_id: ropaCategory.id,
        created_at: faker.date.past()
      });
    }

    // Productos de Hogar
    const hogarCategory = categories.find(cat => cat.name === 'Hogar');
    for (let i = 0; i < 5; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.datatype.number({ min: 50, max: 1000, precision: 0.01 }),
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        code: faker.random.alphaNumeric(8).toUpperCase(),
        stock: faker.datatype.number({ min: 5, max: 50 }),
        stock_min: faker.datatype.number({ min: 2, max: 10 }),
        category_id: hogarCategory.id,
        created_at: faker.date.past()
      });
    }

    // Productos de Deportes
    const deportesCategory = categories.find(cat => cat.name === 'Deportes');
    for (let i = 0; i < 5; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.datatype.number({ min: 30, max: 500, precision: 0.01 }),
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        code: faker.random.alphaNumeric(8).toUpperCase(),
        stock: faker.datatype.number({ min: 15, max: 80 }),
        stock_min: faker.datatype.number({ min: 5, max: 15 }),
        category_id: deportesCategory.id,
        created_at: faker.date.past()
      });
    }

    // Productos de Libros
    const librosCategory = categories.find(cat => cat.name === 'Libros');
    for (let i = 0; i < 5; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.datatype.number({ min: 10, max: 50, precision: 0.01 }),
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        code: faker.random.alphaNumeric(8).toUpperCase(),
        stock: faker.datatype.number({ min: 20, max: 100 }),
        stock_min: faker.datatype.number({ min: 5, max: 15 }),
        category_id: librosCategory.id,
        created_at: faker.date.past()
      });
    }

    await queryInterface.bulkInsert('products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
