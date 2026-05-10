const db = require("../config/db");

/*
ADD ACTIVITY
*/

const addActivity = (
  activityData,
  callback
) => {
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
      activityData.trip_stop_id,
      activityData.activity_name,
      activityData.category,
      activityData.scheduled_start,
      activityData.scheduled_end,
      activityData.estimated_cost,
    ],
    callback
  );
};

/*
GET ACTIVITIES
*/

const getActivitiesByStop = (
  stopId,
  callback
) => {
  const query = `
    SELECT *
    FROM trip_activities
    WHERE trip_stop_id = ?
  `;

  db.query(query, [stopId], callback);
};

module.exports = {
  addActivity,
  getActivitiesByStop,
};