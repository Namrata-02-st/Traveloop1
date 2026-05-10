const bcrypt = require('bcryptjs');
const { User, City, SavedDestination, Trip } = require('../models');
const { success, error } = require('../utils/responseHelper');

const canAccessUser = (req, id) => req.user.role === 'admin' || Number(req.user.id) === Number(id);

exports.getUser = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'role', 'language', 'is_active', 'created_at'],
      include: [{ model: Trip, attributes: ['id'] }]
    });
    if (!user) return error(res, 'User not found', 404);
    return success(res, { ...user.toJSON(), totalTrips: user.Trips?.length || 0 }, 'User profile');
  } catch (err) {
    return next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.language) user.language = req.body.language.trim();
    await user.save();
    return success(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: user.role,
      language: user.language,
      is_active: user.is_active,
      created_at: user.created_at
    }, 'Profile updated');
  } catch (err) {
    return next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    if (!req.file) return error(res, 'Avatar file is required', 400);

    user.avatar_url = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    return success(res, { avatar_url: user.avatar_url }, 'Avatar updated');
  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);

    if (req.user.role !== 'admin' && req.body.confirmEmail !== user.email) {
      return error(res, 'Type your email to confirm account deletion', 400);
    }
    user.is_active = false;
    user.password = await bcrypt.hash(`disabled-${Date.now()}`, 12);
    await user.save();
    return success(res, null, 'Account deactivated');
  } catch (err) {
    return next(err);
  }
};

exports.getSavedDestinations = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    const cities = await user.getSavedDestinations({ order: [['name', 'ASC']] });
    return success(res, cities, 'Saved destinations');
  } catch (err) {
    return next(err);
  }
};

exports.saveDestination = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    const city = await City.findByPk(req.body.city_id);
    if (!city) return error(res, 'City not found', 404);
    await SavedDestination.findOrCreate({ where: { user_id: req.params.id, city_id: req.body.city_id } });
    return success(res, city, 'Destination saved', 201);
  } catch (err) {
    return next(err);
  }
};

exports.removeDestination = async (req, res, next) => {
  try {
    if (!canAccessUser(req, req.params.id)) return error(res, 'Not authorized', 403);
    await SavedDestination.destroy({ where: { user_id: req.params.id, city_id: req.params.cityId } });
    return success(res, null, 'Destination removed');
  } catch (err) {
    return next(err);
  }
};
