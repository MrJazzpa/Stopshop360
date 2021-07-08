const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    email:{
        type : String ,
        required : true,
        //unique : true
    },
    password:{
        type : String,
        required : true

    },
    firstname:{
        type : String,
         required : true
    },
    lastname: {
        type: String,
        required : true
    },
    phone: {
        type: Number,
        required:true
    },

    verification_code:{
        type: String
    }
 })
 
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
