const addCart = document.getElementById("addCart");

const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");

const splitPrice = function (strPrice) {
  let aux = strPrice.split("$");
  let price = parseFloat(aux[1]);
  return price;
};

const getProducts = function () {
  let storageProducts = [];
  if (sessionStorage.getItem("products")) {
    storageProducts = JSON.parse(sessionStorage.getItem("products"));

    storageProducts.map((product) => {
      product.total = product.price * product.quantity;
    });
  }

  return storageProducts;
};

const addProducts = function (product) {
  let products = [];

  if (sessionStorage.getItem("products")) {
    products = JSON.parse(sessionStorage.getItem("products"));

    let tmp = 0;
    products.map((p) => {
      if (p.name == product.name) {
        let quant = parseInt(p.quantity) + 1;
        p.quantity = quant;
        p.total = p.price * quant;
        tmp++;
      }
    });

    sessionStorage.removeItem("products");
    if (tmp == 0) products.push(product);
  } else {
    products.push(product);
  }

  sessionStorage.setItem("products", JSON.stringify(products));
  quantityBuyerCar.textContent = products.length;
  window.location = "/cart";
};

addCart.addEventListener("click", function () {
  let product = {
    id: document.getElementById("id").value,
    idProduct: getProducts().length + 1,
    image: document.getElementById("productImg").getAttribute("src"),
    name: productName.textContent,
    description: productDescription.innerText,
    price: splitPrice(productPrice.textContent),
    quantity: 1,
    total: splitPrice(productPrice.textContent) * 1,
  };

  addProducts(product);
});

const init = function () {
  let products = getProducts();
  quantityBuyerCar.textContent = products.length;
};

window.addEventListener("load", init());
