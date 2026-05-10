const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'SavedDestination',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      city_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'saved_destinations',
      timestamps: false,
      indexes: [{ unique: true, fields: ['user_id', 'city_id'] }]
    }
  );
