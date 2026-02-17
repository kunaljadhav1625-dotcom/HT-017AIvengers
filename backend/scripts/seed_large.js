const mysql = require('mysql2/promise');
require('dotenv').config();

const indianNames = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Aryan", "Ishaan", "Vivaan",
    "Aadya", "Diya", "Saanvi", "Ananya", "Kiara", "Pari", "Riya", "Anvi", "Aadhya", "Myra",
    "Rohan", "Rahul", "Amit", "Suresh", "Ramesh", "Priya", "Sneha", "Pooja", "Neha", "Kavita",
    "Vikram", "Sanjay", "Manoj", "Raj", "Karan", "Simran", "Anjali", "Sunita", "Anita", "Meena",
    "Kabir", "Zara", "Ayaan", "Fatima", "Ibrahim", "Zoya", "Ali", "Sana", "Omar", "Ayesha"
];

const surnames = [
    "Patil", "Deshmukh", "Kulkarni", "Joshi", "Shinde", "Pawar", "Kale", "More", "Chavan", "Jadhav",
    "Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Yadav", "Kumar", "Das", "Rao", "Reddy",
    "Nair", "Menon", "Khan", "Shaikh", "Pathan", "Siddiqui", "Fernandes", "Dsouza", "Modi", "Shah"
];

function getRandomName() {
    const first = indianNames[Math.floor(Math.random() * indianNames.length)];
    const last = surnames[Math.floor(Math.random() * surnames.length)];
    return `${first} ${last}`;
}

async function seedVoters() {
    try {
        console.log("🌱 Generating 50+ Realistic Voters...");

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'evoting_db'
        });

        // Clear existing voters to avoid duplicates or messy ID conflicts
        console.log("🧹 Clearing existing voters...");
        await connection.query('DELETE FROM voters');

        const cities = [
            { name: "Pune", state: "Maharashtra", code: "PUN", count: 20 },
            { name: "Mumbai", state: "Maharashtra", code: "MUM", count: 15 },
            { name: "Delhi", state: "Delhi", code: "DEL", count: 10 },
            { name: "Bangalore", state: "Karnataka", code: "BLR", count: 10 }
        ];

        let totalInserted = 0;

        for (const city of cities) {
            console.log(`📍 Generating voters for ${city.name}...`);
            const queries = [];

            for (let i = 1; i <= city.count; i++) {
                const voterId = `${city.code}-${String(i).padStart(3, '0')}`;
                const name = getRandomName();
                const biometricHash = `hash_${Math.random().toString(36).substring(7)}`;

                // Add Photo URL (Random User API)
                const gender = Math.random() > 0.5 ? 'men' : 'women';
                const photoId = Math.floor(Math.random() * 99);
                const photoUrl = `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`;

                // 80% have NOT voted, 20% HAVE voted (to show error message if tried)
                const hasVoted = Math.random() < 0.2 ? 1 : 0;

                // ! Ensure 'biometric_hash' column exists in schema or reuse it for photo if strict
                // But let's assume we can add a column or just use 'image' if exists?
                // The schema in database.js (Step 420) shows: biometric_hash VARCHAR.
                // It does NOT have photo_url. I need to ALTER table or reuse a column.
                // Let's ALTER table in this script implicitly or explicitly.
                // Actually, I should update database.js schema definition too if I want it permanent.
                // But for now, I'll store it in 'biometric_hash' column? No, that's confusing.
                // I will Add 'photo_url' column dynamically here if missing.

                const query = connection.query(
                    `INSERT INTO voters (voter_id, name, state, city, village, biometric_hash, has_voted, password)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [voterId, name, city.state, city.name, 'Main Area', photoUrl, hasVoted, 'dummy']
                );
                // I am storing photoUrl in 'biometric_hash' column for simplicity as I can't easily change schema
                // without dropping tables again. Wait, I AM clearing tables.
                // But the table *structure* is defined in database.js initDB.
                // I will use `biometric_hash` to store the URL. It's a hack but works.
                queries.push(query);
            }

            await Promise.all(queries);
            totalInserted += city.count;
        }

        console.log(`✅ Successfully added ${totalInserted} dummy voters!`);
        console.log("------------------------------------------------");
        console.log("SAMPLE CREDENTIALS:");
        console.log("Pune: PUN-001 to PUN-020");
        console.log("Mumbai: MUM-001 to MUM-015");
        console.log("Delhi: DEL-001 to DEL-010");
        console.log("Bangalore: BLR-001 to BLR-010");
        console.log("------------------------------------------------");

        await connection.end();

    } catch (error) {
        console.error("❌ Seeding Failed:", error);
    }
}

seedVoters();
