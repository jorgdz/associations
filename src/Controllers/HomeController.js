"use strict";

const User = require("../Models").User;
const Product = require("../Models").Product;
const Image = require("../Models").Image;
const Category = require("../Models").Category;

const {
  StylesHome,
  StylesProduct,
  StylesCart,
  StylesAdmin,
  JsHome,
  JsProduct,
  JsCart,
  JsAdmin,
  jQuery,
} = require("../../config/static");

exports.index = async (req, res, next) => {
  const products = await Product.findAll({
    include: [
      {
        model: User,
        as: "user",
      },
      {
        model: Image,
        as: "images",
      },
    ],
    order: [
      ["id", "DESC"],
      [{ model: Image, as: "images" }, "principal", "DESC"],
    ],
  });

  const categories = await Category.findAll({
    order: [["name", "ASC"]],
  });

  res.render("index", {
    title: "Productos",
    products: products,
    categories: categories,
    styles: StylesHome,
    javascripts: JsHome,
    jQuery: jQuery,
  });
};

exports.show = async (req, res, next) => {
  try {
    const product = await Product.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Image,
          as: "images",
        },
      ],
      order: [[{ model: Image, as: "images" }, "principal", "DESC"]],
    });

    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    res.render("show", {
      title: `Producto ${product[0].name}`,
      product: product[0],
      categories: categories,
      styles: StylesProduct,
      javascripts: JsProduct,
      jQuery: jQuery,
    });
  } catch (error) {
    console.log(error);
    res.render("No se ha encontrado el producto");
  }
};

exports.cart = async (req, res, next) => {
  const categories = await Category.findAll({
    order: [["name", "ASC"]],
  });

  res.render("cart", {
    title: "Carrito",
    categories: categories,
    styles: StylesCart,
    javascripts: JsCart,
    jQuery: jQuery,
  });
};
