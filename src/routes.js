const verify = require('./Utils/functionsJWT');

const express = require('express');

const routes = express.Router();

const UserController = require('./Controllers/UserController');

routes.get('/users', verify.verifyJWT, UserController.signUpGet);
routes.post('/signUp', UserController.signUpPost);
routes.post('/login', UserController.login);
routes.put('/users/update/:id', verify.verifyJWT, UserController.signUpPut);
routes.delete('/users/delete/:id', verify.verifyJWT, UserController.signUpDelete);

module.exports = routes;
