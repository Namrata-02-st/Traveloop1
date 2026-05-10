const db = require("../config/db");

/*
SEARCH CITIES
*/

const searchCities = (
  search,
  callback
) => {
  const query = `
    SELECT *
    FROM cities
    WHERE city_name LIKE ?
    LIMIT 10
  `;

  db.query(
    query,
    [`%${search}%`],
    callback
  );
};

module.exports = {
  searchCities,
};