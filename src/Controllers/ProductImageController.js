"use strict";

const {
  StylesAdmin,
  JsAdmin,
  JsFetchProduct,
  jQuery,
  Lightbox,
  LightboxCss,
  JsSweetAlert,
  JsDropzone,
  StyleDropzone,
  DropzoneCss,
  configDropzone,
} = require("../../config/static");

const ProductSubcategory = require("../Models").ProductSubcategory;
const Subcategory = require("../Models").Subcategory;
const Category = require("../Models").Category;
const Image = require("../Models").Image;
const Product = require("../Models").Product;
const { Op } = require("sequelize");
const url = require("url");

const helpers = require("../../config/helpers");
const {
  uploadSingle,
  uploadMultiple,
  deleteSingle,
} = require("../../config/AWSpace");

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

exports.save = (req, res, next) => {
  uploadMultiple(req.files, req.params.id)
    .then((response) => {
      console.log(response);
      req.flash("success", "Se han agregado nuevas imágenes");
      return res.redirect(`/products/images/${req.params.id}`);
    })
    .catch((err) => console.log(err));
};

exports.check = (req, res, next) => {
  Image.findByPk(req.params.id).then((image) => {
    image.update({ principal: true }).then((image) => {
      // DO FALSE ALL IMAGE BUT NO THIS
      Image.update(
        { principal: false },
        {
          where: {
            [Op.and]: [
              { ProductId: image.ProductId },
              { id: { [Op.ne]: req.params.id } },
            ],
          },
        }
      ).then((imageUpdated) => {
        req.flash("success", "La imagen principal ha sido cambiada.");
        res.redirect(`/products/images/${image.ProductId}`);
      });
    });
  });
};

exports.destroy = async (req, res, next) => {
  const image = await Image.findAll({ where: { id: req.params.id } });
  const productId = image[0].ProductId;

  deleteSingle(image[0].name)
    .then((deletedOld) => {
      if (deletedOld) {
        Image.destroy({
          where: {
            id: req.params.id,
          },
        }).then((response) => {
          req.flash("success", "Imagen borrada.");
          res.redirect(`/products/images/${productId}`);
        });
      }
    })
    .catch((err) => {
      req.flash(
        "message",
        "Lo sentimos, no ha sido posible borrar la foto en este momento, por favor intente luego."
      );
      res.redirect(`/products/images/${productId}`);
    });
};
