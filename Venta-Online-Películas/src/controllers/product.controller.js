'use strict'

const {validateData, searchProduct, checkDataUpdate, orderMovies} = require ('../utils/validate');
const Category = require ('../models/category.model');
const Product = require('../models/product.model');

//AGREGAR UN NUEVO PRODUCTO
exports.saveProduct =async (req, res)=>{
    try {
        const params = req.body;
        const data= {
            name: params.name,
            price: params.price,
            stock: params.stock,
            totalSales: 0,
            category: params.category
        }
        const msg = await validateData(data);
        if(!msg){
            const categoryExist = await Category.findOne({_id: params.category});
            if(categoryExist){
                const productExist = await searchProduct(params.name);
                if(!productExist){
                    data.description= params.description;
                    const producto = new Product(data);
                    await producto.save();
                    return res.send({message:'Product saved', producto});
                }else{
                    return res.send({message:'This product already exist'});
                }

            }else{
                return res.send({message: 'Product allocation category does not exist '})
            }
        }else{
            return res.send(msg);
        }
        
    } catch (error) {
        console.log(error);
        return error;      
    }
};

//ACTUALIZAR UN PRODUCTO
exports.updateProduct = async (req,res)=>{
    try {
        const params = req.body;
        const productId = req.params.id;

        const search = await Product.findOne({_id: productId});
        if(search){
            const dataSensitive = await checkDataUpdate(params);
            if(dataSensitive === true){
                const productExist = await searchProduct(params.name);
            if(!productExist){
                const productUpdate = await Product.findOneAndUpdate({_id:productId}, params, {new:true});
                return res.send({message:'Product Updated', productUpdate});
            }else{
                return res.send({message:'This product already exist'})
            }
            }else{
                return res.send({message:'Not already data to update'})
        }
        }else{
            return res.send({message:'Product not found'});
        }
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
};

//ELIMINAR UN PRODUCTO
exports.deleteProduct =async (req,res)=>{
    try {
        const productId = req.params.id;
        const producto = await Product.findOne({_id: productId});

        if(producto){
            const productDelete = await Product.findOneAndDelete({_id: productId});
            return res.send({message:'Product Deleted'})
        }else{
            return res.send({message:'Product not foun or already deleted'})
        }
    } catch (error) {
        console.log(error);
        return error;    
    }
}



//MOSTRAR TODOS LOS PRODUCTOS EXISTENTES
exports.getProducts = async(req, res)=>{
    try {
        const productos = await Product.find().populate('category');
        return res.send(productos);
    } catch (error) {
        console.log(error);
        return error;
    }
}
//MOSTRAR UN PRODUCTO EN ESPECIFICO POR EL ID
exports.getProductId = async (req, res)=>{
    try {
        const productId = req.params.id;
        const producto = await Product.findOne({_id: productId}).populate('category');
        if(producto){
            return res.send(producto);
        }else{
            return res.send({message:'Product not found'})
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//MOSTRAR UN PRODUCTO EN ESPECIFICO POR EL NOMBRE
 exports.getProductName = async (req, res)=>{
    try {
        const productName = req.body.name;
        const producto = await Product.findOne({name:{$regex:productName, $options: 'i'}})
        .populate('category');
        if(producto){
            return res.send(producto);
        }else{
            return res.send({message:'Product not found'})
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};


//MOSTRAR PRODUCTOS AGOTADOS (STOCK=0)
exports.getProExhausted = async(req, res)=>{
    try {
        const productos = await Product.find({stock: 0}).populate('category');
        return res.send(productos);
        
    } catch (error) {
        console.log(error);
        return error;
    } 
}

//MOSTRAR PRODUCTOS MÁS VENDIDOS
exports.getMorSales = async(req, res)=>{
    try {
        const productos = await Product.find().populate('category').lean();

        return res.send(await orderMovies(productos)); 
        
    } catch (error) {
        console.log(error);
        return error;    
    }
}
  