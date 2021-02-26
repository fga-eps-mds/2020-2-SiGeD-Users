const express = require('express')
const routes = express.Router();

const UserController = require('./Controllers/UserController')

routes.get('/index', UserController.signUpGet)
routes.post('/signup', UserController.signUpPost)
routes.put('/update/:id', UserController.signUpPut)
routes.delete('/delete/:id', UserController.signUpDelete)

module.exports = routes;