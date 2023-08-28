'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'mghazal@user.io',
        firstName: 'Mujahid',
        lastName: 'Ghazal',
        username: 'mghazal',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'aghazal@user.io',
        firstName: 'Ahmad',
        lastName: 'Ghazal',
        username: 'aghazal',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'ighazal@user.io',
        firstName: 'Ibrahim',
        lastName: 'Ghazal',
        username: 'ighazal',
        hashedPassword: bcrypt.hashSync('password2')
      }
    ], { validate: true }).catch(err => {
      for (let error of err.errors) {
        throw error.message
      }

      }
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['mghazal', 'aghazal', 'ighazal'] }
    }, {});
  }
};