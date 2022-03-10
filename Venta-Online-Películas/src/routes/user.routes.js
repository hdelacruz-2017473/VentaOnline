'use strict'

const express = require ('express');
const userController = require ( '../controllers/user.controller');
const mdAuth = require ('../services/authenticated');

const api = express.Router();


api.post('/registerUser', userController.registerUser);
api.post('/addUser',[mdAuth.ensureAuth, mdAuth.isAdmin], userController.addUser)
api.post('/login', userController.login);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.put('/adminUpdateUser/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], userController.adminUpdateUser);
api.delete('/deleteUser/:id', mdAuth.ensureAuth, userController.deleteUser);
api.delete('/adminDeleteUser/:id',[mdAuth.ensureAuth, mdAuth.isAdmin] , userController.adminDeleteUser);

module.exports = api; 
