const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    productId :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: "Required"
    },
    qty :{
        type:Number,
        default: 1
    }, 
});

module.exports = mongoose.model("Order", orderSchema);