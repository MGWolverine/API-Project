'use strict';

const { Membership } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate([
      {
        userId: 2,
        groupId: 1,
        status: "co-host"
      },
      {
        userId: 3,
        groupId: 2,
        status: "member"
      },
      {
        userId: 4,
        groupId: 3,
        status: "member"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: [
        'member', 'co-host'
      ] }
    }, {});
  }
};
