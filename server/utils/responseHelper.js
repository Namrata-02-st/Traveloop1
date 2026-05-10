exports.success = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, data, message });

exports.error = (res, message = 'Server error', statusCode = 500, details = null) =>
  res.status(statusCode).json({ success: false, error: message, ...(details && { details }) });
