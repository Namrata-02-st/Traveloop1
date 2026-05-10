const crypto = require('crypto');
const { Op } = require('sequelize');
const { Trip, Stop, City, StopActivity, CityActivity, PackingItem, TripNote, User } = require('../models');
const { calculateBudget } = require('../utils/budgetCalculator');
const { success, error } = require('../utils/responseHelper');

const number = (value) => Number(value || 0);

const includeTripDetail = [
  {
    model: Stop,
    include: [
      City,
      {
        model: StopActivity,
        include: [CityActivity]
      }
    ]
  },
  { model: User, attributes: ['id', 'name', 'email', 'avatar_url'] }
];

const assertTripOwner = async (req, tripId) => {
  const trip = await Trip.findByPk(tripId);
  if (!trip) return { error: 'Trip not found', status: 404 };
  if (req.user.role !== 'admin' && Number(trip.user_id) !== Number(req.user.id)) {
    return { error: 'Not authorized', status: 403 };
  }
  return { trip };
};

const decorateTrip = async (trip) => {
  const json = trip.toJSON();
  const stops = json.Stops || [];
  const estimatedCost = stops.reduce((sum, stop) => {
    const activities = (stop.StopActivities || []).reduce((inner, act) => {
      const cost = act.CityActivity ? act.CityActivity.est_cost : act.custom_cost;
      return inner + number(cost);
    }, 0);
    return sum + number(stop.est_stay_cost) + activities;
  }, 0);
  return { ...json, stopCount: stops.length, estimatedCost };
};

exports.listTrips = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const where = { user_id: req.user.id };
    if (req.query.status) where.status = req.query.status;

    let order = [['created_at', 'DESC']];
    if (req.query.sort === 'oldest') order = [['created_at', 'ASC']];
    if (req.query.sort === 'upcoming') order = [['start_date', 'ASC']];
    if (req.query.sort === 'completed') where.status = 'completed';

    const trips = await Trip.findAll({
      where,
      limit,
      order,
      include: [
        {
          model: Stop,
          include: [{ model: StopActivity, include: [CityActivity] }, City]
        }
      ]
    });
    return success(res, await Promise.all(trips.map(decorateTrip)), 'Trips');
  } catch (err) {
    return next(err);
  }
};

exports.createTrip = async (req, res, next) => {
  try {
    const start = new Date(req.body.start_date);
    const end = new Date(req.body.end_date);
    if (end < start) return error(res, 'End date must be after start date', 422);

    const trip = await Trip.create({
      user_id: req.user.id,
      title: req.body.title.trim(),
      description: req.body.description?.trim() || null,
      cover_url: req.file ? `/uploads/covers/${req.file.filename}` : null,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      total_budget: req.body.total_budget || 0,
      currency: req.body.currency || 'USD',
      status: req.body.status || 'planning'
    });
    return success(res, trip, 'Trip created', 201);
  } catch (err) {
    return next(err);
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.id);
    if (guard.error) return error(res, guard.error, guard.status);

    const trip = await Trip.findByPk(req.params.id, { include: includeTripDetail });
    return success(res, await decorateTrip(trip), 'Trip detail');
  } catch (err) {
    return next(err);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.id);
    if (guard.error) return error(res, guard.error, guard.status);
    const { trip } = guard;

    if (req.body.start_date && req.body.end_date && new Date(req.body.end_date) < new Date(req.body.start_date)) {
      return error(res, 'End date must be after start date', 422);
    }

    ['title', 'description', 'start_date', 'end_date', 'total_budget', 'currency', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
      }
    });
    if (req.file) trip.cover_url = `/uploads/covers/${req.file.filename}`;
    await trip.save();
    return success(res, trip, 'Trip updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.id);
    if (guard.error) return error(res, guard.error, guard.status);
    await guard.trip.destroy();
    return success(res, null, 'Trip deleted');
  } catch (err) {
    return next(err);
  }
};

exports.uploadCover = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.id);
    if (guard.error) return error(res, guard.error, guard.status);
    if (!req.file) return error(res, 'Cover file is required', 400);
    guard.trip.cover_url = `/uploads/covers/${req.file.filename}`;
    await guard.trip.save();
    return success(res, { cover_url: guard.trip.cover_url }, 'Cover updated');
  } catch (err) {
    return next(err);
  }
};

exports.toggleShare = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.id);
    if (guard.error) return error(res, guard.error, guard.status);
    const { trip } = guard;
    if (trip.is_public) {
      trip.is_public = false;
      trip.share_token = null;
    } else {
      trip.is_public = true;
      trip.share_token = crypto.randomBytes(32).toString('hex');
    }
    await trip.save();
    return success(res, { is_public: trip.is_public, share_token: trip.share_token }, 'Share settings updated');
  } catch (err) {
    return next(err);
  }
};

exports.exportTrip = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.id);
    if (guard.error) return error(res, guard.error, guard.status);
    const trip = await Trip.findByPk(req.params.id, { include: includeTripDetail });
    return success(res, trip, 'Trip export');
  } catch (err) {
    return next(err);
  }
};

exports.searchPublicTrips = async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      where: { is_public: true, title: { [Op.like]: `%${req.query.search || ''}%` } },
      include: [{ model: User, attributes: ['id', 'name'] }],
      limit: 20
    });
    return success(res, trips, 'Public trips');
  } catch (err) {
    return next(err);
  }
};

exports.getTripPackingAndNotes = async (tripId) => {
  const [packing, notes] = await Promise.all([
    PackingItem.findAll({ where: { trip_id: tripId } }),
    TripNote.findAll({ where: { trip_id: tripId } })
  ]);
  return { packing, notes };
};

exports.assertTripOwner = assertTripOwner;
exports.includeTripDetail = includeTripDetail;
exports.calculateBudget = calculateBudget;
