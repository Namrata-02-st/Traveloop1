const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Stop',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      trip_id: { type: DataTypes.INTEGER, allowNull: false },
      city_id: { type: DataTypes.INTEGER, allowNull: false },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      arrive_date: { type: DataTypes.DATEONLY, allowNull: false },
      depart_date: { type: DataTypes.DATEONLY, allowNull: false },
      notes: { type: DataTypes.TEXT, allowNull: true },
      est_stay_cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'stops',
      timestamps: false
    }
  );
