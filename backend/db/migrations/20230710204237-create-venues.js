'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Groups",
        },
        onDelete: 'cascade'
      },
      address: {
        type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Street address is required"
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
      lat: {
        type: Sequelize.DECIMAL,
          validate: {
            isDecimal: {
              msg: "Latitude is not valid"
            }
          }
      },
      lng: {
        type: Sequelize.DECIMAL,
          validate: {
            isDecimal: {
              msg: "Longitude is not valid"
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
    options.tableName = "Venues";
    await queryInterface.dropTable(options);
  }
};