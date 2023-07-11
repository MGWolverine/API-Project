'use strict';

const { Membership } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate([
      {
        userId: 1,
        groupId: 1,
        status: "active"
      },
      {
        userId: 2,
        groupId: 2,
        status: "active"
      },
      {
        userId: 3,
        groupId: 3,
        status: "active"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Membership';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Boxing in the Park', 'Run on the Beach', 'Hiking in the Mountains'
      ] }
    }, {});
  }
};
