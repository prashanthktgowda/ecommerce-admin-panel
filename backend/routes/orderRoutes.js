// backend/routes/orderRoutes.js
const express = require('express');
const { listOrders, seedOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply protect middleware to all order routes
router.route('/')
    .get(protect, listOrders)
    .post(protect, seedOrder); // For dev: to pre-fill orders easily via API

router.route('/:id/status')
    .put(protect, updateOrderStatus); // For updating order status

module.exports = router;