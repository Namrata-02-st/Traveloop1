const db = require("../config/db");

/*
ADD EXPENSE
*/

const addExpense = (
  expenseData,
  callback
) => {
  const query = `
    INSERT INTO expenses
    (
      trip_id,
      category,
      amount,
      expense_date,
      notes
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      expenseData.trip_id,
      expenseData.category,
      expenseData.amount,
      expenseData.expense_date,
      expenseData.notes,
    ],
    callback
  );
};

/*
GET TRIP EXPENSES
*/

const getExpensesByTrip = (
  tripId,
  callback
) => {
  const query = `
    SELECT *
    FROM expenses
    WHERE trip_id = ?
  `;

  db.query(query, [tripId], callback);
};

/*
GET BUDGET SUMMARY
*/

const getBudgetSummary = (
  tripId,
  callback
) => {
  const query = `
    SELECT
    SUM(amount) AS total_expense
    FROM expenses
    WHERE trip_id = ?
  `;

  db.query(query, [tripId], callback);
};

module.exports = {
  addExpense,
  getExpensesByTrip,
  getBudgetSummary,
};