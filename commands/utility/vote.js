const { SlashCommandBuilder } = require("discord.js");
const sendCategoryVoting = require("../../utils/sendCategoryVoting");
const pool = require("../../database/connection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Inicia a votação do The Game Awards"),

    async execute(interaction) {
        await interaction.reply({ content: "Verificando seu status...", ephemeral: true });

        const user = interaction.user;
        const guildId = interaction.guildId;

        const [rows] = await pool.query(
            "SELECT * FROM participante WHERE discord_user_id = ? AND servidor_id = ?",
            [user.id, guildId]
        );

        let participanteId;

        if (rows.length === 0) {
            const result = await pool.query(
                "INSERT INTO participante (discord_user_id, nome, servidor_id) VALUES (?, ?, ?)",
                [user.id, user.username, guildId]
            );
            participanteId = result[0].insertId;
        } else {
            participanteId = rows[0].id;
        }

        const anoAtual = new Date().getFullYear();

        const [votos] = await pool.query(`
            SELECT v.id 
            FROM voto v
            JOIN categoria_indicado ci ON ci.id = v.categoria_indicado_id
            WHERE v.participante_id = ? AND ci.ano = ?
            LIMIT 1
        `, [participanteId, anoAtual]);

        if (votos.length > 0) {
            return interaction.editReply({
                content: "❌ Você já votou este ano! Não é permitido votar duas vezes.",
                ephemeral: true
            });
        }

        user.participante_id = participanteId;

        await interaction.editReply({
            content: "Enviei a votação na sua DM!",
            ephemeral: true
        });

        try {
            await user.send("🎮 Vamos começar a votação do The Game Awards!");
            sendCategoryVoting(user);
        } catch (e) {
            return interaction.editReply({
                content: "❌ Não consegui enviar DM para você. Ative 'Permitir mensagens diretas' no Discord.",
                ephemeral: true
            });
        }
    }
};
