require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const corsOption = require("./config/corsOptions");
const { logEvents, logger } = require("./middleware/logger");

const PORT = process.env.PORT || 3300;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

app.use(logger);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/index");
const spacecargoRouter = require("./routes/spacecargo");

app.use("/", indexRouter);
app.use("/spacecargo", spacecargoRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
console.log(PORT);

app.use(errorHandler);

module.exports = app;
