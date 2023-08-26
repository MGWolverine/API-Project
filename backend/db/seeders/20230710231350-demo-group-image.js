'use strict';

const { GroupImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://i.imgur.com/OeESOd4.jpg",
        preview: true
      },
      {
        groupId: 2,
        url: "https://i.imgur.com/c8KdpiC.png",
        preview: true
      },
      {
        groupId: 3,
        url: "https://i.imgur.com/SSVLmrV.png",
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [
        true, false
      ] }
    }, {});
  }
};
