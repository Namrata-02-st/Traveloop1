const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'PackingItem',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      trip_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(200), allowNull: false },
      category: {
        type: DataTypes.ENUM('clothing', 'documents', 'electronics', 'toiletries', 'medicine', 'food', 'other'),
        defaultValue: 'other'
      },
      is_packed: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'packing_items',
      timestamps: false
    }
  );
