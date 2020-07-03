"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");
const User = require("../Models").User;
const Role = require("../Models").Role;
const helpers = require("../../config/helpers");
const { uploadSingle, deleteSingle } = require("../../config/AWSpace");

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

exports.upload = (req, res, next) => {
  if (
    req.user.storageurlphoto != null &&
    req.user.storageurlphoto != "" &&
    req.user.storageurlphoto != undefined &&
    req.user.storageurlphoto != "null" &&
    req.user.storageurlphoto != "[null]"
  ) {
    // Delete old photo
    deleteSingle(req.user.photo)
      .then((deletedOld) => {
        console.log(deletedOld);
      })
      .catch((err) => console.log(err));
  }

  uploadSingle(req.file.path, req.file.filename, req.file.mimetype)
    .then((response) => {
      User.findByPk(req.user.id).then((user) => {
        let _user = {
          photo: req.file.originalname,
          storageurlphoto: response.Location,
        };
        user.update(_user).then((user) => {
          req.flash("success", "Tu foto de perfil ha sido actualizada.");
          res.redirect("/profile");
        });
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash(
        "message",
        "Lo sentimos no hemos podido actualizar tu perfil en este momento, intente mas tarde."
      );
      res.redirect("/profile");
    });
};
