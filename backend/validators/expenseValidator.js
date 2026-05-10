/*
VALIDATE EXPENSE
*/

const validateExpense = (
  req,
  res,
  next
) => {
  const {
    category,
    amount,
  } = req.body;

  // required fields
  if (!category || !amount) {
    return res.status(400).json({
      success: false,
      message:
        "Category and amount are required",
    });
  }

  // amount must be positive
  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message:
        "Amount must be greater than 0",
    });
  }

  next();
};

module.exports = {
  validateExpense,
};