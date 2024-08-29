const express = require('express');
const app = express();
const path = require('path');  
const token = require('./util/token'); // Importa o módulo de token

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
}));

app.use('/', router.get('/sobre', (req, res) => {
    res.status(200).send({
        "nome": "CHATINFO",
        "autor": "Guilherme Reinehr",
        "versao": "0.1.0"
    });
}));

app.use("/entrar", router.post("/entrar", async (req, res) => {
    const usuarioController = require("./controllers/usuarioController.js");
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

app.use("/salas", router.get("/salas", async (req, res) => {
    const salaController = require("./controllers/salaController");
    const isAuthorized = await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick);
    if (isAuthorized) {
        let resp = await salaController.get();
        res.status(200).send(resp);
    } else {
        res.status(401).send({ msg: "Usuário não autorizado" });
    }
}));

app.use("/sala/entrar", router.post("/sala/entrar", async (req, res) => {
    const salaController = require("./controllers/salaController");
    const isAuthorized = await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick);
    if (isAuthorized) {
        let resp = await salaController.entrar(req.headers.iduser, req.query.idSala);
        res.status(200).send(resp);
    } else {
        res.status(401).send({ msg: "Usuário não autorizado" });
    }
}));

app.use("/sala/sair", router.post("/sala/sair", async (req, res) => {
    const salaController = require("./controllers/salaController");
    const isAuthorized = await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick);
    if (isAuthorized) {
        let resp = await salaController.sair(req.headers.iduser);
        res.status(200).send(resp);
    } else {
        res.status(401).send({ msg: "Usuário não autorizado" });
    }
}));

app.use("/sala/enviar", router.post("/sala/enviar", async (req, res) => {
    const salaController = require("./controllers/salaController");
    const isAuthorized = await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick);
    if (isAuthorized) {
        let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idSala);
        res.status(200).send(resp);
    } else {
        res.status(401).send({ msg: "Usuário não autorizado" });
    }
}));

app.use("/sala/listar", router.get("/sala/listar", async (req, res) => {
    const salaController = require("./controllers/salaController");
    const isAuthorized = await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick);
    if (isAuthorized) {
        let resp = await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
        res.status(200).send(resp);
    } else {
        res.status(401).send({ msg: "Usuário não autorizado" });
    }
}));

module.exports = app;
