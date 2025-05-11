// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // For simplicity, we'll hardcode customer name
    // In a real system, this would link to a Customer model or store more details
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    // products: [{ // In a full system, you'd link products and quantities
    //     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    //     quantity: Number,
    //     priceAtPurchase: Number
    // }],
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'], // Added 'Cancelled' for more flexibility
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);