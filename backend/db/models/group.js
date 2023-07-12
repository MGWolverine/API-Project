'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(
        models.Event,
        {foreignKey: 'groupId', onDelete: 'CASCADE'}
      );
      Group.hasMany(
        models.Membership,
        {foreignKey: 'groupId', onDelete: 'CASCADE'}
      );
      Group.hasMany(
        models.Venue,
        {foreignKey: 'groupId', onDelete: 'CASCADE'}
      );
      Group.hasMany(
        models.GroupImage,
        {foreignKey: 'groupId', onDelete: 'CASCADE'}
      );
      Group.belongsTo(
        models.User,
        {foreignKey: 'organizerId', as: 'numMembers', onDelete: 'CASCADE'}
      )
    }
  }
  Group.init({
      organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Organizer ID is required' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Name is required' },
          len: { args: [1, 60], msg: 'Name must be 60 characters or less' },
        },
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'About is required' },
          len: { args: [50, Infinity], msg: 'About must be 50 characters or more' },
        },
      },
      type: {
        type: DataTypes.ENUM('Online', 'In person'),
        allowNull: false,
        validate: {
          notNull: { msg: 'Type is required' },
          isIn: {
            args: [['Online', 'In person']],
            msg: "Type must be 'Online' or 'In person'",
          },
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: 'Private is required' },
          isBoolean: { msg: 'Private must be a boolean' },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'City is required' },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'State is required' },
        },
      },
    }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};