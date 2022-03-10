'use strict'
const {validateData, searchCategory, checkDataUpdate} = require ('../utils/validate');
const Category = require ('../models/category.model');
const Producto = require ('../models/product.model');


//AGREGAR UN CATEGORÍA NUEVA
exports.saveCategory =async (req, res)=>{
    try {
        const params = req.body;

        const data = {
            name: params.name
        }

        const msg = await validateData(data)
        if(!msg){
            const categoryExist = await searchCategory(params.name)
            if(categoryExist){
                return res.send({message:'Category already exist'})
            }else{
                const category = new Category(data);
                await category.save();
                return res.send({message:'Category saved', category})
            } 
        }else{
            return res.send({msg})
        }
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

//ACTUALIZAR UNA CATEGORÍA
exports.updateCategory =async (req, res)=>{
    try {

        const params = req.body;
        const categoyId = req.params.id;

        const dataSensitive = await checkDataUpdate(params);

        if(dataSensitive === true){
            const categoryExist = await searchCategory(params.name);
            if(categoryExist){
                return res.send({message:'Name of category already exist'})
            }else{
                const categoryUpdate = await Category.findOneAndUpdate({_id: categoyId}, params, {new:true});
                if(categoryUpdate){
                    return res.send({message:'Category Updated', categoryUpdate});
                }else{
                    return res.send({message:'Category not found'});
                }
            } 
        }else{
            return res.send({message:'Not already data to update'});
        }
      
    } catch (error) {
        console.log(error);
        return error;
    }
};

//MOSTRAR TODAS LAS CATEGORIAS EXISTENTES
exports.getCategorys = async(req, res)=>{
    try {
        const categorys = await Category.find();
        return res.send(categorys);
    } catch (error) {
        
        console.log(error);
        return error;
    }
};


//MOSTRAR UNA CATEGORÍA Y SUS PRODUCTOS 
exports.searchProduCategory = async (req, res)=>{
    try {
        const categoryName = req.body.name;
        const category = await Category.findOne({name: categoryName});
        if(category){
            const productos = await Producto.find().populate('category').lean();
            const filterProduct = [];
            for(let i of productos){
                if(i.category.name === categoryName){
                    filterProduct.push(i);
                }
            }
                return res.send({category, filterProduct});  
        }else{
            return res.send({message:'Category not found'});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//ELIMINAR UNA CATEGORIA 
exports.deleteCategory  = async(req,res)=>{
    try {
        const categoryId = req.params.id;
        const category = await Category.findOne({_id: categoryId});

        if(category && category.name!=='Default'){
            const productos = await Producto.find({category: categoryId}).lean();
            if(productos){
                //LE ASIGNAMOS A LOS PRODUCTOS EL ID DE LA CATGORIA "DEFAULT" QUE YA ESTA CREADA
                const categoryDefault = await Category.findOne({name: 'Default'});
                const productUpdate = await Producto.updateMany({category: categoryId}, {$set:{category: categoryDefault._id}});
                const categoryDelete= await Category.findOneAndDelete({_id: categoryId});
                return res.send({message: 'Category Deleted', categoryDelete});
            }else{
                const categoryDelete = await Category.findOneAndDelete({_id: categoryId});
                return res.send({message: 'Category Deleted'});
            }

        }else{
            return res.send({message:'Category not found or is category DEFAULT'})
        }

    } catch (error) {
        console.log(error);
        return error;
    }
} 

