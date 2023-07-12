'use strict';

const { Attendance } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: "In person"
      },
      {
        eventId: 2,
        userId: 2,
        status: "In person"
      },
      {
        eventId: 3,
        userId: 3,
        status: "In person"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendence';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Boxing in the Park', 'Run on the Beach', 'Hiking in the Mountains'
      ] }
    }, {});
  }
};
