'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedAdminPassword = await bcrypt.hash('admin123', 2);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin',
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
