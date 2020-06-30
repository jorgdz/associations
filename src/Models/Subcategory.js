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
  };
  return Subcategory;
};
