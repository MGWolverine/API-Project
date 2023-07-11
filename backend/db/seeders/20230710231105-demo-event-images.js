'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        url: "www.url1.com",
        preview: true
      },
      {
        url: "www.url2.com",
        preview: true
      },
      {
        url: "www.url3.com",
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        'www.url1.com', 'www.url1.com', 'www.url3.com'
      ] }
    }, {});
  }
};
