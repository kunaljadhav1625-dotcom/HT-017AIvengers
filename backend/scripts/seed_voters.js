const db = require('../src/models/database');
require('dotenv').config();

const ip = process.env.HOST_IP || 'localhost';
const port = process.env.PORT || 5000;
const masterPhoto = `http://${ip}:${port}/uploads/voters/vikas%20photo%202.jpg`;

const constituencies = [
    { code: "BAR", city: "Baramati", state: "Maharashtra" },
    { code: "NAG", city: "Nagpur South West", state: "Maharashtra" },
    { code: "THA", city: "Kopri-Pachpakhadi (Thane)", state: "Maharashtra" },
    { code: "KOT", city: "Kothrud (Pune)", state: "Maharashtra" },
    { code: "WOR", city: "Worli (Mumbai)", state: "Maharashtra" },
    { code: "PAR", city: "Parli", state: "Maharashtra" },
    { code: "VAR", city: "Varanasi", state: "Uttar Pradesh" }
];

console.log("🌱 Seeding Voters for Demo...");

const seed = async () => {
    await new Promise(r => setTimeout(r, 1000)); // Wait for DB

    let count = 0;

    for (const c of constituencies) {
        // Create 5 voters per constituency
        for (let i = 1; i <= 5; i++) {
            const voterId = `${c.code}-00${i}`; // e.g., BAR-001
            const name = `Voter ${c.code} ${i}`;

            // Insert
            const sql = `INSERT INTO voters (voter_id, name, state, city, biometric_hash, has_voted) VALUES (?, ?, ?, ?, ?, 0)`;

            // Use callback to handle async
            db.run(sql, [voterId, name, c.state, c.city, masterPhoto], (err) => {
                if (err) {
                    // Ignore duplicates
                    if (!err.message.includes('UNIQUE')) console.error("Error:", err.message);
                } else {
                    process.stdout.write("+");
                }
            });
            count++;
        }
    }

    setTimeout(() => {
        console.log(`\n✅ Seeded ~${count} new voters.`);
        console.log("👉 Example: BAR-001, NAG-001, WOR-001");
        console.log("👉 All set with Master Photo (Vikas).");
        process.exit(0);
    }, 2000);
};

seed();
