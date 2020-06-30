const searchProduct = document.getElementById("searchProduct");
const sizeListProducts = document.getElementById("sizeListProducts");
const listProducts = document.getElementById("listProducts");
const paginationProducts = document.getElementById("paginationProducts");

var defaultPage = 0;

const getProducts = async function (
  size = sizeListProducts.value,
  page = defaultPage,
  search = ""
) {
  let url = `/api-products?size=${size}&page=${page}&search=${search}`;
  const data = await fetch(url);
  const products = data.json();
  return products;
};

searchProduct.addEventListener("keyup", function () {
  getProducts(sizeListProducts.value, defaultPage, searchProduct.value).then(
    (response) => {
      drawProducts(response);
      drawPagination(response);
    }
  );
});

sizeListProducts.addEventListener("change", function () {
  getProducts(this.value, defaultPage, searchProduct.value).then((response) => {
    drawProducts(response);
    drawPagination(response);
  });
});

const getImageProduct = function (images) {
  let storageUrl = "/images/default_product.png";
  if (images.length != 0 || images != undefined) {
    images.forEach((elem) => {
      if (elem.principal) storageUrl = elem.storageUrl;
      else storageUrl = images[0].storageUrl;
    });
  }
  return storageUrl;
};

const drawProducts = function (res) {
  listProducts.innerHTML = "";
  const fg = document.createDocumentFragment();
  res.data.data.map(function (product) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.scope = "row";
    th.textContent = product.id;

    let tdImg = document.createElement("td");
    let img = document.createElement("img");
    img.src = getImageProduct(product.images);
    img.width = 60;
    img.height = 60;
    tdImg.appendChild(img);

    let tdName = document.createElement("td");
    tdName.textContent = product.name;

    let tdPrice = document.createElement("td");
    tdPrice.textContent = `$${product.price}`;

    let tdOffer = document.createElement("td");
    let spanOffer = document.createElement("span");
    spanOffer.classList.add(
      "badge",
      product.offer ? "badge-success" : "badge-light"
    );
    spanOffer.textContent = product.offer ? "En oferta" : "Precio normal";
    tdOffer.appendChild(spanOffer);

    let tdShow = document.createElement("td");
    let aShow = document.createElement("a");
    aShow.href = `/products/images/${product.id}`;
    aShow.classList.add("btn", "cur-p", "btn-primary");
    let iShow = document.createElement("i");
    iShow.classList.add("c-light-white-500", "ti-image");

    aShow.appendChild(iShow);
    tdShow.appendChild(aShow);

    let tdEdit = document.createElement("td");
    let aEdit = document.createElement("a");
    aEdit.href = `/products/${product.id}`;
    aEdit.classList.add("btn", "cur-p", "btn-info");
    let iEdit = document.createElement("i");
    iEdit.classList.add("c-light-white-500", "ti-pencil");

    aEdit.appendChild(iEdit);
    tdEdit.appendChild(aEdit);

    let tdDelete = document.createElement("td");
    let btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("btn", "cur-p", "btn-danger");
    let iDelete = document.createElement("i");
    iDelete.classList.add("c-light-white-500", "ti-trash");
    btnDelete.appendChild(iDelete);

    btnDelete.addEventListener("click", function () {
      Swal.fire({
        title: "Estás seguro/a de querer eliminar este producto?",
        text: "Este proceso no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          fetch(`/api-products/destroy/${product.id}`, {
            method: "GET",
            cache: "default",
          })
            .then((jsonData) => {
              return jsonData.json();
            })
            .then((deleted) => {
              Swal.fire("Eliminado!", deleted.success, "success");
              getProducts(sizeListProducts.value, defaultPage).then(
                (response) => {
                  drawProducts(response);
                  drawPagination(response);
                }
              );
            })
            .catch((error) => console.error("Error:", error));
        }
      });
    });
    tdDelete.appendChild(btnDelete);

    /*Add products row*/
    tr.appendChild(th);
    tr.appendChild(tdImg);
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdOffer);
    tr.appendChild(tdShow);
    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);

    fg.appendChild(tr);
  });

  listProducts.appendChild(fg);
};

const drawPagination = function (res) {
  paginationProducts.innerHTML = "";
  const fgNumbers = document.createDocumentFragment();

  let btnPrev = document.createElement("button");
  btnPrev.classList.add("btn", "btn-primary");
  btnPrev.type = "button";
  let spanArrow1 = document.createElement("span");
  spanArrow1.classList.add("arrow");
  let iLeft = document.createElement("i");
  iLeft.classList.add("ti-angle-left");
  spanArrow1.appendChild(iLeft);
  btnPrev.appendChild(spanArrow1);

  btnPrev.addEventListener("click", function () {
    getProducts(
      sizeListProducts.value,
      res.data.prev,
      searchProduct.value
    ).then((response) => {
      drawProducts(response);
      drawPagination(response);
    });
  });

  paginationProducts.appendChild(btnPrev);

  res.data.numbersPage.map(function (number) {
    let btnNumber = document.createElement("button");
    btnNumber.classList.add("btn", "btn-primary");
    btnNumber.type = "button";
    btnNumber.value = number;
    btnNumber.textContent = number;

    btnNumber.addEventListener("click", function () {
      getProducts(sizeListProducts.value, number - 1, searchProduct.value).then(
        (response) => {
          drawProducts(response);
          drawPagination(response);
        }
      );
    });

    fgNumbers.appendChild(btnNumber);
  });

  paginationProducts.appendChild(fgNumbers);

  let btnNext = document.createElement("button");
  btnNext.classList.add("btn", "btn-primary");
  btnNext.type = "button";
  let spanArrow2 = document.createElement("span");
  spanArrow2.classList.add("arrow");
  let iRight = document.createElement("i");
  iRight.classList.add("ti-angle-right");
  spanArrow2.appendChild(iRight);
  btnNext.appendChild(spanArrow2);

  btnNext.addEventListener("click", function () {
    getProducts(
      sizeListProducts.value,
      res.data.next,
      searchProduct.value
    ).then((response) => {
      drawProducts(response);
      drawPagination(response);
    });
  });

  paginationProducts.appendChild(btnNext);
};

getProducts().then((res) => {
  drawProducts(res);
  drawPagination(res);
});
