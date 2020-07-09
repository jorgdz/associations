const hbs = require("hbs");

hbs.registerHelper("trimText", function (str) {
  let aux = str.substring(0, 60);
  let index = aux.lastIndexOf(" ");
  return aux.substring(0, index);
});

hbs.registerHelper("priceInteger", function (price) {
  var entPart = (price + "").split(".")[0];
  return entPart;
});

hbs.registerHelper("priceDecimal", function (price) {
  var decPart = (price + "").split(".")[1];
  return `${decPart == undefined ? "" : "." + decPart}`;
});

hbs.registerHelper("strFirstUpper", function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

hbs.registerHelper("lessThan", function (number) {
  return parseInt(number) - 1;
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("ifCondOr", function (arg1, arg2, arg3, options) {
  return arg1 === arg2 || arg1 === arg3
    ? options.fn(this)
    : options.inverse(this);
});

hbs.registerHelper("isChecked", function (arg1) {
  return arg1 == true ? "checked" : "";
});

/*Verificar si la categoría del producto es igual a una de las categorías existentes*/
hbs.registerHelper("checkCtg", function (subctg = [], id) {
  let check = "";
  subctg.forEach((subcategory) => {
    if (subcategory.id == id) check = "checked";
  });
  return check;
});

hbs.registerHelper("validateImageProfile", function (image) {
  let storageUrl = "/images/default_user.png";
  if (
    image != null &&
    image != "" &&
    image != "null" &&
    image != "[null]" &&
    image != undefined
  ) {
    storageUrl = image;
  }
  return storageUrl;
});

hbs.registerHelper("imageProduct", function (images = []) {
  let storageUrl = "/images/default_product.png";
  if (images.length != 0 || images != undefined) {
    images.forEach((elem) => {
      if (elem.principal) storageUrl = elem.storageUrl;
      else storageUrl = images[0].storageUrl;
    });
  }
  return storageUrl;
});

module.exports = {
  hbs,
};
