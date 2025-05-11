// backend/routes/authRoutes.js
const express = require('express');
const { loginAdmin, registerAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // Keep for initial admin setup

module.exports = router;