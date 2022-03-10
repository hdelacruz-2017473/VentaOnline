'use strict'

const mongoose = require('mongoose');

const cartShoppingSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'},
    products :[
        {movies: {idMovie: {type: mongoose.Schema.ObjectId, ref:'Product'},
        name: String,
        quantity: Number,
        price: Number,
        subTotal: Number
            }
        }
    ],
    total:Number
})

module.exports = mongoose.model('CartShopping', cartShoppingSchema);