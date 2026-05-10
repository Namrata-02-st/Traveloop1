const db = require("../config/db");

/*
ADD NOTE
*/

const addNote = (
  noteData,
  callback
) => {
  const query = `
    INSERT INTO trip_notes
    (
      trip_id,
      user_id,
      title,
      content
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      noteData.trip_id,
      noteData.user_id,
      noteData.title,
      noteData.content,
    ],
    callback
  );
};

/*
GET NOTES
*/

const getNotesByTrip = (
  tripId,
  callback
) => {
  const query = `
    SELECT *
    FROM trip_notes
    WHERE trip_id = ?
  `;

  db.query(query, [tripId], callback);
};

module.exports = {
  addNote,
  getNotesByTrip,
};