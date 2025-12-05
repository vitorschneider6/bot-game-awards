const pool = require("../../database/connection");

module.exports = {
    async inserirCategorias(indicados) {
        if (!indicados || indicados.length === 0) return;

        const values = indicados.map(c => [c.nome]);

        await pool.query(`
            INSERT INTO indicado (nome)
            VALUES ?
            ON DUPLICATE KEY UPDATE nome = nome
        `, [values]);
    }
};
