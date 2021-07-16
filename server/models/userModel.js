const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    email:{type : String, required : true },
    password:{type : String, required : true},
    firstname:{type : String, required : true},
    lastname: { type: String, required : true},
    phone: {type: Number, required:true},
    isConfirmed:{type: Number, default: 0, required:true},
    isAdmin: {type:Boolean, default:false, required:true}
},
{
 timestamps: true,
}
);
 
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
