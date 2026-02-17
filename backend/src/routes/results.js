const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Get election results
router.get('/results', (req, res) => {
    // Get total votes
    db.get('SELECT COUNT(*) as total FROM votes', (err, totalRow) => {
        const totalVotes = totalRow.total;

        // Get votes per candidate
        db.all(`
      SELECT 
        c.id,
        c.name,
        c.party,
        c.image,
        COUNT(v.id) as votes,
        ROUND((COUNT(v.id) * 100.0 / ?), 2) as percentage
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id
      ORDER BY votes DESC
    `, [totalVotes || 1], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch results' });
            }

            res.json({
                totalVotes,
                candidates: results,
                blockchainValid: global.blockchain.isChainValid()
            });
        });
    });
});

// Get voter status
router.get('/voter-status/:voterId', (req, res) => {
    const { voterId } = req.params;

    db.get('SELECT has_voted FROM voters WHERE voter_id = ?', [voterId], (err, voter) => {
        if (!voter) {
            return res.status(404).json({ error: 'Voter not found' });
        }

        res.json({ hasVoted: voter.has_voted === 1 });
    });
});

module.exports = router;
