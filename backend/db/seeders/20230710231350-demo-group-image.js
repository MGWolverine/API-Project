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
        url: "www.url1.com",
        preview: true
      },
      {
        groupId: 2,
        url: "www.url2.com",
        preview: true
      },
      {
        groupId: 3,
        url: "www.url3.com",
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
