const db = require('../src/models/database');
require('dotenv').config();

const HOST_IP = process.env.HOST_IP || 'localhost';
const PORT = process.env.PORT || 5000;

// The photo to set for EVERYONE
const TARGET_PHOTO = 'kunal.jpg';
const PHOTO_URL = `http://localhost:${PORT}/uploads/voters/${TARGET_PHOTO}`;

console.log(`🔄 Updating ALL voters to use photo: ${TARGET_PHOTO}`);

db.serialize(() => {
    // Update all records
    db.run(`UPDATE voters SET biometric_hash = ?`, [PHOTO_URL], function (err) {
        if (err) {
            console.error("❌ Error updating voters:", err.message);
        } else {
            console.log(`✅ Success! Updated ${this.changes} voters.`);
            console.log(`   New Biometric URL: ${PHOTO_URL}`);
        }
    });

    // Check one record to verify
    db.get("SELECT name, biometric_hash FROM voters LIMIT 1", (err, row) => {
        if (row) {
            console.log(`   Sample Verification (${row.name}): ${row.biometric_hash}`);
        }
    });
});

// Allow time for DB operations
setTimeout(() => {
    console.log("\n⚠️  Restart of backend is NOT required for DB changes, but recommended if caching is used.");
}, 2000);
