const db = require('../src/models/database');

// Wait for DB connection
setTimeout(() => {
    console.log('🇮🇳 Configuring Indian Government Database Simulation (MySQL)...');

    // 1. Clear old data
    // Note: In MySQL DELETE without WHERE is unsafe mode sometimes, but usually fine here
    db.run('DELETE FROM votes', [], () => { });
    db.run('DELETE FROM candidates', [], () => { });
    db.run('DELETE FROM voters', [], () => { });

    // Allow deletion to process
    setTimeout(() => {
        // 2. Insert Candidates by City
        const candidates = [
            // Mumbai
            ['Amit Shah (Mock)', 'BJP', 'Mumbai', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Amit_Shah.jpg/220px-Amit_Shah.jpg'],
            ['Sanjay Raut (Mock)', 'Shiv Sena', 'Mumbai', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sanjay_Raut.jpg'],

            // Pune
            ['Ajit Pawar (Mock)', 'NCP', 'Pune', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajit_Pawar.jpg/220px-Ajit_Pawar.jpg'],
            ['Chandrakant Patil (Mock)', 'BJP', 'Pune', 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chandrakant_Patil_2019.jpg'],

            // Delhi
            ['Arvind Kejriwal (Mock)', 'AAP', 'Delhi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Arvind_Kejriwal_2022.jpg/220px-Arvind_Kejriwal_2022.jpg'],
            ['Manoj Tiwari (Mock)', 'BJP', 'Delhi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Manoj_Tiwari_1.jpg/220px-Manoj_Tiwari_1.jpg']
        ];

        candidates.forEach(c => {
            db.run('INSERT INTO candidates (name, party, city, image) VALUES (?, ?, ?, ?)', c, (err) => {
                if (err) console.error("Error inserting candidate:", err);
            });
        });

        // 3. Insert Voters (Citizens)
        const voters = [
            ['MUM-001', 'Rohit Sharma', 'Mumbai', 'bio_hash_1'],
            ['MUM-002', 'Sachin Tendulkar', 'Mumbai', 'bio_hash_2'],
            ['PUN-001', 'Shivaji Rao', 'Pune', 'bio_hash_3'], // User to demo
            ['PUN-002', 'Radhika Apte', 'Pune', 'bio_hash_4'],
            ['DEL-001', 'Virat Kohli', 'Delhi', 'bio_hash_5']
        ];

        voters.forEach(v => {
            db.run('INSERT INTO voters (voter_id, name, city, biometric_hash) VALUES (?, ?, ?, ?)', v, (err) => {
                if (err) console.error("Error inserting voter:", err);
            });
        });

        console.log('✅ Seed data insertion commands sent to MySQL.');
        console.log('-----------------------------------');
        console.log('🔐 USE THESE CREDENTIALS FOR DEMO:');
        console.log('   City: Pune -> Voter ID: PUN-001');
        console.log('   City: Mumbai -> Voter ID: MUM-001');
        console.log('-----------------------------------');

        // Keep process alive briefly for queries to finish
        setTimeout(() => process.exit(0), 2000);

    }, 2000);

}, 1000);
