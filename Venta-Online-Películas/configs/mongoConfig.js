'use estrict'

const mongoose = require ('mongoose');


exports.init = ()=>{
    const uriMongo = 'mongodb://127.0.0.1:27017/proyectoFinal';
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', ()=>{
        console.log('MongoDb | could not be connect ')
        mongoose.disconnect();
    });

    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDb | try connecting');
    });

    mongoose.connection.on('connected', ()=>{
        console.log('mongoDb | connected to mongodb');
    });

    mongoose.connection.once('open', ()=>{
        console.log('MongoDb | connected to database');
    });

    mongoose.connection.on('reconnected', ()=>{
        console.log('MongoDb | reconnnected to mongodb');
    });

    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoDb | disconnected to mongodb')
    });


    mongoose.connect(uriMongo, {
        connectTimeoutMS: 2500, //tiempo para conectarse
        maxPoolSize: 50, //Máximo de conexiones
        useNewUrlParser: true //Parsea la "linea de conexion"
    }).catch(err=>console.log(err));
}