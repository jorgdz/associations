var createError = require("http-errors");
var express = require("express");
var hbs = require("hbs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
require("./config/hbsHelper");

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

var app = express();

require("./config/passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

app.use((req, res, next) => {
  if (req.originalUrl === "/favicon.ico") {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "associationsession",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  app.locals.message = req.flash("message");
  app.locals.success = req.flash("success");
  app.locals.name = req.flash("name");
  app.locals.lastname = req.flash("lastname");
  app.locals.phone = req.flash("phone");
  app.locals.email = req.flash("email");
  app.locals.user = req.user;
  next();
});

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
