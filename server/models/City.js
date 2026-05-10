const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'City',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      country: { type: DataTypes.STRING(100), allowNull: false },
      region: { type: DataTypes.STRING(100), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      cost_index: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      popularity: { type: DataTypes.INTEGER, defaultValue: 0 },
      image_url: { type: DataTypes.STRING(255), allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'cities',
      timestamps: false,
      indexes: [{ unique: true, fields: ['name', 'country'] }]
    }
  );
