module.exports = {
    async anunciarNovosVencedores(client, categoria_nome, indicado_nome, callbackPorServidor) {

        client.guilds.cache.forEach(async guild => {
            const serverId = guild.id; 
            const canal = guild.systemChannel;

            if (!canal) return;

            const msgVencedor = 
                `🏆 **Novo vencedor!**\n` +
                `Categoria: **${categoria_nome}**\n` +
                `Vencedor: **${indicado_nome}**`;

            await canal.send(msgVencedor);

            if (callbackPorServidor) {
                const rankingMsg = await callbackPorServidor(serverId);

                if (rankingMsg) {
                    await canal.send(rankingMsg);
                }
            }
        });

    },
};

