const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    name: {type: String, required: true},
    comment: {type: String, required:true},
    rating:{type:Number, required:true}
},
{
    timestamps: true,
}
);
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: Array, default:[]},
    location: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    title: {type: String, required: true},
    rating: {type: Number},
    phone:{type: String},
    type:{type: String},
    condition:{type: String},
    numReviews: {type: Number, default:0},
    seller: { type: mongoose.Schema.Types.ObjectId,  ref: 'User', required: true},
    reviews: [reviewSchema],
},
{
    timestamps: true,
}
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product;