const salaModel = require('../models/salaModel');
const usuarioModel = require('../models/usuarioModel');

exports.get = async (req, res) => {
    return await salaModel.listarSalas();
};  

exports.entrar = async (iduser, idsala) => {
    const sala = await salaModel.buscarSala(idsala);
    let user = await usuarioModel.buscarUsuario(iduser);
    
    if (!sala || !user) {
        return { msg: "Sala ou usuário não encontrado", timestamp: Date.now() };
    }

    user.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo };
    
    if (await usuarioModel.alterarUsuario(user)) {
        return { msg: "OK", timestamp: Date.now() };
    }
    return { msg: "Erro ao atualizar usuário", timestamp: Date.now() };
};

exports.sair = async (iduser) => {
    let user = await usuarioModel.buscarUsuario(iduser);
    
    if (!user) {
        return { msg: "Usuário não encontrado", timestamp: Date.now() };
    }

    user.sala = null;
    
    if (await usuarioModel.alterarUsuario(user)) {
        return { msg: "OK", timestamp: Date.now() };
    }
    return { msg: "Erro ao atualizar usuário", timestamp: Date.now() };
};

exports.enviarMensagem = async (nick, msg, idsala) => {
    const sala = await salaModel.buscarSala(idsala);

    if (!sala) {
        return { msg: "Sala não encontrada", timestamp: Date.now() };
    }

    if (!sala.msgs) {
        sala.msgs = [];
    }

    const timestamp = Date.now();

    sala.msgs.push({ timestamp, msg, nick });

    let resp = await salaModel.atualizarMensagens(sala);

    return { msg: "OK", timestamp };
};

exports.buscarMensagens = async (idsala, timestamp) => {
    let mensagens = await salaModel.buscarMensagens(idsala, timestamp);
    
    return {
        timestamp: mensagens[mensagens.length - 1]?.timestamp || timestamp,
        msgs: mensagens
    };
};
