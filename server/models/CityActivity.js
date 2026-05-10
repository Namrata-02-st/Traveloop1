const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'CityActivity',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      city_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(200), allowNull: false },
      category: {
        type: DataTypes.ENUM('sightseeing', 'food', 'adventure', 'culture', 'shopping', 'nightlife', 'nature', 'wellness'),
        allowNull: false
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      est_duration: { type: DataTypes.FLOAT, allowNull: true },
      est_cost: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
      image_url: { type: DataTypes.STRING(255), allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'city_activities',
      timestamps: false,
      indexes: [{ unique: true, fields: ['city_id', 'name'] }]
    }
  );
