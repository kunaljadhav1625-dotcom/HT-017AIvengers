const db = require('../src/models/database');

console.time("Sync");
console.log("🔄 Syncing 'locations' table with 'candidates' table...");

// 1. Clear Locations
db.run("DELETE FROM locations", [], (err) => {
    if (err) {
        console.error("❌ Error clearing locations:", err);
        process.exit(1);
    }
    console.log("✅ Old locations removed.");

    // 2. Populate Locations from Candidates
    const sql = `
        INSERT INTO locations (state, city, village)
        SELECT DISTINCT state, city, village FROM candidates
    `;

    db.run(sql, [], function (err) {
        if (err) {
            console.error("❌ Error populating locations:", err);
            process.exit(1);
        }
        console.log(`✅ Synced ${this.changes || 'database'} locations.`);
        console.timeEnd("Sync");
        process.exit(0);
    });
});
