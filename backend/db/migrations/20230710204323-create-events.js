'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Venues",
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
          allowNull: false,
          validate: {
            notNull: {
              msg: "Venue does not exist",
            },
          },
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Groups",
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
          allowNull: false,
          validate: {
            notNull: {
              msg: "Group does not exist",
            },
          },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [5],
            msg: "Name must be at least 5 characters",
          },
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description is required",
          },
        },
      },
      type: {
        type: Sequelize.ENUM('Online', 'In person'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Online', 'In person']],
            msg: "Type must be 'Online' or 'In person'",
          },
        },
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Capacity must be an integer",
          },
        },
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Price is invalid",
          },
        },
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "Start date must be a valid date",
          },
          isFuture: {
            msg: "Start date must be in the future",
          },
        },
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "End date must be a valid date",
          },
          isAfterStart: function (value) {
            const startDate = new Date(this.startDate);
            if (value && startDate && value <= startDate) {
              throw new Error("End date must be after the start date");
            }
          },
        },
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
    options.tableName = 'Events';
    await queryInterface.dropTable(options);
  }
};