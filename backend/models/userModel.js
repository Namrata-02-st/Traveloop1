const db = require("../config/db");

/*
FIND USER BY EMAIL
*/

const findUserByEmail = (email, callback) => {
  const query =
    "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], callback);
};

/*
CREATE USER
*/

const createUser = (
  full_name,
  email,
  password_hash,
  callback
) => {
  const query = `
    INSERT INTO users
    (full_name, email, password_hash)
    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [full_name, email, password_hash],
    callback
  );
};

/*
GET USER PROFILE
*/

const getUserById = (id, callback) => {
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

  db.query(query, [id], callback);
};

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
};