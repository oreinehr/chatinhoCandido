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
  console.log("ID do usuário que deseja sair:", iduser);  // Log do ID do usuário

  // Buscar o usuário
  let user = await usuarioModel.buscarUsuario(iduser);
  console.log("Usuário encontrado:", user);

  if (user) {
      // Se o usuário estiver em uma sala
      if (user.sala) {
          console.log("Sala atual do usuário:", user.sala);

          // Atualizar o usuário para remover a sala
          user.sala = null;

          // Salvar as alterações no usuário
          let resultado = await usuarioModel.alterarUsuario(user);
          console.log("Resultado ao alterar usuário:", resultado);

          if (resultado) {
              return { msg: "Usuário saiu da sala com sucesso", timestamp: Date.now() };
          } else {
              return { msg: "Falha ao atualizar o usuário" };
          }
      } else {
          return { msg: "Usuário não está em nenhuma sala" };
      }
  } else {
      return { msg: "Usuário não encontrado" };
  }
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
