const db = require('../src/models/database');

console.log("🧠 Smart Fixing & Auditing Database...");

const corrections = [
    { pattern: '%Pune%', target: 'Kothrud (Pune)' },
    { pattern: '%Mumbai%', target: 'Worli (Mumbai)' },
    { pattern: '%Thane%', target: 'Kopri-Pachpakhadi (Thane)' },
    { pattern: '%Nagpur%', target: 'Nagpur South West' }
];

// Helper for delays
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runFix = async () => {
    // 0. Clean Duplicate Candidates (if any)
    console.log("🧹 Checking for duplicate candidates...");
    try {
        // MySQL delete duplicates
        const dedupSql = `
            DELETE t1 FROM candidates t1
            INNER JOIN candidates t2 
            WHERE t1.id > t2.id AND t1.name = t2.name AND t1.city = t2.city
        `;
        db.run(dedupSql, [], (err) => {
            if (err) console.error("Dedup error (might be okay):", err.message);
        });
    } catch (e) { }

    await wait(500);

    // 1. smart Align Voters' Cities
    console.log("🔧 Aligning Voter Cities...");
    corrections.forEach(c => {
        db.run(`UPDATE voters SET city = ? WHERE city LIKE ? AND city != ?`, [c.target, c.pattern, c.target], function (err) {
            if (!err && this.changes > 0) console.log(`   ✅ Fixed ${this.changes} voters to '${c.target}'`);
        });
    });

    await wait(1000);

    // 2. Reset Voting Status (Fresh Demo)
    db.run(`UPDATE voters SET has_voted = 0`, (err) => {
        if (!err) console.log("🔄 Reset 'has_voted' status for all voters.");
    });

    // 3. Sync Locations Table
    console.log("📍 Syncing Locations Table...");
    db.run("DELETE FROM locations", [], () => {
        db.run("INSERT INTO locations (state, city, village) SELECT DISTINCT state, city, village FROM candidates", [], (err) => {
            if (!err) console.log("   ✅ Locations synced with Candidates.");
        });
    });

    await wait(1500);

    // 4. Final Audit Report
    console.log("\n📊 DATABASE AUDIT REPORT:");

    db.all("SELECT city, COUNT(*) as count FROM candidates GROUP BY city", [], (err, rows) => {
        if (err) console.error(err);
        console.log("\n🏛️  CANDIDATES (Must be 4-5 per city):");
        console.table(rows);

        db.all("SELECT city, COUNT(*) as count FROM voters GROUP BY city", [], (err, vrows) => {
            if (err) console.error(err);
            console.log("\n👥 VOTERS (Distribution):");
            console.table(vrows);

            console.log("\n✅ READY FOR DEMO.");
            process.exit(0);
        });
    });
};

runFix();
