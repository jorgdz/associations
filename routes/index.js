var express = require("express");
var router = express.Router();
const csurf = require("csurf");
const csrfProtection = csurf();

const { Authenticated, Unauthenticated } = require("../config/auth");

const HomeController = require("../src/Controllers/HomeController");
const AdminController = require("../src/Controllers/AdminController");
const LoginController = require("../src/Controllers/LoginController");

router.use(csrfProtection);

router.get("/home", Authenticated, AdminController.index);
router.get("/cart", HomeController.cart);

/* GET, POST Login. */
router.get("/login", Unauthenticated, LoginController.login);
router.post("/login", Unauthenticated, LoginController.send);
router.get("/logout", Authenticated, LoginController.logout);

/* GET home page. */
router.get("/:id", HomeController.show);
router.get("/", HomeController.index);

module.exports = router;
