const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Get States
router.get('/states', (req, res) => {
    db.all('SELECT DISTINCT state FROM locations ORDER BY state', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.state));
    });
});

// Get Cities by State
router.get('/cities', (req, res) => {
    const { state } = req.query;
    if (!state) return res.status(400).json({ error: 'State required' });

    db.all('SELECT DISTINCT city FROM locations WHERE state = ? ORDER BY city', [state], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.city));
    });
});

// Get Villages by City
router.get('/villages', (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City required' });

    db.all('SELECT DISTINCT village FROM locations WHERE city = ? ORDER BY village', [city], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.village));
    });
});

module.exports = router;
