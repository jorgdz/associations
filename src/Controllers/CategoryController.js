"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");
const Category = require("../Models").Category;
const { Op } = require("sequelize");
const url = require("url");

const helpers = require("../../config/helpers");

exports.index = async (req, res, next) => {
  let page = parseInt(url.parse(req.url, true).query.page) || 0;
  let size = parseInt(url.parse(req.url, true).query.size) || 7;
  let search = url.parse(req.url, true).query.search || "";

  let offset = page * size;

  let where = {};
  if (search != undefined && search != "") {
    where = {
      [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
    };

    page = 0;
    offset = page * size;
  }

  const data = await Category.findAll({
    where: where,
    offset: offset,
    limit: size,
    order: [["id", "DESC"]],
  });

  const countCategories = await Category.count({
    where: where,
  });
  let categories = helpers.paginate(page, size, countCategories, data);

  res.render("admin/category/index", {
    title: "Categorías",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
    categories: categories,
    size: size,
    search: search,
  });
};

exports.create = (req, res, next) => {
  res.render("admin/category/create", {
    title: "Crear categoría",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.edit = async (req, res, next) => {
  const ctg = await Category.findAll({
    where: { id: req.params.id },
  });

  res.render("admin/category/edit", {
    category: ctg[0],
    title: "Editar categoría",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.save = async (req, res, next) => {
  let name = req.body.name;

  const aux = await Category.findAll({
    where: { name: { [Op.iLike]: req.body.name } },
  });

  if (aux.length > 0) {
    req.flash("message", "La categoría " + name + " ya existe.");
    req.flash("name", name);
    res.redirect("/category-create");
  } else {
    const ctg = await Category.create(req.body);
    req.flash("success", "Se ha agregado la categoría " + ctg.name);
    res.redirect("/categories");
  }
};

exports.update = (req, res, next) => {
  Category.findByPk(req.params.id).then((category) => {
    category.update(req.body).then((category) => {
      req.flash("success", "Categoría actualizada !!");
      res.redirect("/categories");
    });
  });
};

exports.destroy = async function (req, res, next) {
  await Category.destroy({
    where: {
      id: req.params.idCategory,
    },
  });
  req.flash("success", "Categoría borrada !!");
  res.redirect("/categories");
};
