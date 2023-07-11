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
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};