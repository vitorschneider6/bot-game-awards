const indicadosRepository = require("../repository/indicadoRepository");

module.exports = {
    async cadastrarIndicados(indicados){
        await indicadosRepository.inserirCategorias(indicados);
    }
};
