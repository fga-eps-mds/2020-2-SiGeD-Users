const express = require('express')
const routes = express.Router();

const UserController = require('./Controllers/UserController')

//routes.get('/user', UserController.index) 
routes.get('/index', UserController.signUpGet)
routes.post('/signUp', UserController.signUpPost)
routes.put('/update/:id', UserController.signUpPut)
routes.delete('/delete/:id', UserController.signUpDelete)


module.exports = routes;


