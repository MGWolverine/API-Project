'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        name: "Boxing in the Park",
        description: "We gonna be boxing in the park",
        type: "active",
        capacity: 20,
        price: 20
      },
      {
        name: "Run on the Beach",
        description: "We gonna be running on the beach",
        type: "active",
        capacity: 50,
        price: 20
      },
      {
        name: "Hiking in the Mountains",
        description: "We gonna be hiking in the mountains",
        type: "active",
        capacity: 10,
        price: 10
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
