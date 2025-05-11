// backend/controllers/productController.js
const Product = require('../models/Product');
const fs = require('fs'); // File System module for deleting local files
const path = require('path');

// @desc    Add new product
// @route   POST /api/products
// @access  Private/Admin
exports.addProduct = async (req, res) => {
    const { name, description, price, quantity } = req.body;

    if (!name || !price || quantity === undefined) {
        return res.status(400).json({ message: 'Name, price, and quantity are required' });
    }

    try {
        const product = new Product({
            name,
            description,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined // Path to uploaded image
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Add Product Error:', error);
        // If product save fails and an image was uploaded, attempt to delete it
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting uploaded file after failed product save:", err);
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while adding product' });
    }
};

// @desc    List all products
// @route   GET /api/products
// @access  Private/Admin (or Public if frontend needs it for a store view)
exports.listProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('List Products Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private/Admin
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Get Product Error:', error);
         if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    const { name, description, price, quantity } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let oldImageUrl = product.imageUrl; // Keep track of old image to delete it if new one is uploaded

        product.name = name || product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price !== undefined ? parseFloat(price) : product.price;
        product.quantity = quantity !== undefined ? parseInt(quantity, 10) : product.quantity;

        if (req.file) {
            product.imageUrl = `/uploads/${req.file.filename}`;
            // If there was an old image and a new one is uploaded, delete the old one
            if (oldImageUrl && oldImageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', oldImageUrl); // Navigate up from controllers to backend root
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("Error deleting old image:", err);
                    });
                }
            }
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (error) {
        console.error('Update Product Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found (invalid ID format)' });
        }
        // If product update fails and a new image was uploaded, attempt to delete the new image
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting newly uploaded file after failed product update:", err);
            });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const imageUrl = product.imageUrl;
        await product.deleteOne(); // Changed from product.remove() for newer Mongoose versions

        // If the product had a locally stored image, delete it
        if (imageUrl && imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', imageUrl); // Navigate up from controllers to backend root
             if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Error deleting product image:", err);
                    else console.log("Deleted image:", imagePath);
                });
            }
        }

        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error('Delete Product Error:', error);
         if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};