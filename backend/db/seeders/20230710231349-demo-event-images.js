'use strict';

const { EventImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://i.imgur.com/OeESOd4.jpg",
        preview: true
      },
      {
        eventId: 2,
        url: "www.url2.com",
        preview: true
      },
      {
        eventId: 3,
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
        'https://i.imgur.com/OeESOd4.jpg', 'https://i.imgur.com/c8KdpiC.png', 'https://i.imgur.com/SSVLmrV.png'
      ] }
    }, {});
  }
};
