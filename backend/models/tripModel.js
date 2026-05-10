const db = require("../config/db");

/*
CREATE TRIP
*/

const createTrip = (
  tripData,
  callback
) => {
  const query = `
    INSERT INTO trips
    (
      user_id,
      title,
      description,
      start_date,
      end_date,
      total_budget,
      currency_code,
      visibility
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      tripData.user_id,
      tripData.title,
      tripData.description,
      tripData.start_date,
      tripData.end_date,
      tripData.total_budget,
      tripData.currency_code,
      tripData.visibility,
    ],
    callback
  );
};

/*
GET ALL USER TRIPS
*/

const getTripsByUser = (
  user_id,
  callback
) => {
  const query =
    "SELECT * FROM trips WHERE user_id = ?";

  db.query(query, [user_id], callback);
};

/*
GET SINGLE TRIP
*/

const getTripById = (
  tripId,
  callback
) => {
  const query =
    "SELECT * FROM trips WHERE id = ?";

  db.query(query, [tripId], callback);
};

/*
DELETE TRIP
*/

const deleteTrip = (
  tripId,
  callback
) => {
  const query =
    "DELETE FROM trips WHERE id = ?";

  db.query(query, [tripId], callback);
};

module.exports = {
  createTrip,
  getTripsByUser,
  getTripById,
  deleteTrip,
};