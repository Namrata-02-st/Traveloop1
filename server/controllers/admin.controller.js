const { Op, fn, col, literal } = require('sequelize');
const { User, Trip, Stop, City } = require('../models');
const { success, error } = require('../utils/responseHelper');

exports.stats = async (_req, res, next) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const [totalUsers, totalTrips, publicTrips, tripsThisWeek] = await Promise.all([
      User.count(),
      Trip.count(),
      Trip.count({ where: { is_public: true } }),
      Trip.count({ where: { created_at: { [Op.gte]: since } } })
    ]);
    const activity = await Trip.findAll({
      attributes: [[fn('DATE', col('created_at')), 'day'], [fn('COUNT', col('id')), 'count']],
      where: { created_at: { [Op.gte]: literal('DATE_SUB(CURDATE(), INTERVAL 30 DAY)') } },
      group: [literal('DATE(created_at)')],
      order: [[literal('DATE(created_at)'), 'ASC']]
    });
    return success(res, { totalUsers, totalTrips, publicTrips, tripsThisWeek, activity }, 'Admin stats');
  } catch (err) {
    return next(err);
  }
};

exports.users = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Number(req.query.limit || 20));
    const { rows, count } = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at'],
      include: [{ model: Trip, attributes: ['id'] }],
      offset: (page - 1) * limit,
      limit,
      order: [['created_at', 'DESC']]
    });
    const users = rows.map((user) => ({ ...user.toJSON(), tripCount: user.Trips?.length || 0 }));
    return success(res, { users, count, page, totalPages: Math.ceil(count / limit) }, 'Users');
  } catch (err) {
    return next(err);
  }
};

exports.setUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    user.is_active = Boolean(req.body.is_active);
    await user.save();
    return success(res, user, 'User status updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    user.is_active = false;
    await user.save();
    return success(res, null, 'User deactivated');
  } catch (err) {
    return next(err);
  }
};

exports.trips = async (_req, res, next) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Stop, include: [City] }
      ],
      order: [['created_at', 'DESC']]
    });
    return success(res, trips, 'Trips');
  } catch (err) {
    return next(err);
  }
};

exports.popularCities = async (_req, res, next) => {
  try {
    const rows = await Stop.findAll({
      attributes: ['city_id', [fn('COUNT', col('Stop.id')), 'count']],
      include: [{ model: City, attributes: ['id', 'name', 'country'] }],
      group: ['city_id', 'City.id'],
      order: [[literal('count'), 'DESC']],
      limit: 10
    });
    return success(res, rows, 'Popular cities');
  } catch (err) {
    return next(err);
  }
};

exports.popularActivities = async (_req, res, next) => {
  try {
    const rows = await Stop.findAll({
      attributes: ['city_id', [fn('COUNT', col('Stop.id')), 'count']],
      include: [{ model: City, attributes: ['id', 'name'] }],
      group: ['city_id', 'City.id'],
      order: [[literal('count'), 'DESC']],
      limit: 10
    });
    return success(res, rows, 'Popular activities');
  } catch (err) {
    return next(err);
  }
};
