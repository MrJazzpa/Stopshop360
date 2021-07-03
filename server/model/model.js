const mongoose = require('mongoose');
 var schema = new mongoose.Schema({

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
 
 const Stopshop360 = mongoose.model('registration',schema);
 

 module.exports = Stopshop360;
