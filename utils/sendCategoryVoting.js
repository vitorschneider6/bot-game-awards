const pool = require("../database/connection");
const numberEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

async function sendCategoryVoting(user, categoriaIndex = 0) {

    // 1. Pegamos todas as categorias
    const [categorias] = await pool.query("SELECT * FROM categoria ORDER BY id ASC");

    if (categoriaIndex >= categorias.length) {
        return user.send("🎉 Você finalizou todas as votações! Obrigado por participar!");
    }

    const categoria = categorias[categoriaIndex];

    // 2. Buscar participantes dessa categoria + indicado + foto
    const [indicados] = await pool.query(`
        SELECT ci.id AS categoria_indicado_id, i.nome, i.foto
        FROM categoria_indicado ci
        JOIN indicado i ON i.id = ci.indicado_id
        WHERE ci.categoria_id = ?
        ORDER BY ci.id ASC
    `, [categoria.id]);

    if (indicados.length === 0) {
        await user.send(`⚠️ Categoria **${categoria.nome}** não possui indicados.`);
        return sendCategoryVoting(user, categoriaIndex + 1);
    }

    // 3. Criar embed bonito
    const embed = {
        title: `🎮 ${categoria.nome}`,
        description: "Reaja com o emoji correspondente ao seu voto!",
        color: 0x5865F2,
        fields: []
    };

    indicados.forEach((ind, i) => {
        embed.fields.push({
            name: `${numberEmojis[i]}  ${ind.nome}`,
            value: ind.foto ? `[Foto](${ind.foto})` : "Sem foto",
            inline: false
        });
    });

    const message = await user.send({ embeds: [embed] });

    // 4. Adicionar reações de número
    for (let i = 0; i < indicados.length; i++) {
        await message.react(numberEmojis[i]);
    }

    // 5. Aguardar voto
    return new Promise((resolve) => {
        const filter = (reaction, usr) =>
            usr.id === user.id && numberEmojis.includes(reaction.emoji.name);

        const collector = message.createReactionCollector({ filter, max: 1, time: 120000 });

        collector.on("collect", async (reaction) => {
            const escolhaIndex = numberEmojis.indexOf(reaction.emoji.name);
            const escolhido = indicados[escolhaIndex];

            // Salvar no BD
            await pool.query(
                "INSERT INTO voto (categoria_indicado_id, participante_id) VALUES (?, ?)",
                [escolhido.categoria_indicado_id, user.participante_id]
            );

            await user.send(`👍 Voto registrado para **${escolhido.nome}**!`);

            // Vai para a próxima
            resolve(sendCategoryVoting(user, categoriaIndex + 1));
        });

        collector.on("end", (collected) => {
            if (collected.size === 0) {
                user.send("⏳ Tempo esgotado! Indo para a próxima categoria.");
                resolve(sendCategoryVoting(user, categoriaIndex + 1));
            }
        });
    });
}

module.exports = sendCategoryVoting;
