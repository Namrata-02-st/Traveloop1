const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Trip',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      cover_url: { type: DataTypes.STRING(255), allowNull: true },
      start_date: { type: DataTypes.DATEONLY, allowNull: false },
      end_date: { type: DataTypes.DATEONLY, allowNull: false },
      total_budget: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
      is_public: { type: DataTypes.BOOLEAN, defaultValue: false },
      share_token: { type: DataTypes.STRING(64), allowNull: true, unique: true },
      status: { type: DataTypes.ENUM('planning', 'ongoing', 'completed'), defaultValue: 'planning' }
    },
    {
      tableName: 'trips',
      underscored: true,
      timestamps: true
    }
  );
