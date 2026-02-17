const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
    try {
        const { voterId, name, password } = req.body;

        // Validation
        if (!voterId || !name || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if voter already exists
        db.get('SELECT * FROM voters WHERE voter_id = ?', [voterId], async (err, row) => {
            if (row) {
                return res.status(400).json({ error: 'Voter ID already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert voter
            db.run(
                'INSERT INTO voters (voter_id, name, password) VALUES (?, ?, ?)',
                [voterId, name, hashedPassword],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Registration failed' });
                    }

                    // Log action
                    db.run('INSERT INTO audit_log (action, user_id, details) VALUES (?, ?, ?)',
                        ['REGISTER', voterId, 'New voter registered']);

                    res.status(201).json({
                        message: 'Registration successful',
                        voterId
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const { voterId, password } = req.body;

        if (!voterId || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        db.get('SELECT * FROM voters WHERE voter_id = ?', [voterId], async (err, voter) => {
            if (!voter) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, voter.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign(
                { voterId: voter.voter_id, name: voter.name },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Log action
            db.run('INSERT INTO audit_log (action, user_id, details) VALUES (?, ?, ?)',
                ['LOGIN', voterId, 'Voter logged in']);

            res.json({
                token,
                user: {
                    voterId: voter.voter_id,
                    name: voter.name,
                    hasVoted: voter.has_voted === 1
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
