const db = require("../config/db");

/*
ADD PACKING ITEM
*/

const addPackingItem = (
  itemData,
  callback
) => {
  const query = `
    INSERT INTO packing_items
    (
      trip_id,
      item_name,
      quantity,
      category
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      itemData.trip_id,
      itemData.item_name,
      itemData.quantity,
      itemData.category,
    ],
    callback
  );
};

/*
GET PACKING ITEMS
*/

const getPackingItems = (
  tripId,
  callback
) => {
  const query = `
    SELECT *
    FROM packing_items
    WHERE trip_id = ?
  `;

  db.query(query, [tripId], callback);
};

module.exports = {
  addPackingItem,
  getPackingItems,
};