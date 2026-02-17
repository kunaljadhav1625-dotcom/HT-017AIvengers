const db = require('../src/models/database');
require('dotenv').config();

const fileName = 'vikas photo 2.jpg';
const encodedFileName = encodeURIComponent(fileName); // Handle spaces
const ip = process.env.HOST_IP || 'localhost';
const port = process.env.PORT || 5000;
const photoUrl = `http://${ip}:${port}/uploads/voters/${encodedFileName}`;

console.log(`🔄 Assigning Master Photo to ALL voters...`);
console.log(`📸 Image: ${photoUrl}`);

db.run("UPDATE voters SET biometric_hash = ?", [photoUrl], function (err) {
    if (err) {
        console.error("❌ Error updating voters:", err);
        process.exit(1);
    }
    console.log(`✅ Updated ${this.changes || 'all matching'} voters in the database.`);
    console.log("👉 Now any verification attempt will use THIS photo for comparison.");
    process.exit(0);
});
