var express = require("express");

var router = express.Router();
var routerNoCsrf = express.Router();

const csurf = require("csurf");
const csrfProtection = csurf();

const {
  Authenticated,
  Unauthenticated,
  Authorization,
} = require("../config/auth");

const HomeController = require("../src/Controllers/HomeController");
const AdminController = require("../src/Controllers/AdminController");
const LoginController = require("../src/Controllers/LoginController");
const ProfileController = require("../src/Controllers/ProfileController");
const UserController = require("../src/Controllers/UserController");
const CategoryController = require("../src/Controllers/CategoryController");
const SubCategoryController = require("../src/Controllers/SubCategoryController");
const ProductController = require("../src/Controllers/ProductController");
const ProductApiController = require("../src/Controllers/ProductApiController");
const ProductImageController = require("../src/Controllers/ProductImageController");

const multer = require("multer");

const upload = multer({ dest: "./public/uploads/" });

router.use(csrfProtection);

router.get("/home", Authenticated, AdminController.index);

routerNoCsrf.post(
  "/images/:id",
  upload.any("img"),
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductImageController.save
);

routerNoCsrf.post(
  "/profile",
  upload.single("photo"),
  Authenticated,
  ProfileController.upload
);

router.get("/profile", Authenticated, ProfileController.index);
router.post("/profile", Authenticated, ProfileController.update);

/*Users*/
router.post(
  "/users/update/:id",
  Authenticated,
  Authorization("admin"),
  UserController.update
);

router.get(
  "/users/destroy/:id",
  Authenticated,
  Authorization("admin"),
  UserController.destroy
);

router.post(
  "/users/save",
  Authenticated,
  Authorization("admin"),
  UserController.save
);

router.get(
  "/users/:idUser",
  Authenticated,
  Authorization("admin"),
  UserController.edit
);

router.get(
  "/users",
  Authenticated,
  Authorization("admin"),
  UserController.index
);

router.get(
  "/users-create",
  Authenticated,
  Authorization("admin"),
  UserController.create
);
/*End Users*/

/*Categories*/
router.post(
  "/categories/update/:id",
  Authenticated,
  Authorization("admin"),
  CategoryController.update
);

router.get(
  "/categories/destroy/:idCategory",
  Authenticated,
  Authorization("admin"),
  CategoryController.destroy
);

router.post(
  "/categories/save",
  Authenticated,
  Authorization("admin"),
  CategoryController.save
);

router.get(
  "/categories/:id",
  Authenticated,
  Authorization("admin"),
  CategoryController.edit
);

router.get(
  "/categories",
  Authenticated,
  Authorization("admin"),
  CategoryController.index
);

router.get(
  "/category-create",
  Authenticated,
  Authorization("admin"),
  CategoryController.create
);
/*End Categories*/

/** SubCategories*/
router.post(
  "/sub-categories/update/:id",
  Authenticated,
  Authorization("admin"),
  SubCategoryController.update
);

router.get(
  "/sub-categories/destroy/:id",
  Authenticated,
  Authorization("admin"),
  SubCategoryController.destroy
);

router.post(
  "/sub-categories/save",
  Authenticated,
  Authorization("admin"),
  SubCategoryController.save
);

router.get(
  "/sub-categories/:id",
  Authenticated,
  Authorization("admin"),
  SubCategoryController.edit
);

router.get(
  "/sub-categories",
  Authenticated,
  Authorization("admin"),
  SubCategoryController.index
);

router.get(
  "/subcategory-create",
  Authenticated,
  Authorization("admin"),
  SubCategoryController.create
);

/*End Subcategories */

/*Products*/
router.get(
  "/images/check/:id",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductImageController.check
);

router.get(
  "/images/destroy/:id",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductImageController.destroy
);

router.get(
  "/products/images/:id",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductImageController.index
);

router.post(
  "/products/update/:id",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductController.update
);

router.get(
  "/api-products/destroy/:id",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductApiController.destroy
);

router.get(
  "/products/:id",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductController.edit
);

router.get(
  "/api-products",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductApiController.index
);

router.post(
  "/products/save",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductController.save
);

router.get(
  "/products",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductController.index
);

router.get(
  "/product-create",
  Authenticated,
  Authorization("admin", "vendedor"),
  ProductController.create
);
/*End Products*/

router.get("/cart", HomeController.cart);

/* GET, POST Login. */
router.get("/login", Unauthenticated, LoginController.login);
router.post("/login", Unauthenticated, LoginController.send);
router.get("/logout", Authenticated, LoginController.logout);

/* GET home page. */
router.get("/:id", HomeController.show);
router.get("/", HomeController.index);

module.exports = { router, routerNoCsrf };
