const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename:function(req, file, cb){
        cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter =(req,file,cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
    }else{
    cb(null,false);
    }
}

const upload =multer({storage: storage, limits:{
    fileSize:1024 *1024 *5,
    },
    fileFilter: fileFilter
});

router.get('/', (req,res)=>{
    ProductModel.find()
    .select('name price _id product_image')
    .exec()
    .then(docs => {
        const response ={
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    name: doc.name,
                    price: doc.price,
                    _id : doc._id,
                    product_image : doc.product_image,
                    request:{
                        type: 'GET',
                        url: `http://localhost:3000/products/${doc._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error :err});
    })  
});

router.post('/', checkAuth, upload.single('product_image'),(req,res)=>{
    console.log(req.file);
    const product = new ProductModel({
        name: req.body.name,
        price : req.body.price,
        product_image: req.file.path
    });
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Created Product Succesfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id : result._id,
                request:{
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        })  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })  
    });

       
 });

 router.get('/:productId', (req,res)=>{
     const id = req.params.productId;

     ProductModel.findById(id)
     .select('_id name price product_image')
     .exec()
     .then(doc =>{
         console.log(doc);
         if(doc){
         res.status(200).json(doc);
         }
         else{
             res.status(404).json({message: "Not found"});
         }
     })
     .catch(err => {
         console.log(err);
         res.status(500).json(err);
     });
 });

 router.patch('/:productId', checkAuth, (req,res)=>{
    const id = req.params.productId;
    const updateOps ={};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    ProductModel.update({_id : id}, {$set: updateOps})
    .exec()
    .then(result =>{
         console.log(result);
         
         res.status(200).json(result);
     })
    .catch(err => {
         console.log(err);
         res.status(500).json(err);
     });    
 });

 router.delete('/:productId', checkAuth, (req,res)=>{
    const id = req.params.productId;

    ProductModel.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error :err});
    });
 }); 
 
 module.exports = router;