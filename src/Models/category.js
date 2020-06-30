"use strict";

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    { timestamps: false }
  );

  Category.associate = function (models) {
    models.Category.hasMany(models.Subcategory, {
      foreignKey: "CategoryId",
      as: "categories",
    });
  };

  return Category;
};
