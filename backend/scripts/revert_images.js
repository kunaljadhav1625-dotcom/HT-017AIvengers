const db = require('../src/models/database');

// Use localhost to avoid IP usage issues
const PORT = process.env.PORT || 5000;
const PHOTO_URL = `http://localhost:${PORT}/uploads/voters/vikas%20photo%202.jpg`;

console.log("🔄 Reverting Voter Images to Original Master Photo (Vikas)...");

db.serialize(() => {
    db.run(`UPDATE voters SET biometric_hash = ?`, [PHOTO_URL], function (err) {
        if (err) {
            console.error("❌ Error updating voters:", err.message);
        } else {
            console.log(`✅ Success! Updated ${this.changes} voters to:`);
            console.log(`   ${PHOTO_URL}`);
        }
    });

    // Verify first row
    db.get("SELECT name, biometric_hash FROM voters LIMIT 1", (err, row) => {
        if (row) console.log(`   Sample Check: ${row.name} -> ${row.biometric_hash}`);
    });
});
