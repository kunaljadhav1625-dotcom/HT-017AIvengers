const db = require('../src/models/database');

// Wait for DB connection
setTimeout(() => {
    console.log('🇮🇳 Configuring Indian Government Database Simulation (MySQL)...');

    // 1. Clear old data
    db.run('DELETE FROM votes', [], () => { });
    db.run('DELETE FROM candidates', [], () => { });
    db.run('DELETE FROM voters', [], () => { });
    db.run('DELETE FROM locations', [], () => { });

    // Allow deletion to process
    setTimeout(() => {
        // 2. Insert Locations (State -> City -> Village)
        const locations = [
            // Maharashtra
            ['Maharashtra', 'Mumbai', 'Bandra'],
            ['Maharashtra', 'Mumbai', 'Dadar'],
            ['Maharashtra', 'Mumbai', 'Andheri'],
            ['Maharashtra', 'Pune', 'Hinjewadi'],
            ['Maharashtra', 'Pune', 'Kothrud'],
            ['Maharashtra', 'Pune', 'Viman Nagar'],
            ['Maharashtra', 'Nagpur', 'Sitabuldi'],
            ['Maharashtra', 'Nashik', 'Panchavati'],

            // Delhi
            ['Delhi', 'New Delhi', 'Connaught Place'],
            ['Delhi', 'New Delhi', 'Dwarka'],
            ['Delhi', 'New Delhi', 'Karol Bagh'],

            // Karnataka
            ['Karnataka', 'Bangalore', 'Electronic City'],
            ['Karnataka', 'Bangalore', 'Whitefield'],
            ['Karnataka', 'Bangalore', 'Indiranagar'],
            ['Karnataka', 'Mysore', 'Gokulam'],

            // Uttar Pradesh
            ['Uttar Pradesh', 'Lucknow', 'Hazratganj'],
            ['Uttar Pradesh', 'Lucknow', 'Gomti Nagar'],
            ['Uttar Pradesh', 'Varanasi', 'Lanka'],
            ['Uttar Pradesh', 'Varanasi', 'Assi Ghat'],

            // Gujarat
            ['Gujarat', 'Ahmedabad', 'Maninagar'],
            ['Gujarat', 'Ahmedabad', 'Satellite'],
            ['Gujarat', 'Surat', 'Adajan'],

            // Tamil Nadu
            ['Tamil Nadu', 'Chennai', 'T-Nagar'],
            ['Tamil Nadu', 'Chennai', 'Adyar'],
            ['Tamil Nadu', 'Coimbatore', 'Gandhipuram']
        ];

        let locationCount = 0;
        locations.forEach(loc => {
            db.run('INSERT INTO locations (state, city, village) VALUES (?, ?, ?)', loc, (err) => {
                if (err) console.error("Error inserting location:", err);
                locationCount++;
            });
        });

        // 3. Insert Candidates by City
        const candidates = [
            // Maharashtra - Mumbai
            ['Amit Shah (Mock)', 'BJP', 'Maharashtra', 'Mumbai', null, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Amit_Shah.jpg/220px-Amit_Shah.jpg'],
            ['Aditya Thackeray (Mock)', 'Shiv Sena (UBT)', 'Maharashtra', 'Mumbai', null, 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Aditya_Thackeray.jpg'],
            ['Varsha Gaikwad (Mock)', 'INC', 'Maharashtra', 'Mumbai', null, 'https://pbs.twimg.com/profile_images/1539129035544776706/5_5j_7_0_400x400.jpg'],

            // Maharashtra - Pune
            ['Ajit Pawar (Mock)', 'NCP', 'Maharashtra', 'Pune', null, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajit_Pawar.jpg/220px-Ajit_Pawar.jpg'],
            ['Chandrakant Patil (Mock)', 'BJP', 'Maharashtra', 'Pune', null, 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chandrakant_Patil_2019.jpg'],
            ['Supriya Sule (Mock)', 'NCP (SP)', 'Maharashtra', 'Pune', null, 'https://upload.wikimedia.org/wikipedia/commons/2/25/Supriya_Sule.jpg'],

            // Delhi
            ['Arvind Kejriwal (Mock)', 'AAP', 'Delhi', 'New Delhi', null, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Arvind_Kejriwal_2022.jpg/220px-Arvind_Kejriwal_2022.jpg'],
            ['Manoj Tiwari (Mock)', 'BJP', 'Delhi', 'New Delhi', null, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Manoj_Tiwari_1.jpg/220px-Manoj_Tiwari_1.jpg'],
            ['Alka Lamba (Mock)', 'INC', 'Delhi', 'New Delhi', null, 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Alka_Lamba.jpg'],

            // Karnataka - Bangalore
            ['D.K. Shivakumar (Mock)', 'INC', 'Karnataka', 'Bangalore', null, 'https://upload.wikimedia.org/wikipedia/commons/a/a1/DK_Shivakumar.jpg'],
            ['Tejasvi Surya (Mock)', 'BJP', 'Karnataka', 'Bangalore', null, 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Tejasvi_Surya.jpg'],

            // Uttar Pradesh - Lucknow
            ['Yogi Adityanath (Mock)', 'BJP', 'Uttar Pradesh', 'Lucknow', null, 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Yogi_Adityanath.jpg'],
            ['Akhilesh Yadav (Mock)', 'SP', 'Uttar Pradesh', 'Lucknow', null, 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Akhilesh_Yadav.jpg'],

            // Gujarat - Ahmedabad
            ['Bhupendra Patel (Mock)', 'BJP', 'Gujarat', 'Ahmedabad', null, 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Bhupendra_Patel.jpg'],
            ['Isudan Gadhvi (Mock)', 'AAP', 'Gujarat', 'Ahmedabad', null, 'https://upload.wikimedia.org/wikipedia/commons/0/05/Isudan_Gadhvi.jpg'],

            // Tamil Nadu - Chennai
            ['M.K. Stalin (Mock)', 'DMK', 'Tamil Nadu', 'Chennai', null, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/MK_Stalin.jpg'],
            ['Edappadi K. Palaniswami (Mock)', 'AIADMK', 'Tamil Nadu', 'Chennai', null, 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Edappadi_K._Palaniswami.jpg']
        ];

        candidates.forEach(c => {
            db.run('INSERT INTO candidates (name, party, state, city, village, image) VALUES (?, ?, ?, ?, ?, ?)', c, (err) => {
                if (err) console.error("Error inserting candidate:", err);
            });
        });

        // 4. Insert Voters (Citizens)
        const voters = [
            // Maharashtra
            ['MUM-001', 'Rohit Sharma', 'Maharashtra', 'Mumbai', 'Bandra', 'bio_hash_1'],
            ['MUM-002', 'Sachin Tendulkar', 'Maharashtra', 'Mumbai', 'Dadar', 'bio_hash_2'],
            ['MUM-003', 'Ranbir Kapoor', 'Maharashtra', 'Mumbai', 'Andheri', 'bio_hash_3'],

            ['PUN-001', 'Shivaji Rao', 'Maharashtra', 'Pune', 'Hinjewadi', 'bio_hash_4'],
            ['PUN-002', 'Radhika Apte', 'Maharashtra', 'Pune', 'Kothrud', 'bio_hash_5'],
            ['PUN-003', 'Mohan Agashe', 'Maharashtra', 'Pune', 'Viman Nagar', 'bio_hash_6'],

            ['NAS-001', 'Kusumagraj', 'Maharashtra', 'Nashik', 'Panchavati', 'bio_hash_7'],

            // Delhi
            ['DEL-001', 'Virat Kohli', 'Delhi', 'New Delhi', 'Dwarka', 'bio_hash_8'],
            ['DEL-002', 'Gautam Gambhir', 'Delhi', 'New Delhi', 'Karol Bagh', 'bio_hash_9'],
            ['DEL-003', 'Shah Rukh Khan', 'Delhi', 'New Delhi', 'Connaught Place', 'bio_hash_10'],

            // Karnataka
            ['BLR-001', 'Rahul Dravid', 'Karnataka', 'Bangalore', 'Whitefield', 'bio_hash_11'],
            ['BLR-002', 'Anil Kumble', 'Karnataka', 'Bangalore', 'Indiranagar', 'bio_hash_12'],
            ['MYS-001', 'Javagal Srinath', 'Karnataka', 'Mysore', 'Gokulam', 'bio_hash_13'],

            // UP
            ['LKO-001', 'Amitabh Bachchan', 'Uttar Pradesh', 'Lucknow', 'Hazratganj', 'bio_hash_14'],
            ['VAR-001', 'Ustad Bismillah Khan', 'Uttar Pradesh', 'Varanasi', 'Lanka', 'bio_hash_15'],

            // Gujarat
            ['AMD-001', 'Hardik Pandya', 'Gujarat', 'Ahmedabad', 'Maninagar', 'bio_hash_16'],
            ['SUR-001', 'Darshana Jardosh', 'Gujarat', 'Surat', 'Adajan', 'bio_hash_17'],

            // TN
            ['CHN-001', 'Ravichandran Ashwin', 'Tamil Nadu', 'Chennai', 'T-Nagar', 'bio_hash_18'],
            ['CHN-002', 'Kamal Haasan', 'Tamil Nadu', 'Chennai', 'Adyar', 'bio_hash_19']
        ];

        voters.forEach(v => {
            db.run('INSERT INTO voters (voter_id, name, state, city, village, biometric_hash) VALUES (?, ?, ?, ?, ?, ?)', v, (err) => {
                if (err) console.error("Error inserting voter:", err);
            });
        });

        // wait for async inserts
        setTimeout(() => {
            console.log('✅ EXTENSIVE Seed data insertion complete.');
            console.log('-----------------------------------');
            console.log('Recap of inserted data:');
            console.log(` - Locations: ${locations.length} villages/areas loaded`);
            console.log(` - Candidates: ${candidates.length} candidates loaded`);
            console.log(` - Voters: ${voters.length} sample voters loaded`);
            console.log('-----------------------------------');
            console.log('🔐 TRY THESE CREDENTIALS:');
            console.log('   Maharashtra -> Pune -> Hinjewadi : PUN-001');
            console.log('   Maharashtra -> Mumbai -> Bandra  : MUM-001');
            console.log('   Delhi -> New Delhi -> Dwarka     : DEL-001');
            console.log('   UP -> Lucknow -> Hazratganj      : LKO-001');
            console.log('   Gujarat -> Ahmedabad -> Maninagar: AMD-001');
            console.log('   Tamil Nadu -> Chennai -> T-Nagar : CHN-001');
            console.log('-----------------------------------');
            process.exit(0);
        }, 3000);

    }, 2000);

}, 1000);
