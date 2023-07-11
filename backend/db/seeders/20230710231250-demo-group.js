'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        name: "GroupName1",
        about: "about1",
        type: "active",
        private: true,
        city: "City1",
        state: "State1"
      },
      {
        name: "GroupName2",
        about: "about2",
        type: "active",
        private: true,
        city: "City2",
        state: "State2"
      },
      {
        name: "GroupName3",
        about: "about3",
        type: "active",
        private: true,
        city: "City3",
        state: "State3"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'GroupName1', 'GroupName2', 'GroupName3'
      ] }
    }, {});
  }
};
