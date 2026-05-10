const { Trip } = require('../models');
const { calculateBudget } = require('../utils/budgetCalculator');
const { success, error } = require('../utils/responseHelper');
const { assertTripOwner } = require('./trip.controller');

exports.getBudget = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const budget = await calculateBudget(req.params.tripId);
    return success(res, budget, 'Budget breakdown');
  } catch (err) {
    return next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    if (Number(req.body.total_budget) < 0) return error(res, 'Budget cannot be negative', 422);
    await Trip.update({ total_budget: req.body.total_budget || 0 }, { where: { id: req.params.tripId } });
    const budget = await calculateBudget(req.params.tripId);
    return success(res, budget, 'Budget updated');
  } catch (err) {
    return next(err);
  }
};
