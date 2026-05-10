const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken, verifyToken } = require('../utils/jwtHelper');
const { success, error } = require('../utils/responseHelper');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar_url: user.avatar_url,
  role: user.role,
  language: user.language,
  is_active: user.is_active,
  created_at: user.created_at
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existing) return error(res, 'Email already registered', 409);

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hash
    });
    const token = generateToken({ id: user.id, role: user.role });
    return success(res, { user: publicUser(user), token }, 'Account created', 201);
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user || !user.is_active) return error(res, 'Invalid email or password', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'Invalid email or password', 401);

    const token = generateToken({ id: user.id, role: user.role }, remember ? '30d' : process.env.JWT_EXPIRES_IN || '7d');
    return success(res, { user: publicUser(user), token }, 'Logged in');
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (_req, res, next) => {
  try {
    return success(res, null, 'Logged out');
  } catch (err) {
    return next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    return success(res, publicUser(req.user), 'Current user');
  } catch (err) {
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_active) return error(res, 'No active account found for this email', 404);

    const resetToken = generateToken({ id: user.id, email: user.email, purpose: 'password-reset' }, '20m');
    return success(res, { resetToken }, 'Reset token generated');
  } catch (err) {
    return next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const decoded = verifyToken(req.body.token);
    if (decoded.purpose !== 'password-reset') return error(res, 'Invalid reset token', 400);

    const user = await User.findByPk(decoded.id);
    if (!user || user.email !== decoded.email) return error(res, 'Invalid reset token', 400);

    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
    return success(res, null, 'Password reset successful');
  } catch (_err) {
    return error(res, 'Invalid or expired reset token', 400);
  }
};
