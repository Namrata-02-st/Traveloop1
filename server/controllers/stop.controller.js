const { sequelize, Trip, Stop, City, StopActivity, CityActivity } = require('../models');
const { success, error } = require('../utils/responseHelper');
const { assertTripOwner } = require('./trip.controller');

const stopIncludes = [City, { model: StopActivity, include: [CityActivity] }];

const validateStopDates = (trip, arrive, depart) => {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const a = new Date(arrive);
  const d = new Date(depart);
  if (d < a) return 'Depart date must be after arrive date';
  if (a < start || d > end) return 'Stop dates must be within trip dates';
  return null;
};

exports.listStops = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const stops = await Stop.findAll({
      where: { trip_id: req.params.tripId },
      include: stopIncludes,
      order: [['order_index', 'ASC']]
    });
    return success(res, stops, 'Stops');
  } catch (err) {
    return next(err);
  }
};

exports.createStop = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const city = await City.findByPk(req.body.city_id);
    if (!city) return error(res, 'City not found', 404);

    const dateError = validateStopDates(guard.trip, req.body.arrive_date, req.body.depart_date);
    if (dateError) return error(res, dateError, 422);

    const count = await Stop.count({ where: { trip_id: req.params.tripId } });
    const stop = await Stop.create({
      trip_id: req.params.tripId,
      city_id: req.body.city_id,
      order_index: count,
      arrive_date: req.body.arrive_date,
      depart_date: req.body.depart_date,
      notes: req.body.notes?.trim() || null,
      est_stay_cost: req.body.est_stay_cost || 0
    });
    return success(res, await Stop.findByPk(stop.id, { include: stopIncludes }), 'Stop added', 201);
  } catch (err) {
    return next(err);
  }
};

exports.updateStop = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const stop = await Stop.findOne({ where: { id: req.params.stopId, trip_id: req.params.tripId } });
    if (!stop) return error(res, 'Stop not found', 404);

    const arrive = req.body.arrive_date || stop.arrive_date;
    const depart = req.body.depart_date || stop.depart_date;
    const dateError = validateStopDates(guard.trip, arrive, depart);
    if (dateError) return error(res, dateError, 422);

    ['city_id', 'arrive_date', 'depart_date', 'notes', 'est_stay_cost'].forEach((field) => {
      if (req.body[field] !== undefined) stop[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    });
    await stop.save();
    return success(res, await Stop.findByPk(stop.id, { include: stopIncludes }), 'Stop updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteStop = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const deleted = await Stop.destroy({ where: { id: req.params.stopId, trip_id: req.params.tripId } });
    if (!deleted) return error(res, 'Stop not found', 404);
    return success(res, null, 'Stop deleted');
  } catch (err) {
    return next(err);
  }
};

exports.reorderStops = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) {
      await transaction.rollback();
      return error(res, guard.error, guard.status);
    }

    const stops = await Stop.findAll({ where: { trip_id: req.params.tripId }, transaction });
    const validIds = new Set(stops.map((stop) => Number(stop.id)));
    if (req.body.orderedIds.some((id) => !validIds.has(Number(id)))) {
      await transaction.rollback();
      return error(res, 'orderedIds must contain only stops from this trip', 422);
    }

    await Promise.all(
      req.body.orderedIds.map((id, index) =>
        Stop.update({ order_index: index }, { where: { id, trip_id: req.params.tripId }, transaction })
      )
    );
    await transaction.commit();

    const ordered = await Stop.findAll({ where: { trip_id: req.params.tripId }, include: stopIncludes, order: [['order_index', 'ASC']] });
    return success(res, ordered, 'Stops reordered');
  } catch (err) {
    await transaction.rollback();
    return next(err);
  }
};
