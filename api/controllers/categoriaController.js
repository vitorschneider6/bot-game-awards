const service = require("../services/categoriaService");

module.exports = {
    async inserirCategorias(req, res) {
        try {
            const { categorias } = req.body;

            if (!categorias) {
                return res.status(400).json({ sucesso: false, erro: "Dados inválidos" });
            }

            await service.cadastrarCategorias(categorias);

            res.json({ sucesso: true });

        } catch (e) {
            res.status(500).json({
                sucesso: false,
                erro: e.message || "Erro interno no servidor"
            });
        }
    }
};

