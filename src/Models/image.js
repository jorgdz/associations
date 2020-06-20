"use strict";

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      storageUrl: DataTypes.STRING,
      principal: DataTypes.BOOLEAN,
      ProductId: DataTypes.INTEGER,
    },
    { timestamps: true }
  );

  Image.associate = function (models) {
    models.Image.belongsTo(models.Product, {
      onDelete: "CASCADE",
      foreignKey: "ProductId",
      as: "product",
    });
  };

  return Image;
};
