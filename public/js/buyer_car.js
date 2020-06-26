const quantityBuyerCar = document.getElementById("quantityBuyerCar");

const cartItemsList = document.getElementById("cartItemsList");
const clearCart = document.getElementById("clearCart");
const purchaseQuote = document.getElementById("buyQuote");

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

const drawSubtotal = function (products) {
  let subtotal = 0;
  products.map((product) => {
    subtotal += product.total;
  });

  let prodSubtotal = document.getElementById("prodSubtotal");
  let prodTotal = document.getElementById("prodTotal");
  prodSubtotal.textContent = `$${subtotal}`;
  prodTotal.textContent = `$${subtotal}`;
};

const drawProductsCart = function (products) {
  cartItemsList.innerHTML = "";
  const fg = document.createDocumentFragment();
  products.map((product) => {
    let li = document.createElement("li");
    li.classList.add(
      "cart_item",
      "item_list",
      "d-flex",
      "flex-lg-row",
      "flex-column",
      "align-items-lg-center",
      "align-items-start",
      "justify-content-lg-end",
      "justify-content-start"
    );

    let divProduct = document.createElement("div");
    divProduct.classList.add(
      "product",
      "d-flex",
      "flex-lg-row",
      "flex-column",
      "align-items-lg-center",
      "align-items-start",
      "justify-content-start",
      "mr-auto"
    );

    let div2 = document.createElement("div");
    let div3 = document.createElement("div");
    div3.classList.add("product_number");
    div3.textContent = product.idProduct;

    let div4 = document.createElement("div");
    let div5 = document.createElement("div");
    div5.classList.add("product_image");

    let img = document.createElement("img");
    img.setAttribute("src", product.image);

    let divProductNameContainer = document.createElement("div");
    divProductNameContainer.classList.add("product_name_container");

    let divProductName = document.createElement("div");
    divProductName.classList.add("product_name");
    let divProductText = document.createElement("div");
    divProductText.classList.add("product_text");

    let aName = document.createElement("a");
    aName.href = `/${product.id}`;
    aName.textContent = product.name;
    divProductName.appendChild(aName);

    divProductText.textContent = product.description;

    divProductNameContainer.appendChild(divProductName);
    divProductNameContainer.appendChild(divProductText);

    div5.appendChild(img);

    div2.appendChild(div3);
    div4.appendChild(div5);

    divProduct.appendChild(div2);
    divProduct.appendChild(div4);
    divProduct.appendChild(divProductNameContainer);

    let divProductPrice = document.createElement("div");
    divProductPrice.classList.add("product_price", "product_text");
    divProductPrice.innerHTML = `<span>Precio: </span>$${product.price}`;

    let divProductQuantityContainer = document.createElement("div");
    divProductQuantityContainer.classList.add("product_quantity_container");

    let divProductQuantity = document.createElement("div");
    divProductQuantity.classList.add(
      "product_quantity",
      "ml-lg-auto",
      "mr-lg-auto",
      "text-center"
    );

    let spanProductText = document.createElement("span");
    spanProductText.classList.add("product_text", "product_num");
    spanProductText.textContent = product.quantity;

    let spanLess = document.createElement("span");
    spanLess.textContent = "-";
    let spanMore = document.createElement("span");
    spanMore.textContent = "+";

    let divBtnLess = document.createElement("div");
    divBtnLess.classList.add(
      "qty_sub",
      "qty_button",
      "trans_200",
      "text-center"
    );
    divBtnLess.id = "btnLessQuantity";

    let divBtnMore = document.createElement("div");
    divBtnMore.classList.add(
      "qty_add",
      "qty_button",
      "trans_200",
      "text-center"
    );
    divBtnMore.id = "btnMoreQuantity";

    divBtnLess.addEventListener("click", function () {
      let value =
        parseInt(spanProductText.textContent) > 1
          ? parseInt(spanProductText.textContent) - 1
          : parseInt(spanProductText.textContent);

      let storageProducts = JSON.parse(sessionStorage.getItem("products"));

      storageProducts.map((p) => {
        if (p.name === product.name) {
          p.quantity = value;
          p.total = p.price * value;
        }
      });
      sessionStorage.removeItem("products");
      sessionStorage.setItem("products", JSON.stringify(storageProducts));
      drawProductsCart(getProducts());
      drawSubtotal(getProducts());
    });

    divBtnMore.addEventListener("click", function () {
      let value = parseInt(spanProductText.textContent) + 1;
      let storageProducts = JSON.parse(sessionStorage.getItem("products"));

      storageProducts.map((p) => {
        if (p.name === product.name) {
          p.quantity = value;
          p.total = p.price * value;
        }
      });
      sessionStorage.removeItem("products");
      sessionStorage.setItem("products", JSON.stringify(storageProducts));
      drawProductsCart(getProducts());
      drawSubtotal(getProducts());
    });

    divBtnLess.appendChild(spanLess);
    divBtnMore.appendChild(spanMore);

    divProductQuantity.appendChild(spanProductText);
    divProductQuantity.appendChild(divBtnLess);
    divProductQuantity.appendChild(divBtnMore);
    divProductQuantityContainer.appendChild(divProductQuantity);

    let divProductTotal = document.createElement("div");
    divProductTotal.classList.add("product_total", "product_text");
    divProductTotal.innerHTML = `<span>Total: </span>$${product.total}`;

    li.appendChild(divProduct);
    li.appendChild(divProductPrice);
    li.appendChild(divProductQuantityContainer);
    li.appendChild(divProductTotal);

    fg.appendChild(li);
  });

  cartItemsList.append(fg);
};

clearCart.addEventListener("click", function () {
  sessionStorage.removeItem("products");
  let products = getProducts();
  drawProductsCart(products);
  drawSubtotal(products);
  quantityBuyerCar.textContent = products.length;
});

purchaseQuote.addEventListener("click", function () {
  let products = getProducts();
  if (products.length == 0)
    alert("Debes agregar productos al carrito para cotizar la compra.");

  let phone = "593983683624";
  let msg = "*Hola estoy interesado(a) en la compra de:*";
  let total = 0;
  products.map((product) => {
    msg += ` ${product.quantity} ${product.name} ${product.image} (Precio: ${product.price}), `;
    total = total + product.total;
  });
  msg += "*_Valor total:" + total + "_*";

  let urlWhatsapp = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;
  purchaseQuote.href = urlWhatsapp;
  window.location = urlWhatsapp;
});

const init = function () {
  let products = getProducts();
  if (products.length > 0) drawProductsCart(products);
  quantityBuyerCar.textContent = products.length;

  drawSubtotal(products);
};

window.addEventListener("load", init());
