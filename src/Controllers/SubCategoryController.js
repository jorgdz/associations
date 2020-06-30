"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");
const Subcategory = require("../Models").Subcategory;
const Category = require("../Models").Category;
const { Op } = require("sequelize");
const url = require("url");

const helpers = require("../../config/helpers");

exports.index = async (req, res, next) => {
  let page = parseInt(url.parse(req.url, true).query.page) || 0;
  let size = parseInt(url.parse(req.url, true).query.size) || 7;
  let search = url.parse(req.url, true).query.search || "";

  let offset = page * size;

  let include = [
    {
      model: Category,
      as: "category",
    },
  ];

  let where = {};
  if (search != undefined && search != "") {
    where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { "$category.name$": { [Op.iLike]: `%${search}%` } },
      ],
    };

    page = 0;
    offset = page * size;
  }

  const data = await Subcategory.findAll({
    include: include,
    where: where,
    offset: offset,
    limit: size,
    order: [["id", "DESC"]],
  });

  const countSubcategories = await Subcategory.count({
    include: include,
    where: where,
  });

  let subcategories = helpers.paginate(page, size, countSubcategories, data);

  res.render("admin/subcategory/index", {
    title: "Sub-categorías",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
    subcategories: subcategories,
    size: size,
    search: search,
  });
};

exports.create = async (req, res, next) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.render("admin/subcategory/create", {
    title: "Crear Sub-categoría",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    categories: categories,
    csrfToken: req.csrfToken(),
  });
};

exports.edit = async (req, res, next) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  const subctg = await Subcategory.findAll({
    where: { id: req.params.id },
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
  });

  res.render("admin/subcategory/edit", {
    subcategory: subctg[0],
    categories: categories,
    title: "Editar Sub-categoría",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.save = async (req, res, next) => {
  let name = req.body.name;

  const aux = await Subcategory.findAll({
    where: { name: { [Op.iLike]: req.body.name } },
  });

  if (aux.length > 0) {
    req.flash("message", "La subcategoría " + name + " ya existe.");
    req.flash("name", name);
    res.redirect("/subcategory-create");
  } else {
    const subctg = await Subcategory.create(req.body);
    req.flash("success", "Se ha agregado la subcategoría " + subctg.name);
    res.redirect("/sub-categories");
  }
};

exports.update = (req, res, next) => {
  Subcategory.findByPk(req.params.id).then((subcategory) => {
    subcategory.update(req.body).then((subcategory) => {
      req.flash("success", "Subcategoría actualizada !!");
      res.redirect("/sub-categories");
    });
  });
};

exports.destroy = async function (req, res, next) {
  await Subcategory.destroy({
    where: {
      id: req.params.id,
    },
  });
  req.flash("success", "Se ha borrado la subcategoría !!");
  res.redirect("/sub-categories");
};
