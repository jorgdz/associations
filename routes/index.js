var express = require("express");
var router = express.Router();

const HomeController = require("../src/Controllers/HomeController");

/* GET home page. */
router.get("/cart", HomeController.cart);
router.get("/", HomeController.index);
router.get("/:id", HomeController.show);

module.exports = router;
