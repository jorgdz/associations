"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/config.js")[env];
var db = {};

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Database connected and authenticated!");
    return true;
  })
  .catch(function (err) {
    console.error("Failed to connect and authenticate", err);
    return false;
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
