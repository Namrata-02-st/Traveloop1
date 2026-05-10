const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'dev_only_secret_change_me_before_use';

exports.generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') =>
  jwt.sign(payload, secret(), { expiresIn });

exports.verifyToken = (token) => jwt.verify(token, secret());
