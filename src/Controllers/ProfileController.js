"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");
const User = require("../Models").User;
const Role = require("../Models").Role;
const helpers = require("../../config/helpers");

exports.index = (req, res, next) => {
  res.render("admin/profile", {
    title: "Perfil de " + req.user.name,
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.update = (req, res, next) => {
  User.findByPk(req.user.id).then((user) => {
    req.body.password = helpers.encryptPassword(req.body.password);

    user.update(req.body).then((user) => {
      req.flash("success", "Tus datos han sido actualizado con éxito.");
      res.redirect("/profile");
    });
  });
};
