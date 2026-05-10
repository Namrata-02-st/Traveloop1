const { User } = require('../models');
const { verifyToken } = require('../utils/jwtHelper');
const { error } = require('../utils/responseHelper');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) return error(res, 'Not authenticated', 401);

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'role', 'language', 'is_active', 'created_at']
    });

    if (!user || !user.is_active) return error(res, 'Not authenticated', 401);

    req.user = user;
    return next();
  } catch (_err) {
    return error(res, 'Not authenticated', 401);
  }
};
