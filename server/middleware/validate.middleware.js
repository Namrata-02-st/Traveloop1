const { validationResult } = require('express-validator');
const { error } = require('../utils/responseHelper');

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return error(
    res,
    'Validation failed',
    422,
    result.array().map((item) => ({ field: item.path, message: item.msg }))
  );
};
