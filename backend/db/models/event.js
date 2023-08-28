'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(
        models.Attendance,
        {as: 'Attendances',foreignKey: 'eventId', onDelete: 'CASCADE'}
      );
      Event.hasMany(
        models.EventImage,
        {foreignKey: 'eventId', onDelete: 'CASCADE'}
      );
      Event.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
      );
      Event.belongsTo(
        models.Venue,
        {foreignKey: 'venueId'}
      );
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Venue does not exist",
        },
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Group does not exist",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5],
          msg: "Name must be at least 5 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
      },
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be 'Online' or 'In person'",
        },
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Capacity must be an integer",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Price is invalid",
        },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Start date must be a valid date",
        },
      },
    },
    endDate: {
      type: DataTypes.DATE,
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
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};