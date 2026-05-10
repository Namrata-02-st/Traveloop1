const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'TripNote',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      trip_id: { type: DataTypes.INTEGER, allowNull: false },
      stop_id: { type: DataTypes.INTEGER, allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: false }
    },
    {
      tableName: 'trip_notes',
      underscored: true,
      timestamps: true
    }
  );
