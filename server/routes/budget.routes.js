const express = require('express');
const controller = require('../controllers/budget.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router.use(auth);
router.get('/', controller.getBudget);
router.put('/budget', controller.updateBudget);
router.put('/', controller.updateBudget);

module.exports = router;
