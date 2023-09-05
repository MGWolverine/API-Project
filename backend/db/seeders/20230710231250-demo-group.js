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
        organizerId: 2,
        name: "Park-Walk Group",
        about: "This group will promote physical activity, health, outdoor adventure, trips, but also eating, socializing, friendly meetups etc. with a workout and reward mentality. There will also be some dog friendly activities. Anyone can join and do any activities. You can do the physical activities only, or just eat, and socialize only, or both.",
        type: "In person",
        private: true,
        city: "Little Falls",
        state: "Minnesota"
      },
      {
        organizerId: 3,
        name: "Lan Party Meetup",
        about: "At our meetups, we bring together gamers of all levels and interests, from FPS fanatics to strategy game strategists. Bring your rig, your skills, and your competitive spirit, because it's time to game like never before. Engage in adrenaline-pumping battles, share gaming strategies, and connect with fellow gamers who share your passion.",
        type: "In person",
        private: true,
        city: "Cheyenne",
        state: "Wyoming"
      },
      {
        organizerId: 4,
        name: "Nebraska Barn Dance",
        about: "Our group is all about embracing the rich heritage of Nebraska through dance and music. Whether you're an experienced square dancer or a complete beginner, you'll find a warm and welcoming community here. We come together regularly to twirl, promenade, and do-si-do in the rustic charm of real barns, celebrating the simple joy of good company and great tunes.",
        type: "In person",
        private: true,
        city: "Omaha",
        state: "Nebraska"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Park-Walk Group', 'Lan Party Meetup', 'Nebraska Barn Dance'
      ] }
    }, {});
  }
};
