const db = require("../config/db");

/*
SHARE TRIP
*/

const shareTrip = (
  shareData,
  callback
) => {
  const query = `
    INSERT INTO shared_itineraries
    (
      trip_id,
      shared_with_user_id,
      permission
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [
      shareData.trip_id,
      shareData.shared_with_user_id,
      shareData.permission,
    ],
    callback
  );
};

/*
GET SHARED USERS
*/

const getSharedUsers = (
  tripId,
  callback
) => {
  const query = `
    SELECT *
    FROM shared_itineraries
    WHERE trip_id = ?
  `;

  db.query(query, [tripId], callback);
};

module.exports = {
  shareTrip,
  getSharedUsers,
};