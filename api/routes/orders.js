const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OrderModel = require('../models/order');
const ProductModel = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const OrdersController =require('../controllers/orders');


router.get('/',checkAuth, OrdersController.orders_get_all);

router.post('/',checkAuth, OrdersController.orders_create_order);

//can put all in controller 

 router.get('/:orderId',checkAuth, (req,res)=>{
     const id = req.params.orderId;
    OrderModel.findById(id)
    .select('_id productId qty')
    .populate('productId')
     .exec()
     .then(doc =>{
         console.log(doc);
         if(doc){
         res.status(200).json({
             order :doc,
             request:{
                type: 'GET',
                url: `http://localhost:3000/orders/${doc._id}`
            }
         });
         }
         else{
             res.status(404).json({message: "Not found"});
         }
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
     });
 });

 router.patch('/:orderId', checkAuth,(req,res)=>{
    res.status(200).json({
        message: 'Updated order'
    })     
 });

 router.delete('/:orderId',checkAuth, (req,res)=>{
    const id = req.params.orderId;

    OrderModel.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message:"Order deleted",
            request:{
                type:"POST",
                url: `http://localhost:3000/orders`,
                body: {
                    productId: 'ID',
                    qty:'Number'
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error :err});
    });    
 }); 
 
 module.exports = router;