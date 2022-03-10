'use strict'

const mongoose = require ('mongoose');

const categoySchema = mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('Category', categoySchema);