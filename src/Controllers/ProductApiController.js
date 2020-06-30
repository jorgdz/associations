"use strict";

const { StylesAdmin, JsAdmin } = require("../../config/static");
const Subcategory = require("../Models").Subcategory;
const User = require("../Models").User;
const Image = require("../Models").Image;
const Product = require("../Models").Product;
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
      model: User,
      as: "user",
      where: {
        id: { [Op.eq]: req.user.id },
      },
    },
    {
      model: Image,
      as: "images",
    },
  ];

  let where = {};
  if (
    search != undefined &&
    search != "" &&
    search != null &&
    search != isNaN
  ) {
    where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { price: parseFloat(search) },
      ],
    };
    offset = page * size;
  }
  try {
    const data = await Product.findAll({
      include: include,
      where: where,
      offset: offset,
      limit: size,
      order: [["id", "DESC"]],
    });

    const countProducts = await Product.count({
      include: [
        {
          model: User,
          as: "user",
          where: {
            id: { [Op.eq]: req.user.id },
          },
        },
      ],
      where: where,
    });

    let products = helpers.paginate(page, size, countProducts, data);
    res.status(200).json({
      data: products,
    });
  } catch (e) {
    return res.status(400).send({
      error: e,
    });
  }
};

exports.destroy = async function (req, res, next) {
  await Product.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    success: "Producto eliminado !!",
  });
};
