"use strict";

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      UserId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      offer: DataTypes.BOOLEAN,
    },
    { timestamps: true }
  );

  Product.associate = function (models) {
    models.Product.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: "UserId",
      as: "user",
    });

    models.Product.hasMany(models.Image, {
      foreignKey: "ProductId",
      as: "images",
    });
  };

  return Product;
};
