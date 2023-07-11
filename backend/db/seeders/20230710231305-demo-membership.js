'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        status: active
      },
      {
        status: active
      },
      {
        status: active
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
