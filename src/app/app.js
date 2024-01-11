const morgan = require("morgan");

const express = require("express");

const router = require("../router/user.router");

const app = express();
app.use(morgan("dev")); //debe ir antes de las rutas
app.get("/", (req, res) => {
    res.send("This is my app");
});

app.use(express.json());
app.use("/api/v1", router);

module.exports = app;