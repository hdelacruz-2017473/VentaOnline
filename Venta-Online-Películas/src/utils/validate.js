'use strict'

const User= require("../models/user.model");
const bcrypt = require ('bcrypt-nodejs');
const Category = require ('../models/category.model');
const Product = require('../models/product.model');

exports.validateData = (data)=>{
    let keys = Object.keys(data);
    let msg = '';

    for(let i of keys){
        if(data[i] !== null && data[i] !== undefined && data[i]!== '') continue
        msg += `The param ${i} is required \n`; 
    }
    return msg.trim();
}

exports.searchUser = async (username)=>{
    try {
        const userExist = User.findOne({username: username}).lean();
        return userExist;
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
};

exports.encrypt = async (password)=>{
    try {
        return bcrypt.hashSync(password);
    } catch (error) {
        console.log(error);
        return error;
        
    }
};

exports.checkPassword = async (password, hashSync)=>{
    try {
        return bcrypt.compareSync(password, hashSync);
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

exports.checkPermission = async (userId, sub)=>{
    try {
        if(userId === sub){
            return true;
        }else{
            return false;
        } 
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

exports.checkDataUpdate = async (user)=>{
    try {
        if(user.password || Object.entries(user).length ===0 || user.role){
            return false;
        }else{
            return true;
        }
        
    } catch (error) {
        console.log(error);
        return error;        
    }
}




exports.searchCategory = async(name)=>{
    try {
        return await Category.findOne({name: name});
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

exports.searchProduct = async(name)=>{
    try {
         return await Product.findOne({name: name});
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

exports.orderMovies = async (productos)=>{
    try {
        productos.sort((a,b)=> b.totalSales - a.totalSales);
        return productos;

    } catch (error) {
        console.log(error);
        return error;
    }
}





