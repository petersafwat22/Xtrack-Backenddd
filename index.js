const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/usersRoutes");
const chargesRoutes = require("./routes/chargesRoutes");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");
dotenv.config();

// Initialize express app
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://quotiss.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON requests
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/charges", chargesRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    status: err?.status || "error",
    code: err?.statusCode || 500,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
