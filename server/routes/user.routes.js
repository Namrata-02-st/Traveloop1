const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { avatarUpload } = require('../config/multer');

const router = express.Router();

router.use(auth);
router.get('/:id', controller.getUser);
router.put(
  '/:id',
  [body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.')],
  validate,
  controller.updateUser
);
router.put('/:id/avatar', avatarUpload.single('avatar'), controller.uploadAvatar);
router.delete('/:id', controller.deleteUser);
router.get('/:id/saved-destinations', controller.getSavedDestinations);
router.post(
  '/:id/saved-destinations',
  [body('city_id').isInt({ min: 1 }).withMessage('City is required.')],
  validate,
  controller.saveDestination
);
router.delete('/:id/saved-destinations/:cityId', controller.removeDestination);

module.exports = router;
