"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");

exports.index = (req, res, next) => {
  res.render("admin/home", {
    title: "Admin",
    styles: StylesAdmin,
    javascripts: JsAdmin,
  });
};
