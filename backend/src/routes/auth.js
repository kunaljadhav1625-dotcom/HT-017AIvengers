const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Admin Login (Hardcoded for Hackathon simplicity or use DB)
router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    // In production: check DB and bcrypt compare
    if (username === 'admin' && password === 'admin123') {
        // Return a mock token or session
        return res.json({
            success: true,
            token: 'admin-secret-token',
            role: 'admin'
        });
    }

    res.status(401).json({ error: 'Invalid Admin Credentials' });
});

module.exports = router;
