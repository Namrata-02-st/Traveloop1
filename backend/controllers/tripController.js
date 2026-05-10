const db = require("../config/db");

/*
CREATE TRIP
POST /api/v1/trips
*/

const createTrip = (req, res) => {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      total_budget,
      currency_code,
      visibility,
    } = req.body;

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
        req.user,
        title,
        description,
        start_date,
        end_date,
        total_budget,
        currency_code,
        visibility,
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
          message: "Trip created successfully",
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

/*
GET USER TRIPS
GET /api/v1/trips
*/

const getTrips = (req, res) => {
  try {
    const query =
      "SELECT * FROM trips WHERE user_id = ?";

    db.query(query, [req.user], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        trips: result,
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
DELETE TRIP
DELETE /api/v1/trips/:tripId
*/

const deleteTrip = (req, res) => {
  try {
    const query =
      "DELETE FROM trips WHERE id = ?";

    db.query(
      query,
      [req.params.tripId],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "Trip deleted",
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
  createTrip,
  getTrips,
  deleteTrip,
};