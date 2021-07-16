const mongoose = require('mongoose');
const subCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
},
{
    timestamps: true,
}
);

const categorySchema = new mongoose.Schema({
    category: {type: String, required: true},
    subCategory: [subCategorySchema],
},
{
    timestamps: true,
}
)

const Category = mongoose.model('Categories', categorySchema)

module.exports = Category;