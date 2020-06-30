"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");
const User = require("../Models").User;
const Role = require("../Models").Role;
const { Op } = require("sequelize");
const url = require("url");

const helpers = require("../../config/helpers");
const { sendEmailUserCreate } = require("../../config/email");

exports.index = async (req, res, next) => {
  let page = parseInt(url.parse(req.url, true).query.page) || 0;
  let size = parseInt(url.parse(req.url, true).query.size) || 8;
  let search = url.parse(req.url, true).query.search || "";

  let offset = page * size;
  let include = [
    {
      model: Role,
      as: "role",
      where: {
        name: { [Op.ne]: "admin" },
      },
    },
  ];

  let where = {};
  if (search != undefined && search != "") {
    where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { lastname: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
      ],
    };

    page = 0;
    offset = page * size;
  }

  const data = await User.findAll({
    where: where,
    include: include,
    offset: offset,
    limit: size,
    order: [["id", "DESC"]],
  });

  const countUsers = await User.count({
    where: where,
    include: include,
  });
  let users = helpers.paginate(page, size, countUsers, data);

  res.render("admin/user/index", {
    title: "Usuarios",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
    users: users,
    size: size,
    search: search,
  });
};

exports.create = (req, res, next) => {
  res.render("admin/user/create", {
    title: "Crear usuario",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.edit = async (req, res, next) => {
  const user = await User.findAll({
    where: { id: req.params.idUser },
  });

  res.render("admin/user/edit", {
    userfind: user[0],
    title: "Editar usuario",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.save = async (req, res, next) => {
  let name = req.body.name;
  let lastname = req.body.lastname;
  let phone = req.body.phone;
  let email = req.body.email;

  const aux = await User.findAll({
    where: { email: email },
  });

  if (aux.length > 0) {
    req.flash("message", "El correo " + email + " ya está en uso.");
    req.flash("name", name);
    req.flash("lastname", lastname);
    req.flash("phone", phone);
    req.flash("email", email);
    res.redirect("/users-create");
  } else {
    const role = await Role.findAll({
      where: { name: "vendedor" },
    });

    const _user = {
      RoleId: role[0].id,
      name: name,
      lastname: lastname,
      username: helpers.createUsername(email),
      password: helpers.createPassword(email),
      phone: phone,
      email: email,
    };

    if (
      !sendEmailUserCreate({
        name: name,
        lastname: lastname,
        username: helpers.createUsername(email),
        password: helpers.createUsername(email),
        email: email,
      })
    ) {
      User.create(_user).then((userCreated) => {
        req.flash("success", "Se ha creado el usuario " + userCreated.username);
        res.redirect("/users");
      });
    } else {
      req.flash(
        "message",
        "No hemos podido crear la cuenta porque ha ocurrido un problema con el correo, por favor verifica que este escrito correctamente !"
      );
      req.flash("name", name);
      req.flash("lastname", lastname);
      req.flash("phone", phone);
      req.flash("email", email);
      res.redirect("/users-create");
    }
  }
};

exports.update = (req, res, next) => {
  User.findByPk(req.params.id).then((user) => {
    let name = req.body.name;
    let lastname = req.body.lastname;
    let phone = req.body.phone;
    let email = req.body.email;

    const _user = {
      name: name,
      lastname: lastname,
      password: helpers.createPassword(email),
      phone: phone,
      email: email,
    };

    user.update(_user).then((user) => {
      req.flash("success", "Datos de usuario actualizado");
      res.redirect("/users");
    });
  });
};

exports.destroy = async (req, res, next) => {
  await User.destroy({
    where: {
      id: req.params.id,
    },
  });
  req.flash("success", "Usuario eliminado !!");
  res.redirect("/users");
};
