const express = require('express');
const db = require('../models/database');
const router = express.Router();

// 1. Check Voter Status (New Endpoint for Home Page Logic)
router.get('/status/:voterId', (req, res) => {
    const { voterId } = req.params;
    db.get('SELECT has_voted, name, city, biometric_hash FROM voters WHERE voter_id = ?', [voterId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Voter ID not found in Government Database' });

        res.json({
            exists: true,
            hasVoted: row.has_voted === 1,
            name: row.name,
            city: row.city,
            photoUrl: row.biometric_hash // Stored photo URL
        });
    });
});

// 2. Get candidates (By City or All)
router.get('/candidates', (req, res) => {
    const { city } = req.query;

    if (!city) {
        db.all('SELECT * FROM candidates ORDER BY city, id', [], (err, candidates) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch candidates' });
            res.json(candidates);
        });
        return;
    }

    db.all('SELECT * FROM candidates WHERE city = ? ORDER BY id', [city], (err, candidates) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch candidates' });
        }
        res.json(candidates);
    });
});

// 3. Add Candidate (Admin) - RESTORED
router.post('/candidates', (req, res) => {
    const { name, party, state, city, village, image } = req.body;

    // Minimal validation
    if (!name || !party || !city || !state) {
        return res.status(400).json({ error: 'Name, Party, State, and City are required' });
    }

    db.run(
        'INSERT INTO candidates (name, party, state, city, village, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, party, state, city, village || '', image || ''],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to add candidate' });
            }
            res.json({ message: 'Candidate added successfully', id: this.lastID });
        }
    );
});

// 4. Verify Voter & Biometrics (Simulated)
router.post('/verify-biometric', (req, res) => {
    const { voterId, city } = req.body;

    db.get('SELECT * FROM voters WHERE voter_id = ? AND city = ?', [voterId, city], (err, voter) => {
        if (!voter) {
            return res.status(404).json({ error: 'Voter not found in Government Database for this City' });
        }

        if (voter.has_voted === 1) {
            return res.status(403).json({ error: 'Voter has already cast a vote!' });
        }

        res.json({
            success: true,
            message: "Biometric Verification Successful (Face ID Matched)",
            voterName: voter.name
        });
    });
});

// 5. Cast Vote
router.post('/vote', (req, res) => {
    try {
        const { candidateId, voterId } = req.body;

        if (!candidateId || !voterId) {
            return res.status(400).json({ error: 'Candidate ID and Voter ID required' });
        }

        db.get('SELECT has_voted, name FROM voters WHERE voter_id = ?', [voterId], (err, voter) => {
            if (!voter) return res.status(404).json({ error: 'Voter not found' });
            if (voter.has_voted === 1) return res.status(400).json({ error: 'You have already voted' });

            db.get('SELECT * FROM candidates WHERE id = ?', [candidateId], (err, candidate) => {
                if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

                const voteData = {
                    voterId: voterId,
                    candidateId: candidateId,
                    candidateName: candidate.name,
                    city: candidate.city,
                    timestamp: new Date().toISOString()
                };

                const block = global.blockchain.addBlock(voteData);

                db.run(
                    'INSERT INTO votes (voter_id, candidate_id, block_hash, block_index) VALUES (?, ?, ?, ?)',
                    [voterId, candidateId, block.hash, block.index],
                    function (err) {
                        if (err) return res.status(500).json({ error: 'Failed to record vote' });

                        db.run('UPDATE voters SET has_voted = 1 WHERE voter_id = ?', [voterId]);

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
