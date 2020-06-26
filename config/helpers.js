const bcrypt = require("bcrypt-nodejs");

const helpers = {};

helpers.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

helpers.matchPassword = (password, savedPassword) => {
  return bcrypt.compareSync(password, savedPassword);
};

module.exports = helpers;
