const router = require("express").Router();
const controller = require("../controllers/categoriaController");

router.post("", controller.inserirCategorias);

module.exports = router;
