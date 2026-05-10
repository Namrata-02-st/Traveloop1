const express = require('express');
const controller = require('../controllers/stop.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { stopRules, reorderRules } = require('../validators/stop.validator');

const router = express.Router({ mergeParams: true });

router.use(auth);
router.get('/', controller.listStops);
router.post('/', stopRules, validate, controller.createStop);
router.put('/reorder', reorderRules, validate, controller.reorderStops);
router.put('/:stopId', controller.updateStop);
router.delete('/:stopId', controller.deleteStop);

module.exports = router;
