"use strict";

const {
  StylesAdmin,
  JsAdmin,
  JsFetchProduct,
  jQuery,
  Lightbox,
  LightboxCss,
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
  const product = await Product.findAll({
    include: [
      {
        model: Image,
        as: "images",
      },
    ],
    where: { id: req.params.id },
    order: [[{ model: Image, as: "images" }, "id", "DESC"]],
  });

  res.render("admin/product/image/index", {
    title: `Imágenes del producto ${product[0].name}`,
    styles: StylesAdmin,
    javascripts: JsAdmin,
    jQuery: jQuery,
    Lightbox: Lightbox,
    LightboxCss,
    product: product[0],
  });
};
