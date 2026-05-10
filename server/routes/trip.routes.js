const express = require('express');
const controller = require('../controllers/trip.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { coverUpload } = require('../config/multer');
const { tripRules } = require('../validators/trip.validator');

const router = express.Router();

router.use(auth);
router.get('/', controller.listTrips);
router.post('/', coverUpload.single('cover'), tripRules, validate, controller.createTrip);
router.get('/:id', controller.getTrip);
router.put('/:id', coverUpload.single('cover'), controller.updateTrip);
router.delete('/:id', controller.deleteTrip);
router.put('/:id/cover', coverUpload.single('cover'), controller.uploadCover);
router.post('/:id/share', controller.toggleShare);
router.get('/:id/export', controller.exportTrip);

module.exports = router;
