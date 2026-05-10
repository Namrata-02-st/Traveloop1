const { PackingItem } = require('../models');
const { success, error } = require('../utils/responseHelper');
const { assertTripOwner } = require('./trip.controller');

exports.listItems = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const items = await PackingItem.findAll({ where: { trip_id: req.params.tripId }, order: [['created_at', 'DESC']] });
    return success(res, items, 'Packing items');
  } catch (err) {
    return next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    if (!req.body.name?.trim()) return error(res, 'Item name is required', 422);
    const item = await PackingItem.create({
      trip_id: req.params.tripId,
      name: req.body.name.trim(),
      category: req.body.category || 'other',
      is_packed: Boolean(req.body.is_packed)
    });
    return success(res, item, 'Packing item added', 201);
  } catch (err) {
    return next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const item = await PackingItem.findOne({ where: { id: req.params.itemId, trip_id: req.params.tripId } });
    if (!item) return error(res, 'Packing item not found', 404);

    ['name', 'category', 'is_packed'].forEach((field) => {
      if (req.body[field] !== undefined) item[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    });
    await item.save();
    return success(res, item, 'Packing item updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const deleted = await PackingItem.destroy({ where: { id: req.params.itemId, trip_id: req.params.tripId } });
    if (!deleted) return error(res, 'Packing item not found', 404);
    return success(res, null, 'Packing item deleted');
  } catch (err) {
    return next(err);
  }
};

exports.resetItems = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    await PackingItem.update({ is_packed: false }, { where: { trip_id: req.params.tripId } });
    const items = await PackingItem.findAll({ where: { trip_id: req.params.tripId }, order: [['created_at', 'DESC']] });
    return success(res, items, 'Packing list reset');
  } catch (err) {
    return next(err);
  }
};
