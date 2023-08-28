'use strict';

const { Attendance } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: "waitlist"
      },
      {
        eventId: 2,
        userId: 2,
        status: "pending"
      },
      {
        eventId: 3,
        userId: 3,
        status: "attending"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: [
        'pending', 'waitlist', 'attending'
      ] }
    }, {});
  }
};
