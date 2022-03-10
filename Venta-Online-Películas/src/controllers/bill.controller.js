'use strict'

const Bill = require('../models/bill.model');
const CartShopping = require ('../models/cartShopping.model');
const User = require ('../models/user.model');
const Product = require('../models/product.model');
const {validateData}= require('../utils/validate');

//GENERAR UNA FACTURA
exports.generateBill = async (req,res)=>{
    try {
        const user = await User.findOne({_id: req.user.sub});
        const searchCartShopping = await CartShopping.findOne({user: req.user.sub}).lean();
        let products = searchCartShopping.products;
        let total = searchCartShopping.total;

        const data ={
            date: new Date,
            user: req.user.sub,
            products: products,
            total: total
        };

        let factura = new Bill(data);
        //GUARDAR LA FACTURA
        await factura.save();
        let clearMovies = [];
        //LIMPIAR CARRITO
        const CartShoppingUpdate = await CartShopping.findOneAndUpdate({user:req.user.sub}, {products: clearMovies, total:0}, {new:true});
        //VALIDACIÓN DE STOCK Y TOTALSALES
        const searchBill = await Bill.findOne({_id: factura._id}).lean();
        let productsBill = searchBill.products;
        const arrayProductsBill = Object.entries(productsBill);
        //OBTENGO LOS DATOS DE LA FACTURADA GENERADA
        for(let i=0; i<arrayProductsBill.length; i++){
            let productId = productsBill[i].movies.idMovie;
            let quantity = productsBill[i].movies.quantity;
            let product = await Product.findOne({_id: productId});
            let stock = product.stock;
            let totalSales = product.totalSales;
            //EDITAR EL "STOCK" Y "TOTALSALES" DE LOS PRODUCTOS COMPRADOS
            let productUpdate = await Product.findOneAndUpdate({_id: productId}, {stock: (stock-quantity), totalSales: (totalSales+quantity)}, {new:true});
        }
        return res.send({message:`Bill Created by ${user.name} ${user.surname}`, factura});
        
    } catch (error) {
        console.log(error);
        return error;
    } 
};

//MOSTRAR TODAS LAS FACTURAS DE UN USUARIO
exports.getBills = async (req, res)=>{
    try {
        const userId = req.params.id;
        const searchBill = await Bill.find({user: userId});
        
            if(searchBill){
                return res.send(searchBill);
    
            }else{
                return res.send({message:'This user has no bills'})
            }
                
    } catch (error) {
        console.log(error);
        return error;
    }
};

//MOSTRAR UNA FACTURA ESPECIFICA DE UN USUARIO
exports.getBill = async (req, res)=>{
    const billId = req.params.id;
    const searchBill = await Bill.findOne({_id: billId});
        if(searchBill){
            return res.send(searchBill);
        }else{
            return res.send({message:'The bill does not exist'});
        } 
}


//ACTUALIZAR UNA FACTURA (ADMIN)
exports.updateBill = async (req,res)=>{
    try {
        const billId = req.params.id;
        const params = req.body;
        const searchBill = await Bill.findOne({_id: billId}).lean();
        if(searchBill){
            const data = {
                productId : params.productId,
                quantity: params.quantity
            }
            const msg = await validateData(data);
            if(!msg){
                const productsBill = searchBill.products;
                const productosArray = Object.entries(productsBill);
                //VA A RECORRER EL ARRAY DE PRODUCTS DE LA FACTURA
                for(let i =0; i<productosArray.length; i++){
                    const idProduct = await productsBill[i].movies.idMovie;
                    if(idProduct == params.productId){
                        //VOY A IR A HACER UNA BUSQUEDA DEL PRODUCTO QUE SE PASÓ EN PARAMS
                        const product = await Product.findOne({_id: params.productId});
                        //OBTENGO LOS DATOS DEL PRODUCTO
                        let stock = product.stock;
                        let totalSales =product.totalSales;
                        //OBTENGO EL QUANTITY DEL PRODUCTO DE LA FACTURA
                        const quantityOld = productsBill[i].movies.quantity;
                        //SE RESTABLECE LOS ATRIBUTOS "STOCK" Y "TOTALSALES" EN LA BD DE PRODUCT
                        const productUpdate = await Product.findOneAndUpdate({_id: params.productId},{stock: (stock+quantityOld), totalSales: (totalSales-quantityOld)} ,{new:true});

                        if(productUpdate.stock >= params.quantity){
                            //ACTUALIZO LA FACTURA CON LOS NUEVOS DATOS
                            const billUpdate = await Bill.findOneAndUpdate({_id: billId, "products.movies.idMovie":idProduct}, 
                            {
                                "$set": { 
                                    "products.$.movies.quantity": params.quantity ,  
                                    "products.$.movies.subTotal": (params.quantity*product.price)
                                }
                            });

                            const productNew = await Product.findOne({_id: params.productId});
                            const stockNew= productNew.stock;
                            const totalSalesNew = productNew.totalSales;
                            //SE ESTABLECE LOS NUEVOS VALORES PARA LOS ATRIBUTOS "STOCK" Y "TOTALSALES" DEL PRODUCTO
                            const productUpdateNew = await Product.findOneAndUpdate({_id: params.productId}, {stock: (stockNew - params.quantity), totalSales:(totalSalesNew + params.quantity) }, {new:true});

                            //ACTUALIZAR FACTURA (TOTAL)
                            let total = 0;
                            const bill = await Bill.findOne({_id: billId});
                            const arrayMovies = Object.entries(bill.products);
                            for(let i =0; i<arrayMovies.length; i++){
                                total = total +bill.products[i].movies.subTotal;
                            }
                            const billUpdateNew = await Bill.findOneAndUpdate({_id: billId}, {total: total}, {new:true});
                            return res.send({message:'Bill Updated', billUpdateNew});
                         
                        }else{
                            return res.send({message:'Product quantity not available'});
                        }

                    }else{

                    }
                }

            }else{
                return res.send(msg);
            }

        }else{
            return res.send({message:'Bill not found'})
        }
        
    } catch (error) {
        console.log(error);
        return error;
    }
}


