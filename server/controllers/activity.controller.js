const { Op } = require('sequelize');
const { Stop, Trip, StopActivity, CityActivity, City } = require('../models');
const { success, error } = require('../utils/responseHelper');

const assertStopOwner = async (req, stopId) => {
  const stop = await Stop.findByPk(stopId, { include: [Trip] });
  if (!stop) return { error: 'Stop not found', status: 404 };
  if (req.user.role !== 'admin' && Number(stop.Trip.user_id) !== Number(req.user.id)) {
    return { error: 'Not authorized', status: 403 };
  }
  return { stop };
};

exports.searchActivities = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.search) where.name = { [Op.like]: `%${req.query.search}%` };
    if (req.query.category && req.query.category !== 'all') where.category = req.query.category;
    if (req.query.city) where.city_id = req.query.city;
    if (req.query.minCost || req.query.maxCost) {
      where.est_cost = {
        ...(req.query.minCost && { [Op.gte]: Number(req.query.minCost) }),
        ...(req.query.maxCost && { [Op.lte]: Number(req.query.maxCost) })
      };
    }
    if (req.query.minDuration || req.query.maxDuration) {
      where.est_duration = {
        ...(req.query.minDuration && { [Op.gte]: Number(req.query.minDuration) }),
        ...(req.query.maxDuration && { [Op.lte]: Number(req.query.maxDuration) })
      };
    }
    const activities = await CityActivity.findAll({ where, include: [City], limit: 100, order: [['name', 'ASC']] });
    return success(res, activities, 'Activities');
  } catch (err) {
    return next(err);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const activity = await CityActivity.findByPk(req.params.id, { include: [City] });
    if (!activity) return error(res, 'Activity not found', 404);
    return success(res, activity, 'Activity detail');
  } catch (err) {
    return next(err);
  }
};

exports.listStopActivities = async (req, res, next) => {
  try {
    const guard = await assertStopOwner(req, req.params.stopId);
    if (guard.error) return error(res, guard.error, guard.status);
    const activities = await StopActivity.findAll({
      where: { stop_id: req.params.stopId },
      include: [CityActivity],
      order: [['scheduled_date', 'ASC'], ['scheduled_time', 'ASC']]
    });
    return success(res, activities, 'Stop activities');
  } catch (err) {
    return next(err);
  }
};

exports.addStopActivity = async (req, res, next) => {
  try {
    const guard = await assertStopOwner(req, req.params.stopId);
    if (guard.error) return error(res, guard.error, guard.status);

    if (!req.body.city_activity_id && !req.body.custom_name) {
      return error(res, 'Choose a city activity or enter a custom activity name', 422);
    }

    if (req.body.city_activity_id) {
      const cityActivity = await CityActivity.findByPk(req.body.city_activity_id);
      if (!cityActivity || Number(cityActivity.city_id) !== Number(guard.stop.city_id)) {
        return error(res, 'Activity is not available for this stop city', 422);
      }
    }

    const activity = await StopActivity.create({
      stop_id: req.params.stopId,
      city_activity_id: req.body.city_activity_id || null,
      custom_name: req.body.custom_name?.trim() || null,
      custom_cost: req.body.custom_cost || 0,
      custom_duration: req.body.custom_duration || null,
      scheduled_date: req.body.scheduled_date || null,
      scheduled_time: req.body.scheduled_time || null,
      notes: req.body.notes?.trim() || null
    });
    return success(res, await StopActivity.findByPk(activity.id, { include: [CityActivity] }), 'Activity added', 201);
  } catch (err) {
    return next(err);
  }
};

exports.updateStopActivity = async (req, res, next) => {
  try {
    const guard = await assertStopOwner(req, req.params.stopId);
    if (guard.error) return error(res, guard.error, guard.status);
    const activity = await StopActivity.findOne({ where: { id: req.params.actId, stop_id: req.params.stopId } });
    if (!activity) return error(res, 'Activity not found', 404);

    ['custom_name', 'custom_cost', 'custom_duration', 'scheduled_date', 'scheduled_time', 'notes'].forEach((field) => {
      if (req.body[field] !== undefined) activity[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    });
    await activity.save();
    return success(res, await StopActivity.findByPk(activity.id, { include: [CityActivity] }), 'Activity updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteStopActivity = async (req, res, next) => {
  try {
    const guard = await assertStopOwner(req, req.params.stopId);
    if (guard.error) return error(res, guard.error, guard.status);
    const deleted = await StopActivity.destroy({ where: { id: req.params.actId, stop_id: req.params.stopId } });
    if (!deleted) return error(res, 'Activity not found', 404);
    return success(res, null, 'Activity removed');
  } catch (err) {
    return next(err);
  }
};
