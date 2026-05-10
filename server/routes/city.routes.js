const express = require('express');
const controller = require('../controllers/city.controller');

const router = express.Router();

router.get('/', controller.listCities);
router.get('/:id', controller.getCity);
router.get('/:id/activities', controller.getCityActivities);

module.exports = router;
