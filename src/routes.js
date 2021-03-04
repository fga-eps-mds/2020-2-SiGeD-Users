const express = require('express')
const routes = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv-safe').config();

const UserController = require('./Controllers/UserController')

routes.get('/signUpGet', verifyJWT, UserController.signUpGet)
routes.post('/signUp', verifyJWT, UserController.signUpPost)
routes.post('/login', UserController.login);
routes.put('/users/update/:id', verifyJWT, UserController.signUpPut)
routes.delete('/users/delete/:id', verifyJWT, UserController.signUpDelete)

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      req.userId = decoded.id;
      next();
    });
}

module.exports = routes;

