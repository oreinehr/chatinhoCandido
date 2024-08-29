const jwt = require('jsonwebtoken');

const key = process.env.SECRET_KEY;

function checkToken(token, iduser, key) {
    try {
        const decoded = jwt.verify(token, key);
        return decoded.iduser === iduser;
    } catch (err) {
        return false;
    }
}

function setToken(id, key) {
    console.log("id: " + id);

    if (id) {
        return jwt.sign({ id }, key, { expiresIn: '8h' }); // Alterado para string com 'h' para horas
    }
    return false;
}

module.exports = {
    checkToken,
    setToken
};
