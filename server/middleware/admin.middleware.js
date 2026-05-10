const { error } = require('../utils/responseHelper');

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Not authorized', 403);
  }
  return next();
};
