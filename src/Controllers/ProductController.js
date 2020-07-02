"use strict";

const {
  StylesAdmin,
  JsAdmin,
  JsFetchProduct,
  JsSweetAlert,
} = require("../../config/static");

const ProductSubcategory = require("../Models").ProductSubcategory;
const Subcategory = require("../Models").Subcategory;
const Category = require("../Models").Category;
const Image = require("../Models").Image;
const Product = require("../Models").Product;
const { Op } = require("sequelize");
const url = require("url");

const helpers = require("../../config/helpers");

exports.index = async (req, res, next) => {
  res.render("admin/product/index", {
    title: "Productos",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    fetchProductJs: JsFetchProduct,
    JsSweetAlert: JsSweetAlert,
  });
};

exports.create = async (req, res, next) => {
  const categories = await Category.findAll({
    include: [
      {
        model: Subcategory,
        as: "subcategories",
      },
    ],
    order: [
      ["name", "ASC"],
      [{ model: Subcategory, as: "subcategories" }, "name", "ASC"],
    ],
  });

  res.render("admin/product/create", {
    title: "Crear producto",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    categories: categories,
    csrfToken: req.csrfToken(),
  });
};

exports.edit = async (req, res, next) => {
  const product = await Product.findAll({
    include: [
      {
        model: Subcategory,
        as: "subcategories",
      },
    ],
    where: { id: req.params.id },
  });

  const categories = await Category.findAll({
    include: [
      {
        model: Subcategory,
        as: "subcategories",
      },
    ],
    order: [
      ["name", "ASC"],
      [{ model: Subcategory, as: "subcategories" }, "name", "ASC"],
    ],
  });

  res.render("admin/product/edit", {
    product: product[0],
    categories: categories,
    title: "Editar producto",
    styles: StylesAdmin,
    javascripts: JsAdmin,
    csrfToken: req.csrfToken(),
  });
};

exports.save = async (req, res, next) => {
  const { name, description, price, offer, subcategories } = req.body;
  let _offer = offer == "on" ? true : false;

  const product = await Product.create({
    UserId: req.user.id,
    name: name,
    description: description,
    price: parseFloat(price),
    offer: _offer,
  });

  if (subcategories && subcategories != undefined && subcategories != "")
    product.setSubcategories(subcategories);

  req.flash("success", "Se ha creado el producto " + product.name);
  res.redirect("/products");
};

exports.update = (req, res, next) => {
  Product.findByPk(req.params.id).then((product) => {
    const { name, description, price, offer, subcategories } = req.body;
    let _offer = offer == "on" ? true : false;

    product
      .update({
        name: name,
        description: description,
        price: parseFloat(price),
        offer: _offer,
      })
      .then((product) => {
        product.setSubcategories(subcategories);
        req.flash("success", "Producto actualizado !!");
        res.redirect("/products");
      });
  });
};
