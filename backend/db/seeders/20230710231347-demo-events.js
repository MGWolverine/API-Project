'use strict';

const { Event } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "Boxing in the Park",
        description: "We gonna be boxing in the park",
        type: "In person",
        capacity: 20,
        price: 20,
        startDate: '2023-02-25',
        endDate: '2023-02-26'
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Run on the Beach",
        description: "We gonna be running on the beach",
        type: "In person",
        capacity: 50,
        price: 20,
        startDate: '2023-03-25',
        endDate: '2023-03-26'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Hiking in the Mountains",
        description: "We gonna be hiking in the mountains",
        type: "In person",
        capacity: 10,
        price: 10,
        startDate: '2023-04-25',
        endDate: '2023-04-26'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Boxing in the Park', 'Run on the Beach', 'Hiking in the Mountains'
      ] }
    }, {});
  }
};
