'use strict';

const { Group } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "GroupName1",
        about: "about1",
        type: "In person",
        private: true,
        city: "City1",
        state: "State1"
      },
      {
        organizerId: 2,
        name: "GroupName2",
        about: "about2",
        type: "In person",
        private: true,
        city: "City2",
        state: "State2"
      },
      {
        organizerId: 3,
        name: "GroupName3",
        about: "about3",
        type: "In person",
        private: true,
        city: "City3",
        state: "State3"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'GroupName1', 'GroupName2', 'GroupName3'
      ] }
    }, {});
  }
};
