const db = require('../src/models/database');

console.log("Starting clean up...");

// 1. Clear Votes first (Foreign Key Constraint)
db.run('DELETE FROM votes', [], (err) => {
    if (err) {
        console.error("❌ Error clearing votes:", err);
        process.exit(1);
    }
    console.log("✅ Votes cleared.");

    // 2. Clear Audit Log
    db.run('DELETE FROM audit_log', [], (err) => {
        if (err) console.error("⚠️ Audit log error:", err);

        // 3. Clear Candidates
        db.run('DELETE FROM candidates', [], (err) => {
            if (err) {
                console.error("❌ Error clearing candidates:", err);
                process.exit(1);
            }
            console.log("✅ Candidates cleared.");

            // 4. Reset Voters
            db.run('UPDATE voters SET has_voted = 0', [], (err) => {
                if (err) console.error("⚠️ Voter reset error:", err);
                else console.log("✅ Voters reset.");

                console.log("🎉 System ready for fresh candidates.");
                process.exit(0);
            });
        });
    });
});
