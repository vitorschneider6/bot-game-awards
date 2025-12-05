const router = require("express").Router();
const controller = require("../controllers/categoriaIndicadoController");

router.post("", controller.inserirIndicadosPorCategoria);
router.post("/atualizar-vencedor", controller.atualizarVencedorCategoria);

module.exports = router;
