const OrderModel = require('../models/order');
const ProductModel = require('../models/product');
const mongoose = require('mongoose');


exports.orders_get_all =  (req,res)=>{
    OrderModel.find()
    .select('productId qty _id')
    .populate('productId', 'name _id')
    .exec()
    .then(docs => {
        const response ={
            count: docs.length,
            orders: docs.map(doc =>{
                return{
                    _id: doc._id,
                    product: doc.productId,
                    qty: doc.qty,
                    request:{
                        type: 'GET',
                        url: `http://localhost:3000/orders/${doc._id}`
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
}

exports.orders_create_order =  (req,res)=>{
    ProductModel.findById(req.body.productId)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message: "Product Not found"
            })
        }

    const order = new OrderModel({
        productId : req.body.productId,
        qty: req.body.qty,
    });    
    return order.save()
    
    }).then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Order Stored',
            createdProduct: {
                _id: result._id,
                productId: result.productId,
                qty : result.qty,
                request:{
                    type: 'GET',
                    url: `http://localhost:3000/orders/${result._id}`
                }
            }
        })  
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 }