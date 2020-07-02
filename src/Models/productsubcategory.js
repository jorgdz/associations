"use strict";
module.exports = (sequelize, DataTypes) => {
  var ProductSubcategory = sequelize.define(
    "ProductSubcategory",
    {
      subcategory_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      tableName: "ProductSubcategory",
      underscored: true,
      timestamps: false,
    }
  );
  ProductSubcategory.associate = function (models) {};
  return ProductSubcategory;
};
