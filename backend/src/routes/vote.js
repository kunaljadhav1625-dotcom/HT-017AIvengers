const express = require('express');
const db = require('../models/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all candidates
router.get('/candidates', (req, res) => {
    db.all('SELECT * FROM candidates ORDER BY id', (err, candidates) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch candidates' });
        }
        res.json(candidates);
    });
});

// Cast vote
router.post('/vote', authMiddleware, (req, res) => {
    try {
        const { candidateId } = req.body;
        const voterId = req.user.voterId;

        if (!candidateId) {
            return res.status(400).json({ error: 'Candidate ID required' });
        }

        // Check if user already voted
        db.get('SELECT has_voted FROM voters WHERE voter_id = ?', [voterId], (err, voter) => {
            if (voter.has_voted === 1) {
                return res.status(400).json({ error: 'You have already voted' });
            }

            // Verify candidate exists
            db.get('SELECT * FROM candidates WHERE id = ?', [candidateId], (err, candidate) => {
                if (!candidate) {
                    return res.status(404).json({ error: 'Candidate not found' });
                }

                // Add vote to blockchain
                const voteData = {
                    voterId: voterId, // In production, this would be hashed for anonymity
                    candidateId: candidateId,
                    candidateName: candidate.name,
                    timestamp: new Date().toISOString()
                };

                const block = global.blockchain.addBlock(voteData);

                // Record vote in database
                db.run(
                    'INSERT INTO votes (voter_id, candidate_id, block_hash, block_index) VALUES (?, ?, ?, ?)',
                    [voterId, candidateId, block.hash, block.index],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to record vote' });
                        }

                        // Mark voter as having voted
                        db.run('UPDATE voters SET has_voted = 1 WHERE voter_id = ?', [voterId]);

                        // Log action
                        db.run('INSERT INTO audit_log (action, user_id, details) VALUES (?, ?, ?)',
                            ['VOTE', voterId, `Voted for candidate ${candidateId}`]);

                        res.json({
                            message: 'Vote recorded successfully',
                            blockHash: block.hash,
                            blockIndex: block.index,
                            candidate: candidate.name
                        });
                    }
                );
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
