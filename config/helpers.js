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

helpers.paginate = (currentPage, size, totalElements, data) => {
  let value = Math.floor(parseInt(totalElements) / parseInt(size));
  let aux = value * size;
  let totalPages = aux < totalElements ? value : value - 1;

  console.log(totalPages);
  let first = currentPage > 4 ? currentPage - 3 : 1;
  let numbers = [];
  while (first <= currentPage + 3 && first <= totalPages + 1) {
    numbers.push(first);
    first++;
  }

  return {
    data: data,
    currentPage: currentPage,
    prev: currentPage > 0 ? currentPage - 1 : currentPage,
    next: currentPage < totalPages ? currentPage + 1 : currentPage,
    elementsByPage: size,
    totalElements: totalElements,
    totalPages: totalPages,
    numbersPage: numbers,
  };
};

helpers.createUsername = (email) => {
  let aux = email.split("@");
  return aux[0];
};

helpers.createPassword = (email) => {
  let aux = email.split("@");
  let pass = helpers.encryptPassword(aux[0]);
  return pass;
};

module.exports = helpers;
