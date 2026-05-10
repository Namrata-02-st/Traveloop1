const { Op } = require('sequelize');
const { City, CityActivity } = require('../models');
const { success, error } = require('../utils/responseHelper');

exports.listCities = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { country: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    if (req.query.country) where.country = req.query.country;
    if (req.query.region) where.region = req.query.region;
    if (req.query.minCost || req.query.maxCost) {
      where.cost_index = {
        ...(req.query.minCost && { [Op.gte]: Number(req.query.minCost) }),
        ...(req.query.maxCost && { [Op.lte]: Number(req.query.maxCost) })
      };
    }
    const order = req.query.sort === 'popular' ? [['popularity', 'DESC']] : [['name', 'ASC']];
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const cities = await City.findAll({ where, order, limit });
    return success(res, cities, 'Cities');
  } catch (err) {
    return next(err);
  }
};

exports.getCity = async (req, res, next) => {
  try {
    const city = await City.findByPk(req.params.id, { include: [CityActivity] });
    if (!city) return error(res, 'City not found', 404);
    return success(res, city, 'City detail');
  } catch (err) {
    return next(err);
  }
};

exports.getCityActivities = async (req, res, next) => {
  try {
    const where = { city_id: req.params.id };
    if (req.query.category && req.query.category !== 'all') where.category = req.query.category;
    const activities = await CityActivity.findAll({ where, order: [['category', 'ASC'], ['name', 'ASC']] });
    return success(res, activities, 'City activities');
  } catch (err) {
    return next(err);
  }
};
