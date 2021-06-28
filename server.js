const express = require("express");
const cors = require("cors"); //use this
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to the database
connectDb();

// bring all the router
const note = require("./router/notes");
const auth = require("./router/auth");
const admin = require("./router/admin");

const app = express();

// bring the boys on floor.
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

// Mounting the routers
app.use("/api/v1/note", note);
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);

// use error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
