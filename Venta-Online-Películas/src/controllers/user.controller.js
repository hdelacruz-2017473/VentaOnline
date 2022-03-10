'use strict'

const User = require ('../models/user.model');
const {validateData, searchUser, encrypt, checkPassword, checkPermission, checkDataUpdate} = require ('../utils/validate');
const jwt = require ('../services/jwt');
const CartShopping = require('../models/cartShopping.model');
const Bill = require('../models/bill.model');


//REGISTRAR UN USUARIO
exports.registerUser = async (req, res)=>{
    try {
        const params = req.body;
        const data = {
            name: params.name,
            surname: params.surname,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        };
    
        let msg = validateData(data);
    
        if(!msg){
            if(params.role){
                return res.send({message:'Can not add role'})
            }else{
                const userExist = await searchUser(params.username);
                if(!userExist){
                    data.email = params.email;
                    data.password = await encrypt(params.password);
        
                    let user = new User(data);
                    await user.save();
                    return res.send({message:'User saved'});
        
                }else{
                    return res.send({message: 'Username in use'});
                }
            }
    
        }else{
            return res.status(400).send(msg);
        }
         
    } catch (error) {
        console.log(error);
        return error;
    }
};

//AGREGAR UN USUARIO POR UN ADMIN
exports.addUser = async (req, res)=>{
    try {
        const params = req.body;
        const data = {
            name: params.name,
            surname: params.surname,
            username: params.username,
            password: params.password,
            role: params.role
        };
    
        let msg = validateData(data);
    
        if(!msg){
            const userExist = await searchUser(params.username);
            if(!userExist){
                data.email = params.email;
                data.password = await encrypt(params.password);
    
                let user = new User(data);
                await user.save();
                return res.send({message:'User saved'});
    
            }else{
                return res.send({message: 'Username in use'});
            }
    
        }else{
            return res.status(400).send(msg);
        }
         
    } catch (error) {
        console.log(error);
        return error;
    }
};


/*Validar los datos obligatorios
Que exista el usuario
Que el password ingresado le pertenezca al usuario ingresado
Crearle un token
Devolver la data*/
exports.login = async(req, res)=>{
    try {
        const params = req.body;

        const data = {
            username : params.username,
            password: params.password
        }

        const msg = validateData(data)
        if(!msg){
            const userExist = await searchUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);
                let dataCart ={
                    user: userExist._id,
                    total: 0
                }
                const cartShopping = new CartShopping(dataCart);
                const search = await CartShopping.findOne({user: userExist._id});
                if(search){
                    //
                    const bills = await Bill.find({user: userExist._id});
                    return res.send({message: 'Login successfuly', token, bills});
                }else{
                    await cartShopping.save();
                    const bills = await Bill.find({user: userExist._id});
                    return res.send({message: 'Login successfuly', token, bills});
                }                
            }else{
                return res.send({message: 'Username or password incorrect'});
            }
        }else{
            return res.status(400).send(msg);
        }
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

//ACTUALIZAR UN USUARIO
exports.updateUser = async (req, res)=>{
    try {
        const userId = req.params.id;
        const params = req.body;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === true){

            const checkData = await checkDataUpdate(params);
            if(params.role || params.password){
                return res.send({message:'Can not update role or password'});
            }else{
                if(checkData === true){
                    const userExist = await searchUser(params.username);
    
                    if(!userExist){
                        const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new:true}).lean();
                        return res.send({message:'User updated'});
                    }else{
                        return res.send({message: 'This username already exists'})
                        }     
                }else{
                    return res.send({message:'Empty data'});
                }
            }
        }else{

            return res.status(401).send({message:'Unauthorized to update this user'})
        }
      
    } catch (error) {
        console.log(error);
        return error;
        
    } 
}

//ACTUALIZAR USUARIO POR UN ADMIN
exports.adminUpdateUser = async (req, res)=>{
    try {
        const userId = req.params.id;
        const params = req.body;
        const user = await User.findOne({_id: userId});
        if(user){
            if(user.role ==='ADMIN'){
                return res.send({message:'You can not update an ADMIN'})
            }else{
                if(params.password){
                    return res.send({message:'Can not update password'});
                }else{
                    const userExist = await searchUser(params.username);
                    if(!userExist){
                        const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new:true}).lean();
                        return res.send({message:'User updated'});
                    }else{
                        return res.send({message: 'This username already exists'})
                    }  
                }
            }
        }else{
            return res.send({message:'User not found'})
        }

    } catch (error) {
        console.log(error);
        return error;       
    } 
}

//ELIMINAR USUARIO
exports.deleteUser =async (req, res)=>{
    try {
        const userId = req.params.id;

        const permission = await checkPermission(userId, req.user.sub);

        if(permission === false) return res.status(403).send({message:'Acction unathorized'});
        const deleteUser = await User.findOneAndDelete({_id :userId});
        
        if(deleteUser) return res.send({message:'User Deleted'});
        return res.send({message:'User not found or already deleted'});
        
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

//ELIMINAR UN USUARIO POR UN ADMIN
exports.adminDeleteUser =async (req, res)=>{
    try {
        const userId = req.params.id;
        const user = await User.findOne({_id:userId});
        if(user){
            if(user.role ==='CLIENT'){
                const deleteUser = await User.findOneAndDelete({_id :userId});
                return res.send({message:'User Deleted'}); 
            }else{
                return res.send({message:'You can not Delete an ADMIN'})
            }
        }else{
            return res.send({message:'User not found or already deleted'});
        }       
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

