const db = require("../config/db");

/*
ADD STOP
POST /api/v1/trips/:tripId/stops
*/

const addStop = (req, res) => {
  try {
    const {
      city_id,
      arrival_date,
      departure_date,
      stop_order,
    } = req.body;

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
        req.params.tripId,
        city_id,
        arrival_date,
        departure_date,
        stop_order,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.status(201).json({
          success: true,
          message: "Stop added",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addStop,
};