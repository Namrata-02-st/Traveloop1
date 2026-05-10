const db = require("../config/db");

/*
ADD EXPENSE
*/

const addExpense = (req, res) => {
  try {
    const {
      category,
      amount,
      expense_date,
      notes,
    } = req.body;

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
        req.params.tripId,
        category,
        amount,
        expense_date,
        notes,
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
          message: "Expense added",
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
GET BUDGET SUMMARY
*/

const getBudgetSummary = (req, res) => {
  try {
    const query = `
      SELECT
      SUM(amount) AS total_expense
      FROM expenses
      WHERE trip_id = ?
    `;

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
          summary: result[0],
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
  addExpense,
  getBudgetSummary,
};