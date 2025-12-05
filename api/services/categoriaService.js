const categoriaRepository = require("../repository/categoriaRepository");

module.exports = {
    async listarCategoriasPorAno(ano) {
        let resultado = await categoriaRepository.listarPorAno(ano);
        
        return resultado;
    },

    async cadastrarCategorias(categorias){
        await categoriaRepository.inserirCategorias(categorias);
    }
};
