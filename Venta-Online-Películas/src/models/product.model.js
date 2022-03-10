'use strict'
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    totalSales: Number,
    category: {type: mongoose.Schema.ObjectId, ref:'Category'}
});

module.exports = mongoose.model('Product', productSchema);