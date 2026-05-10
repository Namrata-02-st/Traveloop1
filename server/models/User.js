const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING(255), allowNull: false },
      avatar_url: { type: DataTypes.STRING(255), allowNull: true },
      role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
      language: { type: DataTypes.STRING(10), defaultValue: 'en' },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true
    }
  );
