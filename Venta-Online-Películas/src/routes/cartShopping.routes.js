'use strict'

const express = require('express');
const cartShoppingController = require('../controllers/cartsShopping.controller');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.put('/addProducts', mdAuth.ensureAuth, cartShoppingController.addProducts);

module.exports = api;