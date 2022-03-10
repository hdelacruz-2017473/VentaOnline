'use strict'

const express = require('express');
const billController = require('../controllers/bill.controller');
const mdAuth = require('../services/authenticated');

const api = express.Router();

api.post('/generateBill', [mdAuth.ensureAuth], billController.generateBill);
api.get('/getBills/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.getBills);
api.get('/getBill/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.getBill);
api.put('/updateBill/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.updateBill);


module.exports = api;