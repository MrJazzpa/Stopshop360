const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    token: {type: String, required:true},
    userId: {type: String, required:true},
    email:{type: String, required:true}
},{
    timestamps:true,
});

const codesModel = mongoose.model("Codes", codeSchema);
module.exports = codesModel;