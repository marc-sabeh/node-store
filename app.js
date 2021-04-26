const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



mongoose.connect(`mongodb://localhost:27017/${process.env.MONGODB_NAME}`,{useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true } , (err)=>{
    if(!err){
        console.log("Success! Connected to Db");
    } else{
        console.log("Error connecting to database");
    }
});



const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); //makes the uploads folder public to view image (could do it using another api)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);



//error thrown 
app.use((req,res,next) =>{
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});


//handle all errors
app.use((error, req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server Started on port", port);
})