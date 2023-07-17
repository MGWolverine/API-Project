'use strict';

const { Venue } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "address1",
        city: "city1",
        state: "state1",
        lat: 23.1,
        lng: 41.6
      },
      {
        groupId: 2,
        address: "address2",
        city: "city2",
        state: "state2",
        lat: 24.1,
        lng: 43.6
      },
      {
        groupId: 3,
        address: "address3",
        city: "city3",
        state: "state3",
        lat: 22.1,
        lng: 40.6
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: [
        'address1', 'address2', 'address3'
      ] }
    }, {});
  }
};
