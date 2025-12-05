const router = require("express").Router();
const controller = require("../controllers/indicadoController");

router.post("", controller.inserirIndicados);

module.exports = router;
