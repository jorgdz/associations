"use strict";

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
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

  Role.associate = function (models) {
    models.Role.hasMany(models.User);
  };

  return Role;
};
