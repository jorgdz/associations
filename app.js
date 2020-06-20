var createError = require("http-errors");
var express = require("express");
var hbs = require("hbs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper("trimText", function (str) {
  return str.substring(0, 25);
});

hbs.registerHelper("priceInteger", function (price) {
  var entPart = (price + "").split(".")[0];
  return entPart;
});

hbs.registerHelper("priceDecimal", function (price) {
  var decPart = (price + "").split(".")[1];
  return `${decPart == undefined ? "" : "." + decPart}`;
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
