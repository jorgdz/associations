const hbs = require("hbs");

hbs.registerHelper("trimText", function (str) {
  return str.substring(0, 28);
});

hbs.registerHelper("priceInteger", function (price) {
  var entPart = (price + "").split(".")[0];
  return entPart;
});

hbs.registerHelper("priceDecimal", function (price) {
  var decPart = (price + "").split(".")[1];
  return `${decPart == undefined ? "" : "." + decPart}`;
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
