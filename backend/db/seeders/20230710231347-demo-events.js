'use strict';

const { Event } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "Running in the Park",
        description: "We will be going for a nice run in the Park starting at 8:30 AM. Feel free to join!",
        type: "In person",
        capacity: 20,
        price: 5,
        startDate: '2023-02-25',
        endDate: '2023-02-26'
      },
      {
        venueId: 2,
        groupId: 2,
        name: "DOOM in the 90's",
        description: "90's themed DOOM Lan party, be there or be square!",
        type: "In person",
        capacity: 6,
        price: 20,
        startDate: '2023-03-25',
        endDate: '2023-03-26'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Barn Dance, Welcome All!",
        description: "Hey! just a group of people trying to get some social distancing square dancing done in this barn!",
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
        'Running in the Park', "DOOM in the 90's", 'Hiking in the Mountains'
      ] }
    }, {});
  }
};
