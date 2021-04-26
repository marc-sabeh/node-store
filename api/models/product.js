const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name :{
        type:String,
        required: "Required"
    },
    price :{
        type:Number,
        required: "Required"
    }, 
    product_image :{
        type:String,
    }, 
});

module.exports = mongoose.model("Product", productSchema);