const express = require('express');
const controller = require('../controllers/share.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:token', controller.getSharedTrip);
router.post('/:token/copy', auth, controller.copySharedTrip);

module.exports = router;
