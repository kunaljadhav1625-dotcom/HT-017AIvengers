const express = require('express');
const db = require('../models/database');
const router = express.Router();

// TAMPER WITH THE BLOCKCHAIN (FOR DEMO PURPOSES ONLY)
router.post('/tamper', (req, res) => {
    try {
        const chain = global.blockchain.getChain();

        // We need at least one block besides genesis to tamper
        if (chain.length < 2) {
            return res.status(400).json({ error: 'Not enough blocks to tamper' });
        }

        // Tamper with the latest block's data
        const lastBlock = chain[chain.length - 1];
        lastBlock.data = { ...lastBlock.data, tampered: true, candidateName: 'HACKED CANDIDATE' };

        // Note: We deliberately do NOT recalculate the hash
        // This will cause the chain validation to fail

        // Log the tampering
        db.run('INSERT INTO audit_log (action, user_id, details) VALUES (?, ?, ?)',
            ['SECURITY_ALERT', 'SYSTEM', 'Blockchain data tampering detected']);

        res.json({ message: 'Blockchain has been tampered with! Verification will now fail.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Blockchain (Optional helper)
router.post('/reset', (req, res) => {
    // In a real app, this would be strictly protected or non-existent
    global.blockchain.chain = [global.blockchain.createGenesisBlock()];
    db.run('DELETE FROM votes');
    db.run('UPDATE voters SET has_voted = 0');
    res.json({ message: 'System reset successful' });
});

module.exports = router;
