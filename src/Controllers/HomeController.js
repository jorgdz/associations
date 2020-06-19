"use strict";

const User = require("../Models").User;
const Product = require("../Models").Product;

exports.index = async (req, res, next) => {
  const products = await Product.findAll({
    include: [
      {
        model: User,
        as: "user",
      },
    ],
    order: [["id", "DESC"]],
  });

  res.render("index", { title: "Inicio - Productos", products: products });
};

exports.show = (req, res, next) => {
  return Product.findAll({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  })
    .then((product) => {
      res.render("show", {
        title: `Producto ${product[0].name}`,
        product: product[0],
      });
    })
    .catch((err) => {
      res.render("No se ha encontrado el producto");
    });
};
