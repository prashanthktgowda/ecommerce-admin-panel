// backend/routes/productRoutes.js
const express = require('express');
const {
    addProduct,
    listProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import multer upload middleware
const router = express.Router();

// Apply protect middleware to all product routes that need authentication
router.route('/')
    .post(protect, upload, addProduct) // Use upload middleware for image on add
    .get(protect, listProducts); // Or remove protect if list is public

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, upload, updateProduct) // Use upload middleware for image on update
    .delete(protect, deleteProduct);

module.exports = router;