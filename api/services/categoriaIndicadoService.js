const categoriaIndicadoRepository = require("../repository/categoriaIndicadoRepository");
const categoriaRepository = require("../repository/categoriaRepository");
const rankingRepository = require("../repository/rankingRepository");
const botService = require("./botService");

module.exports = {
    async definirVencedor(categoria_nome, indicado_nome, client) {
        await categoriaRepository.definirVencedor(categoria_nome, indicado_nome);

        await botService.anunciarNovosVencedores(
            client,
            categoria_nome,
            indicado_nome,
            async (serverId) => {
                return await this.gerarRankingPorServidor(serverId);
            }
        );
    },

    async gerarRankingPorServidor(serverId) {
        const resultado = await rankingRepository.getRanking(serverId);

        if (!resultado.length)
            return "Nenhum participante encontrado neste servidor.";

        let rankMsg = "🏆 **\nRanking Atualizado**\n\n";

        const medalhas = ["🥇", "🥈", "🥉"];

        resultado.forEach((r, i) => {
            if (i < 3) {
                rankMsg += `${medalhas[i]} **${r.participante}** - ${r.pontos} ponto(s)\n`;
            } else {
                rankMsg += `${i + 1}. **${r.participante}** - ${r.pontos} ponto(s)\n`;
            }
        });

        return rankMsg;
    },

    async inserirIndicadosPorCategoria(indicados_categoria) {
        await categoriaIndicadoRepository.inserirCategoriasEIndicados(indicados_categoria, 2025);
    }
};
