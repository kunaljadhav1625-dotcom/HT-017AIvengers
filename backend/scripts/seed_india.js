const db = require('../src/models/database');

// Wait for DB connection
setTimeout(() => {
    console.log('🇮🇳 Updating Database Schema & Seeding (State/City/Village)...');

    // 1. Clear Data
    db.run('DELETE FROM votes', [], () => { });
    db.run('DELETE FROM candidates', [], () => { });
    db.run('DELETE FROM voters', [], () => { });
    db.run('DELETE FROM locations', [], () => { }); // Clear locations

    setTimeout(() => {
        // 2. Insert Hierarchy Data (States/Cities/Villages)
        const locations = [
            ['Maharashtra', 'Pune', 'Haveli'],
            ['Maharashtra', 'Pune', 'Mulshi'],
            ['Maharashtra', 'Mumbai', 'Andheri'],
            ['Maharashtra', 'Mumbai', 'Bandra'],
            ['Maharashtra', 'Nagpur', 'Ramtek'],
            ['Delhi', 'Delhi', 'Chandni Chowk'],
            ['Karnataka', 'Bangalore', 'Whitefield']
        ];

        locations.forEach(loc => {
            db.run('INSERT INTO locations (state, city, village) VALUES (?, ?, ?)', loc, (err) => {
                if (err) console.error("Loc Insert Error:", err.message);
            });
        });

        // 3. Insert Candidates (With State/City/Village)
        // Note: Village mostly NULL for major candidates, but we can add rural ones
        const candidates = [
            ['Amit Shah (Mock)', 'BJP', 'Maharashtra', 'Mumbai', 'Andheri', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Amit_Shah.jpg/220px-Amit_Shah.jpg'],
            ['Sanjay Raut (Mock)', 'Shiv Sena', 'Maharashtra', 'Mumbai', 'Bandra', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sanjay_Raut.jpg'],
            ['Ajit Pawar (Mock)', 'NCP', 'Maharashtra', 'Pune', 'Haveli', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajit_Pawar.jpg/220px-Ajit_Pawar.jpg'],
            ['Supriya Sule (Mock)', 'NCP', 'Maharashtra', 'Pune', 'Mulshi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Supriya_Sule.jpg/220px-Supriya_Sule.jpg'],
            ['Arvind Kejriwal', 'AAP', 'Delhi', 'Delhi', 'Chandni Chowk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Arvind_Kejriwal_2022.jpg/220px-Arvind_Kejriwal_2022.jpg']
        ];

        candidates.forEach(c => {
            db.run('INSERT INTO candidates (name, party, state, city, village, image) VALUES (?, ?, ?, ?, ?, ?)', c, (err) => {
                if (err) console.error("Cand Insert Error:", err.message);
            });
        });

        // 4. Insert Voters
        const voters = [
            ['MUM-001', 'Rohit Sharma', 'Maharashtra', 'Mumbai', 'Andheri', 'hash1'],
            ['PUN-001', 'Shivaji Rao', 'Maharashtra', 'Pune', 'Haveli', 'hash2'],
            ['DEL-001', 'Virat Kohli', 'Delhi', 'Delhi', 'Chandni Chowk', 'hash3'],
            ['PUN-002', 'Radhika Apte', 'Maharashtra', 'Pune', 'Mulshi', 'hash4']
        ];

        voters.forEach(v => {
            db.run('INSERT INTO voters (voter_id, name, state, city, village, biometric_hash) VALUES (?, ?, ?, ?, ?, ?)', v, (err) => {
                if (err) console.error("Voter Insert Error:", err.message);
            });
        });

        console.log('✅ Hierarchical Data Seeded (MySQL).');
        console.log('🔐 CREDENTIALS:');
        console.log('   Maharashtra -> Pune -> Haveli -> ID: PUN-001');
        setTimeout(() => process.exit(0), 2000);

    }, 2000); // Wait for deletions

}, 1000);
