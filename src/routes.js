const express = require('express');
const verify = require('./Utils/functionsJWT');

const routes = express.Router();

const UserController = require('./Controllers/UserController');
const { verifyJWT } = require('./Utils/functionsJWT');

routes.get('/users/:id', verifyJWT, UserController.access);
routes.get('/users', verify.verifyJWT, UserController.signUpGet);
routes.post('/signup', UserController.signUpPost);
routes.post('/login', UserController.login);
routes.post('/recover-password', UserController.recoverPassword);
routes.put('/users/update/:id', verify.verifyJWT, UserController.signUpPut);
routes.delete('/users/delete/:id', verify.verifyJWT, UserController.signUpDelete);

module.exports = routes;
