const pool = require("../../database/connection");

module.exports = {
    async definirVencedor(categoria_nome, indicado_nome) {
        await pool.query(`
            UPDATE categoria_indicado ci
            JOIN categoria c ON ci.categoria_id = c.id
            JOIN indicado i ON ci.indicado_id = i.id
            SET ci.vencedor = (i.nome = ?)
            WHERE c.nome = ?;
        `, [indicado_nome, categoria_nome]);
    },

    async listarPorAno(ano){
        const [rows] = await pool.query(`
            SELECT c.nome, ci.indicado_id, i.nome AS indicado
            FROM categoria_indicado ci
            JOIN categoria c ON c.id = ci.categoria_id
            JOIN indicado i ON i.id = ci.indicado_id
            WHERE ci.ano = ?
        `, [ano]);

        return rows;
    },
    
    async inserirCategorias(categorias) {
        if (!categorias || categorias.length === 0) return;

        const values = categorias.map(c => [c.nome]);

        await pool.query(`
            INSERT INTO categoria (nome)
            VALUES ?
            ON DUPLICATE KEY UPDATE nome = nome
        `, [values]);
    }
};
