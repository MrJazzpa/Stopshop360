const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image_title: {type: String, required:true},
    top_title: {type: String, required:true},
    pricing: {type: Number, default: 0,  required:true},
    description:{type: String, required: true},
    status: {type: Boolean, required:true, default: false},
},{
    timestamps:true,
});

const bannerModel = mongoose.model("Banner", bannerSchema);
module.exports = bannerModel;