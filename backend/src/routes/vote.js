const express = require('express');
const db = require('../models/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); // Added for Python script execution
const Blockchain = require('../blockchain/Blockchain'); // Required for Reset Logic

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/candidates');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
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

// 3. Add Candidate (Admin) - With File Upload
router.post('/candidates', upload.single('image'), (req, res) => {
    const { name, party, state, city, village } = req.body;

    // Construct Image URL
    let imageUrl = '';
    if (req.file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        imageUrl = `${baseUrl}/uploads/candidates/${req.file.filename}`;
    } else if (req.body.image) {
        // Fallback to URL if provided in text field
        imageUrl = req.body.image;
    }

    if (!name || !party || !city || !state) {
        return res.status(400).json({ error: 'Name, Party, State, and City are required' });
    }

    db.run(
        'INSERT INTO candidates (name, party, state, city, village, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, party, state, city, village || '', imageUrl],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to add candidate' });
            }
            res.json({ message: 'Candidate added successfully', id: this.lastID });
        }
    );
});

// 4. Verify Voter & Biometrics (Simulated + Python)
router.post('/verify-biometric', (req, res) => {
    const { voterId, city, image } = req.body;

    console.log(`🔍 Verifying Biometric for ID: ${voterId} in City: ${city}`);

    if (!voterId || !city) {
        return res.status(400).json({ error: 'Voter ID and City are required' });
    }

    db.get('SELECT * FROM voters WHERE voter_id = ?', [voterId], (err, voter) => {
        if (!voter) {
            return res.status(404).json({ error: 'Invalid Voter ID Not Found' });
        }

        if (voter.has_voted === 1) {
            return res.status(403).json({ error: 'Voter has already cast a vote!' });
        }

        // PYTHON FACE VERIFICATION
        if (image && voter.biometric_hash) {
            const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
            const cleanBase64 = base64Data.replace(/^data:image\/.*?;base64,/, "");

            const tempPath = path.join(__dirname, '../../temp', `live_${voterId}_${Date.now()}.jpg`);

            if (!fs.existsSync(path.dirname(tempPath))) fs.mkdirSync(path.dirname(tempPath), { recursive: true });

            try {
                fs.writeFileSync(tempPath, cleanBase64, 'base64');

                const filename = voter.biometric_hash.split('/').pop();
                const storedPath = path.join(__dirname, '../../uploads/voters', decodeURIComponent(filename));
                const scriptPath = path.join(__dirname, '../../scripts/verify_face.py');

                console.log(`🐍 Executing Python: ${scriptPath}`);
                console.log(`   Ref: ${storedPath}`);
                console.log(`   Live: ${tempPath}`);

                exec(`python "${scriptPath}" "${storedPath}" "${tempPath}"`, (err, stdout, stderr) => {
                    fs.unlink(tempPath, () => { }); // Cleanup

                    if (err) {
                        console.error("❌ Python Script Error:", err);
                        // Fallback for demo relying on Node logging? 
                        return res.status(500).json({ error: "Biometric System Error (Python Engine)" });
                    }
                    try {
                        console.log("🐍 Python Output:", stdout.trim());
                        const result = JSON.parse(stdout.trim());

                        if (result.match) {
                            res.json({
                                success: true,
                                message: "Biometric Verified Successfully",
                                voterName: voter.name,
                                score: result.score
                            });
                        } else {
                            res.status(401).json({
                                error: result.error || result.msg || `Face Mismatch! Score: ${result.score?.toFixed(2) || 'N/A'}`
                            });
                        }
                    } catch (e) {
                        console.error("JSON Parse Error:", e, stdout);
                        res.status(500).json({ error: "Verification Processing Error" });
                    }
                });
            } catch (e) {
                console.error("FS Error:", e);
                res.status(500).json({ error: "Image Processing Error" });
            }
        } else {
            // Fallback if no image (Testing only)
            console.warn("⚠️  Bypassing verification (No Image Provided)");
            res.json({ success: true, message: "Dev Bypass: Verified", voterName: voter.name });
        }
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

// 6. Update Candidate
router.put('/candidates/:id', (req, res) => {
    const { id } = req.params;
    const { name, party, state, city, village, image } = req.body;

    db.run(
        'UPDATE candidates SET name = ?, party = ?, state = ?, city = ?, village = ?, image = ? WHERE id = ?',
        [name, party, state, city, village || '', image || '', id],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to update candidate' });
            if (this.changes === 0) return res.status(404).json({ error: 'Candidate not found' });
            res.json({ message: 'Candidate updated successfully' });
        }
    );
});

// 7. Delete Candidate
router.delete('/candidates/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM candidates WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to delete candidate' });
        if (this.changes === 0) return res.status(404).json({ error: 'Candidate not found' });
        res.json({ message: 'Candidate deleted successfully' });
    });
});

// 8. Get Distinct Election Cities
router.get('/results/cities', (req, res) => {
    db.all('SELECT DISTINCT city FROM candidates ORDER BY city', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows.map(r => r.city));
    });
});

// 9. Get Election Results Summary (Aggregated Votes)
router.get('/results/summary', (req, res) => {
    const { city } = req.query;

    let query = `
        SELECT 
            c.id, c.name, c.party, c.city, c.state, c.image,
            COUNT(v.id) as voteCount
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
    `;

    const params = [];
    if (city && city !== 'All') {
        query += ` WHERE c.city = ? `;
        params.push(city);
    }

    query += `
        GROUP BY c.id
        ORDER BY voteCount DESC
    `;

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Calculate total votes
        const totalVotes = rows.reduce((sum, r) => sum + r.voteCount, 0);

        // Add percentage
        const results = rows.map(r => ({
            ...r,
            percentage: totalVotes > 0 ? ((r.voteCount / totalVotes) * 100).toFixed(1) : 0
        }));

        res.json({
            stats: {
                totalVotes,
                leadingCandidate: results.length > 0 ? results[0] : null
            },
            candidates: results
        });
    });
});

// 10. Reset Election (Hackathon Demo Feature)
router.post('/reset', (req, res) => {
    try {
        // 1. Clear Votes
        db.serialize(() => {
            db.run('DELETE FROM votes');
            db.run('DELETE FROM audit_log');
            db.run('UPDATE voters SET has_voted = 0');
        });

        // 2. Reset Blockchain
        if (typeof Blockchain !== 'undefined') {
            global.blockchain = new Blockchain();
        } else {
            // Fallback if Blockchain class not available
            try {
                const BlockchainClass = require('../blockchain/Blockchain');
                global.blockchain = new BlockchainClass();
            } catch (e) {
                console.error("Blockchain reset failed:", e);
            }
        }

        console.log("✅ ELECTION RESET COMPLETE");
        res.json({ message: 'Election System Reset Successfully!' });

    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ error: 'Failed to reset election' });
    }
});

module.exports = router;
