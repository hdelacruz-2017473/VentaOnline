'use strict'

const jwt = require ('jwt-simple');
const secretKey = 'datoSecreto';
//const CartShopping = require('../models/cartShopping.model');

exports.ensureAuth =async (req, res, next)=>{
    if(req.headers.authorization){
        try {
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);           
            
        } catch (error) {
            console.log(error);
            //const ShoppingDelete = await CartShopping.deleteMany();
            return res.status(401).send({message:'Token is not valid or expired'});

        }

         req.user = payload;
         next();

    }else{
        return res.status(403).send({message:'The requested does not contain the authentication header'});

    } 
};

exports.isAdmin = (req, res, next)=>{
    try {
        const user = req.user;
        if(user.role === 'ADMIN'){
            return next();

        }else{
            return res.status(403).send({message:'User unauthorized'});
        }
        
    } catch (error) {
        console.log(error);
        return error;
    }
}