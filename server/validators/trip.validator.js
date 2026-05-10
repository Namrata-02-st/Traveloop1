const { body } = require('express-validator');

exports.tripRules = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Trip title is required.'),
  body('start_date').isISO8601().withMessage('Start date is required.'),
  body('end_date').isISO8601().withMessage('End date is required.'),
  body('total_budget').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Budget cannot be negative.'),
  body('currency').optional({ values: 'falsy' }).trim().isLength({ min: 3, max: 10 }).withMessage('Currency is invalid.')
];
