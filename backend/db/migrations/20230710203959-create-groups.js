'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
        },
        onDelete: 'cascade'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1,60],
          notEmpty: {
            msg: "Name must be 60 characters or less"
          }
        }
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [30, Infinity],
          notEmpty: {
            msg: "About must be 30 characters or more"
          }
        }
      },
      type: {
        type: Sequelize.ENUM('Online', 'In person'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Online', 'In person']],
            msg: "Type must be 'Online' or 'In person'"
          }
        }
      },
      private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          isBoolean: {
            msg: "Private must be a boolean"
          }
        }
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City is required"
          }
        }
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "State is required"
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.dropTable(options);
  }
};