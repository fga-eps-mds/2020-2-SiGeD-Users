const express = require('express')
const routes = express.Router();

const UserController = require('./Controllers/UserController')

routes.get('/user', UserController.index) 

module.exports = routes;