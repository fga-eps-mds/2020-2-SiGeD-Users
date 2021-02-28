const express = require('express')
const routes = express.Router();

const UserController = require('./Controllers/UserController')

routes.get('/signUpGet', UserController.signUpGet)
routes.post('/signUp', UserController.signUpPost)
routes.put('/users/update/:id', UserController.signUpPut)
routes.delete('/users/delete/:id', UserController.signUpDelete)

module.exports = routes;