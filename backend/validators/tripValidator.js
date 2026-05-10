/*
VALIDATE CREATE TRIP
*/

const validateTrip = (
  req,
  res,
  next
) => {
  const {
    title,
    start_date,
    end_date,
  } = req.body;

  // required title
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Trip title is required",
    });
  }

  // optional date validation
  if (
    start_date &&
    end_date &&
    start_date > end_date
  ) {
    return res.status(400).json({
      success: false,
      message:
        "End date cannot be before start date",
    });
  }

  next();
};

module.exports = {
  validateTrip,
};