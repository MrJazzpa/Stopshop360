const mongoose = require('mongoose');

const sideAdvertSchema = new mongoose.Schema({
    side_title: {type: String, required:true},
    topside_title: {type: String, required:true},
    path:{type: String, required:true},
    pricing: {type: Number, default: 0,  required:true},
    description:{type: String, required: true},
    category: {type: String, required: true},
    status: {type: Boolean, required:true, default: false},
},{
    timestamps:true,
});

const SideAdvertModel = mongoose.model("SideAdvert", sideAdvertSchema);
module.exports = SideAdvertModel;