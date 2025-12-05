const express = require("express");
const cors = require("cors");
const routes = require("./routes");

module.exports = (client) => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        req.bot = client;
        next();
    });

    app.use("/api", routes);

    app.listen(3000, () => console.log("API rodando na porta 3000"));

    return app;
};
