/*
========================================
VALIDATE REGISTER
========================================
*/

const validateRegister = (
  req,
  res,
  next
) => {
  const {
    full_name,
    email,
    password,
  } = req.body;

  // check empty fields
  if (
    !full_name ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Full name, email and password are required",
    });
  }

  // password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters",
    });
  }

  next();
};

/*
VALIDATE LOGIN
*/

const validateLogin = (
  req,
  res,
  next
) => {
  const { email, password } =
    req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Email and password are required",
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};