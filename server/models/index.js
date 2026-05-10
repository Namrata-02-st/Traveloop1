const sequelize = require('../config/db');

const User = require('./User')(sequelize);
const Trip = require('./Trip')(sequelize);
const Stop = require('./Stop')(sequelize);
const City = require('./City')(sequelize);
const CityActivity = require('./CityActivity')(sequelize);
const StopActivity = require('./StopActivity')(sequelize);
const PackingItem = require('./PackingItem')(sequelize);
const TripNote = require('./TripNote')(sequelize);
const SavedDestination = require('./SavedDestination')(sequelize);

User.hasMany(Trip, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'user_id' });

Trip.hasMany(Stop, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
Stop.belongsTo(Trip, { foreignKey: 'trip_id' });

City.hasMany(Stop, { foreignKey: 'city_id' });
Stop.belongsTo(City, { foreignKey: 'city_id' });

City.hasMany(CityActivity, { foreignKey: 'city_id', onDelete: 'CASCADE' });
CityActivity.belongsTo(City, { foreignKey: 'city_id' });

Stop.hasMany(StopActivity, { foreignKey: 'stop_id', onDelete: 'CASCADE' });
StopActivity.belongsTo(Stop, { foreignKey: 'stop_id' });

CityActivity.hasMany(StopActivity, { foreignKey: 'city_activity_id', onDelete: 'SET NULL' });
StopActivity.belongsTo(CityActivity, { foreignKey: 'city_activity_id' });

Trip.hasMany(PackingItem, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
PackingItem.belongsTo(Trip, { foreignKey: 'trip_id' });

Trip.hasMany(TripNote, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
TripNote.belongsTo(Trip, { foreignKey: 'trip_id' });
TripNote.belongsTo(Stop, { foreignKey: 'stop_id', onDelete: 'SET NULL' });
Stop.hasMany(TripNote, { foreignKey: 'stop_id' });

User.belongsToMany(City, {
  through: SavedDestination,
  foreignKey: 'user_id',
  otherKey: 'city_id',
  as: 'savedDestinations'
});
City.belongsToMany(User, {
  through: SavedDestination,
  foreignKey: 'city_id',
  otherKey: 'user_id',
  as: 'savedByUsers'
});

module.exports = {
  sequelize,
  User,
  Trip,
  Stop,
  City,
  CityActivity,
  StopActivity,
  PackingItem,
  TripNote,
  SavedDestination
};
