const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'StopActivity',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      stop_id: { type: DataTypes.INTEGER, allowNull: false },
      city_activity_id: { type: DataTypes.INTEGER, allowNull: true },
      custom_name: { type: DataTypes.STRING(200), allowNull: true },
      custom_cost: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
      custom_duration: { type: DataTypes.FLOAT, allowNull: true },
      scheduled_date: { type: DataTypes.DATEONLY, allowNull: true },
      scheduled_time: { type: DataTypes.TIME, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'stop_activities',
      timestamps: false
    }
  );
