const { error } = require('../utils/responseHelper');

module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.message && err.message.includes('Only JPG') ? 400 : 500);
  const details = process.env.NODE_ENV === 'development' && err.stack ? [{ stack: err.stack }] : null;
  return error(res, err.message || 'Server error', statusCode, details);
};
