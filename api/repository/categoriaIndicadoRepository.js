const pool = require("../../database/connection");

module.exports = {
    async inserirCategoriasEIndicados(categoriasArray, ano) {

        if (!categoriasArray || categoriasArray.length === 0) return;

        const conn = await pool.getConnection();
        await conn.beginTransaction();

        try {
            for (const item of categoriasArray) {
                
                const categoriaNome = item.categoria;
                const indicados = item.indicados || [];

                const [categoriaRows] = await conn.query(
                    `SELECT id FROM categoria WHERE nome = ?`,
                    [categoriaNome]
                );

                if (!categoriaRows.length) {
                    throw new Error(`Categoria não encontrada: ${categoriaNome}`);
                }

                const categoriaId = categoriaRows[0].id;

                for (const indicadoNome of indicados) {
                    
                    const [indicadoRows] = await conn.query(
                        `SELECT id FROM indicado WHERE nome = ?`,
                        [indicadoNome]
                    );

                    if (!indicadoRows.length) {
                        throw new Error(`Indicado não encontrado: ${indicadoNome}`);
                    }

                    const indicadoId = indicadoRows[0].id;

                    await conn.query(`
                        INSERT IGNORE INTO categoria_indicado 
                            (categoria_id, indicado_id, ano)
                        VALUES (?, ?, ?)
                    `, [categoriaId, indicadoId, ano]);
                }
            }

            await conn.commit();
            conn.release();
            return true;

        } catch (error) {
            await conn.rollback();
            conn.release();
            throw error;
        }
    }
};
