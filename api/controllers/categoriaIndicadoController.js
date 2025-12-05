const service = require("../services/categoriaIndicadoService");

module.exports = {
    async atualizarVencedorCategoria(req, res) {
        try {
            const { categoria_nome, indicado_nome } = req.body;

            if (!categoria_nome || !indicado_nome) {
                return res.status(400).json({ sucesso: false, erro: "Dados inválidos" });
            }

            await service.definirVencedor(categoria_nome, indicado_nome, req.bot);

            res.json({ sucesso: true });

        } catch (e) {
            res.status(500).json({
                sucesso: false,
                erro: e.message || "Erro interno no servidor"
            });
        }
    },

    async inserirIndicadosPorCategoria(req, res) {
        try {
            const { indicados_categoria } = req.body;

            if (!indicados_categoria || !indicados_categoria) {
                return res.status(400).json({ sucesso: false, erro: "Dados inválidos" });
            }

            await service.inserirIndicadosPorCategoria(indicados_categoria);
            
            res.json({ sucesso: true });

        } catch (e) {
            res.status(500).json({
                sucesso: false,
                erro: e.message || "Erro interno no servidor"
            });
        }
    }
};

