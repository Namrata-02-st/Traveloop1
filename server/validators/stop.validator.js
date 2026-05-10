const { body } = require('express-validator');

exports.stopRules = [
  body('city_id').isInt({ min: 1 }).withMessage('City is required.'),
  body('arrive_date').isISO8601().withMessage('Arrive date is required.'),
  body('depart_date').isISO8601().withMessage('Depart date is required.'),
  body('est_stay_cost').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Stay cost cannot be negative.')
];

exports.reorderRules = [
  body('orderedIds').isArray({ min: 1 }).withMessage('orderedIds must be a non-empty array.'),
  body('orderedIds.*').isInt({ min: 1 }).withMessage('Each stop id must be valid.')
];
