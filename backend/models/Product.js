// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number, // Store as decimal, Mongoose handles this
        required: [true, 'Price is required'],
        min: 0
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 0,
        default: 0
    },
    imageUrl: { // Path to the image, or full URL if using cloud storage
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);