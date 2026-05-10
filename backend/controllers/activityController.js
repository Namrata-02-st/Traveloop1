const db = require("../config/db");

const addActivity = (req, res) => {
  try {
    const {
      activity_name,
      category,
      scheduled_start,
      scheduled_end,
      estimated_cost,
    } = req.body;

    const query = `
      INSERT INTO trip_activities
      (
        trip_stop_id,
        activity_name,
        category,
        scheduled_start,
        scheduled_end,
        estimated_cost
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        req.params.stopId,
        activity_name,
        category,
        scheduled_start,
        scheduled_end,
        estimated_cost,
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
          message: "Activity added",
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
  addActivity,
};