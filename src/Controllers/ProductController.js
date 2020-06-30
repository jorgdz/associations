"use strict";

const {
  StylesAdmin,
  JsAdmin,
  JsFetchProduct,
  JsSweetAlert,
} = require("../../config/static");

const Subcategory = require("../Models").Subcategory;
const User = require("../Models").User;
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
