const express = require('express');

const routes = express.Router();
const jwt = require('jsonwebtoken');

const UserController = require('./Controllers/UserController');

function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  }

  return jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Não foi possível autenticar o token.' });
    }
    req.userId = decoded.id;
    next();
    return undefined;
  });
}

routes.get('/signUpGet', verifyJWT, UserController.signUpGet);
routes.post('/signUp', UserController.signUpPost);
routes.post('/login', UserController.login);
routes.put('/users/update/:id', verifyJWT, UserController.signUpPut);
routes.delete('/users/delete/:id', verifyJWT, UserController.signUpDelete);

module.exports = routes;
