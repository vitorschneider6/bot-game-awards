const pool = require("../../database/connection");

module.exports = {
    async getRanking(serverId) {
        const sql = `
            SELECT 
                p.nome AS participante,
                COALESCE(SUM(CASE WHEN ci.vencedor = 1 THEN 1 ELSE 0 END), 0) AS pontos
            FROM participante p
            LEFT JOIN voto v ON v.participante_id = p.id
            LEFT JOIN categoria_indicado ci ON ci.id = v.categoria_indicado_id
            WHERE p.servidor_id = ?
            GROUP BY p.id
            ORDER BY pontos DESC, participante ASC;
        `;

        const [rows] = await pool.query(sql, [serverId]);

        return rows;
    }
};
