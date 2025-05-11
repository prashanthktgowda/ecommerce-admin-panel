// backend/controllers/orderController.js
const Order = require('../models/Order');

// @desc    List all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.listOrders = async (req, res) => {
    try {
        // Sort by newest first
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('List Orders Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    (Optional) Pre-fill/Create an order manually for testing
// @route   POST /api/orders/seed (Not in PDF, but useful for dev)
// @access  Private/Admin
exports.seedOrder = async (req, res) => {
    const { customerName, totalPrice, status } = req.body;
    if (!customerName || totalPrice === undefined ) {
        return res.status(400).json({ message: 'Customer name and total price are required.' });
    }
    try {
        const newOrder = new Order({
            customerName,
            totalPrice: parseFloat(totalPrice),
            status: status || 'Pending'
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Seed Order Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while seeding order' });
    }
};

// @desc    (Optional) Update order status (Example, not strictly in PDF but logical)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!status || !['Pending', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Valid status (Pending, Completed, Cancelled) is required.' });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update Order Status Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Order not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};