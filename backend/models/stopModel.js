const db = require("../config/db");

/*
ADD STOP
*/

const addStop = (
  stopData,
  callback
) => {
  const query = `
    INSERT INTO trip_stops
    (
      trip_id,
      city_id,
      arrival_date,
      departure_date,
      stop_order
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      stopData.trip_id,
      stopData.city_id,
      stopData.arrival_date,
      stopData.departure_date,
      stopData.stop_order,
    ],
    callback
  );
};

/*
GET TRIP STOPS
*/

const getStopsByTrip = (
  tripId,
  callback
) => {
  const query = `
    SELECT *
    FROM trip_stops
    WHERE trip_id = ?
    ORDER BY stop_order ASC
  `;

  db.query(query, [tripId], callback);
};

module.exports = {
  addStop,
  getStopsByTrip,
};