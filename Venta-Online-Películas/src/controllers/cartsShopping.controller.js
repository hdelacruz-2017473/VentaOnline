'use strict'

const {validateData} = require ('../utils/validate');
const Product = require('../models/product.model');
const CartShopping = require('../models/cartShopping.model');

//AGREGAR LOS PRODUCTOS AL CARRITO DE COMPRAS
exports.addProducts = async (req, res)=>{
    try {
        const params = req.body
        const data ={
            name: params.name,
            quantity: params.quantity
        }
        const msg = await validateData (data);
        if(!msg){
            let product = await Product.findOne({name: params.name});
            if(product){
                if(product.stock >= params.quantity){
                    //Agregar la compra
                    const cartShoppingUpdate = await CartShopping.findOneAndUpdate({user: req.user.sub}, {
                        $push:{
                            products:[
                                {
                                    movies:{idMovie:product._id, name:params.name, quantity: params.quantity, price:product.price, subTotal:(product.price * params.quantity)}
                                }
                            ]
                        }
                    },
                    {new:true});
                    const cartShopping = await CartShopping.findOne({user: req.user.sub}).lean();

                    let arrayProducts = Object.entries(cartShopping.products);
                    let total = 0;
                    for(let i=0; i<arrayProducts.length; i++){
                        total = total + cartShopping.products[i].movies.subTotal;
                    }
                    const totalUpdate = await CartShopping.findOneAndUpdate({user: req.user.sub}, {total: total}, {new:true});
                    
                    return res.send({message:'Added Products', totalUpdate});
                    
                }else{
                    return res.send({message:'Product quantity not available'}); 
                }
            }else{
                return res.send({message:'Product not Found'});
            }
        }else{
            return res.send(msg);
        }
        
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

