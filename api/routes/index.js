const router = require("express").Router();

router.use("/categoria-indicado", require("./categoriaIndicadoRoutes"));
router.use("/categorias", require("./categoriaRoutes"));
router.use("/indicados", require("./indicadoRoutes"));

module.exports = router;