const db = require('../src/models/database');
require('dotenv').config();

const ip = process.env.HOST_IP || 'localhost';
const port = process.env.PORT || 5000;

const kunalUrl = `http://${ip}:${port}/uploads/voters/kunal.jpg`;

console.log("🔄 Assigning 'kunal.jpg' to 50% of voters...");
console.log(`📸 Image: ${kunalUrl}`);

db.run("UPDATE voters SET biometric_hash = ? ORDER BY id ASC LIMIT 35", [kunalUrl], function (err) {
    if (err) {
        console.error("❌ Error updating voters:", err);
        process.exit(1);
    }
    console.log(`✅ Updated ${this.changes || '35'} voters to use Kunal's photo.`);

    // List some examples
    db.all("SELECT voter_id, biometric_hash FROM voters LIMIT 5", [], (err, rows) => {
        if (err) console.error(err);
        console.log("\nSample Assignments:");
        rows.forEach(r => {
            const name = r.biometric_hash.includes('kunal') ? 'KUNAL' : 'VIKAS';
            console.log(`🆔 ID: ${r.voter_id} -> ${name}`);
        });
        process.exit(0);
    });
});
