const express = require('express');
const controller = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

const router = express.Router();

router.use(auth, admin);
router.get('/stats', controller.stats);
router.get('/users', controller.users);
router.put('/users/:id/status', controller.setUserStatus);
router.delete('/users/:id', controller.deleteUser);
router.get('/trips', controller.trips);
router.get('/cities/popular', controller.popularCities);
router.get('/activities/popular', controller.popularActivities);

module.exports = router;
