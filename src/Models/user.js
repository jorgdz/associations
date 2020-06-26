"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      RoleId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      lastname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    { timestamps: true }
  );

  User.associate = function (models) {
    models.User.belongsTo(models.Role, {
      onDelete: "CASCADE",
      foreignKey: "RoleId",
      as: "role",
    });

    models.User.hasMany(models.Product, {
      foreignKey: "UserId",
      as: "products",
    });
  };

  return User;
};
