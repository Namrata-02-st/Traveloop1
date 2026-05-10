const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

require("./config/db");

const errorMiddleware = require("./middleware/errorMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Traveloop API Running",
  });
});

/*
ROUTES
*/

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/trips", require("./routes/tripRoutes"));
app.use("/api/v1/stops", require("./routes/stopRoutes"));
app.use("/api/v1/activities", require("./routes/activityRoutes"));
app.use("/api/v1/expenses", require("./routes/expenseRoutes"));
app.use("/api/v1/packing", require("./routes/packingRoutes"));
app.use("/api/v1/notes", require("./routes/notesRoutes"));
app.use("/api/v1/share", require("./routes/sharingRoutes"));
app.use("/api/v1/cities", require("./routes/cityRoutes"));

/*
Middleware
*/

app.use(notFoundMiddleware);

/*

Error Middleware

*/

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});