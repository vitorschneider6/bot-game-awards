const service = require("../services/indicadoService");

module.exports = {
    async inserirIndicados(req, res) {
        try {
            const { indicados } = req.body;

            if (!indicados) {
                return res.status(400).json({ sucesso: false, erro: "Dados inválidos" });
            }

            await service.cadastrarIndicados(indicados);

            res.json({ sucesso: true });

        } catch (e) {
            res.status(500).json({
                sucesso: false,
                erro: e.message || "Erro interno no servidor"
            });
        }
    }
};

