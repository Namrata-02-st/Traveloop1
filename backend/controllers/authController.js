const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

/*
REGISTER USER
POST /api/v1/auth/register
*/

const registerUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // check if all fields exist
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const checkQuery =
      "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      // user already exists
      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // hash password
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // insert user
      const insertQuery = `
        INSERT INTO users
        (full_name, email, password_hash)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertQuery,
        [full_name, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          // generate jwt token
          const token =
            generateToken(result.insertId);

          res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
LOGIN USER
POST /api/v1/auth/login
*/

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    const query =
      "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      // user not found
      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const user = result[0];

      // compare password
      const isMatch =
        await bcrypt.compare(
          password,
          user.password_hash
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // generate token
      const token =
        generateToken(user.id);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
GET PROFILE
GET /api/v1/auth/me
*/

const getProfile = (req, res) => {
  try {
    const query = `
      SELECT
      id,
      full_name,
      email,
      profile_image,
      bio,
      timezone
      FROM users
      WHERE id = ?
    `;

    db.query(query, [req.user], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        user: result[0],
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};