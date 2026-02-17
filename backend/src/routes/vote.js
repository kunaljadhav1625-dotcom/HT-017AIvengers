const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Get candidates by CITY
router.get('/candidates', (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    db.all('SELECT * FROM candidates WHERE city = ? ORDER BY id', [city], (err, candidates) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch candidates' });
        }
        res.json(candidates);
    });
});

// Verify Voter & Biometrics (Simulated)
router.post('/verify-biometric', (req, res) => {
    const { voterId, city } = req.body;

    // Simulate looking up in Govt Database
    db.get('SELECT * FROM voters WHERE voter_id = ? AND city = ?', [voterId, city], (err, voter) => {
        if (!voter) {
            return res.status(404).json({ error: 'Voter not found in Government Database for this City' });
        }

        if (voter.has_voted === 1) {
            return res.status(403).json({ error: 'Voter has already cast a vote!' });
        }

        // Simulate biometric match success
        res.json({
            success: true,
            message: "Biometric Verification Successful (Face ID Matched)",
            voterName: voter.name
        });
    });
});

// Cast vote (No JWT required, just valid Voter ID simulation)
router.post('/vote', (req, res) => {
    try {
        const { candidateId, voterId } = req.body;

        if (!candidateId || !voterId) {
            return res.status(400).json({ error: 'Candidate ID and Voter ID required' });
        }

        // Double check if user already voted
        db.get('SELECT has_voted, name FROM voters WHERE voter_id = ?', [voterId], (err, voter) => {
            if (!voter) {
                return res.status(404).json({ error: 'Voter not found' });
            }
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
                    voterId: voterId, // Anonymized
                    candidateId: candidateId,
                    candidateName: candidate.name,
                    city: candidate.city,
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
                            ['VOTE', voterId, `Voted for ${candidate.name} in ${candidate.city}`]);

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
