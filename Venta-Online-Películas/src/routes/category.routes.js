'use strict'

const categoryController = require('../controllers/category.controller');
const express = require('express');
const mdAuth = require ('../services/authenticated');

const api = express.Router();

api.post('/saveCategory',[mdAuth.ensureAuth, mdAuth.isAdmin] ,categoryController.saveCategory);
api.put('/updateCategory/:id',[mdAuth.ensureAuth, mdAuth.isAdmin],categoryController.updateCategory);
api.get('/getCategorys',  mdAuth.ensureAuth, categoryController.getCategorys);
api.get('/searchProduCategory', mdAuth.ensureAuth, categoryController.searchProduCategory);
api.delete('/deleteCategory/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.deleteCategory);
module.exports = api; 