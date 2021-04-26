const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    email :{
        type:String,
        required: "Required",
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password :{
        type:String,
        required: "Required"
    },
});

module.exports = mongoose.model("User", userSchema);