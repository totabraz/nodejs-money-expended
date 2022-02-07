// IMPORTS
const express = require("express");
const dotenv = require("dotenv/config");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./src/routes/auth");
const moneyReportRoute = require("./src/routes/money-report");

// IMPORT ROUTES

// PRE-SETUP
const app = express();

// Connect.db
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connect do db!")
);

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTE INI MIDDLEWARE

app.use("/api/users", authRoute);
app.use("/api/money-reports", moneyReportRoute);
// Starting the server
app.listen(5000);
