const express = require('express');
const controller = require('../controllers/packing.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router.use(auth);
router.get('/', controller.listItems);
router.post('/', controller.createItem);
router.put('/:itemId', controller.updateItem);
router.delete('/:itemId', controller.deleteItem);
router.delete('/', controller.resetItems);

module.exports = router;
