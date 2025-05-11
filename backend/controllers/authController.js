// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (email)' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (password)' });
        }

        if (!user.isAdmin) { // Ensure only admins can login
             return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// OPTIONAL: Register an admin user (only for initial setup, then perhaps disable/protect)
// @desc    Register a new admin (for initial setup)
// @route   POST /api/auth/register
// @access  Public (or protected after first admin creation)
exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // For initial setup, you might want to limit how many admins can be created.
        // const adminCount = await User.countDocuments({ isAdmin: true });
        // if (adminCount >= 1 && process.env.ALLOW_MULTIPLE_ADMINS !== 'true') { // Example check
        //     return res.status(403).json({ message: 'Admin registration is currently disabled.' });
        // }


        const user = new User({
            email,
            password,
            isAdmin: true // Ensure this user is an admin
        });

        await user.save();

        // Optionally, log them in directly by generating a token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token, // Send token if auto-login is desired
            user: { id: user._id, email: user.email, isAdmin: user.isAdmin }
        });

    } catch (error) {
        console.error('Register Error:', error);
        if (error.code === 11000) { // Duplicate key error (email)
            return res.status(400).json({ message: 'Email already in use.' });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};