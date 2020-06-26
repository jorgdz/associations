"use strict";
const { StylesAdmin, JsAdmin } = require("../../config/static");
const passport = require("passport");

exports.login = (req, res, next) => {
  res.render("login", {
    title: "Acceder",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.send = passport.authenticate("local.login", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.logout = (req, res, next) => {
  req.logOut();
  res.redirect("/");
};
