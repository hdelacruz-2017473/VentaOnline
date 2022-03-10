'use strict'

const productController = require('../controllers/product.controller');
const express = require ('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/saveProduct',[mdAuth.ensureAuth, mdAuth.isAdmin] ,productController.saveProduct);
api.put('/updateProduct/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);
api.get('/getProducts', mdAuth.ensureAuth, productController.getProducts);
api.get('/getProductId/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProductId);
api.get('/getProductName', mdAuth.ensureAuth, productController.getProductName);
api.get('/getProExhausted', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProExhausted);
api.get('/getMorSales',mdAuth.ensureAuth, productController.getMorSales );

module.exports = api;  