'use strict'

const express = require('express');
const helmet = require ('helmet');
const bodyParser = require ('body-parser');
const cors = require('cors');
const userRoute = require('../src/routes/user.routes');
const categoryRoute = require('../src/routes/category.routes');
const productRoute = require('../src/routes/product.routes');
const cartShoppingRoute = require('../src/routes/cartShopping.routes');
const billRoute = require('../src/routes/bill.routes');

const app =  express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/cartShopping', cartShoppingRoute);
app.use('/bill', billRoute)

module.exports = app;

