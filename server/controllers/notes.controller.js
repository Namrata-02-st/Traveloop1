const { TripNote, Stop, City } = require('../models');
const { success, error } = require('../utils/responseHelper');
const { assertTripOwner } = require('./trip.controller');

const includeStop = [{ model: Stop, include: [City] }];

exports.listNotes = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const where = { trip_id: req.params.tripId };
    if (req.query.stopId) where.stop_id = req.query.stopId;
    const notes = await TripNote.findAll({ where, include: includeStop, order: [['created_at', 'DESC']] });
    return success(res, notes, 'Notes');
  } catch (err) {
    return next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    if (!req.body.content?.trim()) return error(res, 'Note content is required', 422);
    if (req.body.stop_id) {
      const stop = await Stop.findOne({ where: { id: req.body.stop_id, trip_id: req.params.tripId } });
      if (!stop) return error(res, 'Stop not found for this trip', 422);
    }
    const note = await TripNote.create({
      trip_id: req.params.tripId,
      stop_id: req.body.stop_id || null,
      content: req.body.content.trim()
    });
    return success(res, await TripNote.findByPk(note.id, { include: includeStop }), 'Note added', 201);
  } catch (err) {
    return next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const note = await TripNote.findOne({ where: { id: req.params.noteId, trip_id: req.params.tripId } });
    if (!note) return error(res, 'Note not found', 404);

    if (req.body.stop_id) {
      const stop = await Stop.findOne({ where: { id: req.body.stop_id, trip_id: req.params.tripId } });
      if (!stop) return error(res, 'Stop not found for this trip', 422);
      note.stop_id = req.body.stop_id;
    } else if (req.body.stop_id === null || req.body.stop_id === '') {
      note.stop_id = null;
    }
    if (req.body.content !== undefined) note.content = req.body.content.trim();
    await note.save();
    return success(res, await TripNote.findByPk(note.id, { include: includeStop }), 'Note updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const guard = await assertTripOwner(req, req.params.tripId);
    if (guard.error) return error(res, guard.error, guard.status);
    const deleted = await TripNote.destroy({ where: { id: req.params.noteId, trip_id: req.params.tripId } });
    if (!deleted) return error(res, 'Note not found', 404);
    return success(res, null, 'Note deleted');
  } catch (err) {
    return next(err);
  }
};
