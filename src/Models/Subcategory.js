"use strict";

module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define(
    "Subcategory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
    },
    { timestamps: false }
  );

  Subcategory.associate = function (models) {
    models.Subcategory.belongsTo(models.Category, {
      onDelete: "CASCADE",
      foreignKey: "CategoryId",
      as: "category",
    });

    Subcategory.belongsToMany(models.Product, {
      through: models.ProductSubcategory,
      foreignKey: "subcategory_id",
      as: "products",
    });
  };
  return Subcategory;
};
