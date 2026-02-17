const mysql = require('mysql2/promise');
require('dotenv').config();

// --- DATASETS ---

const LOCATIONS = [
    { state: "Maharashtra", city: "Pune", village: "Haveli" },
    { state: "Maharashtra", city: "Pune", village: "Kothrud" },
    { state: "Maharashtra", city: "Mumbai", village: "Andheri" },
    { state: "Maharashtra", city: "Mumbai", village: "Dadar" },
    { state: "Karnataka", city: "Bangalore", village: "Whitefield" },
    { state: "Karnataka", city: "Bangalore", village: "Indiranagar" },
    { state: "Tamil Nadu", city: "Chennai", village: "Adyar" },
    { state: "Tamil Nadu", city: "Chennai", village: "T Nagar" },
    { state: "Gujarat", city: "Ahmedabad", village: "Maninagar" },
    { state: "Gujarat", city: "Ahmedabad", village: "Gota" },
    { state: "Uttar Pradesh", city: "Lucknow", village: "Hazratganj" },
    { state: "Telangana", city: "Hyderabad", village: "Banjara Hills" }
];

const CANDIDATES = [
    // Pune
    { name: "Rahul Deshmukh", party: "Nationalist Party", state: "Maharashtra", city: "Pune", image: "https://randomuser.me/api/portraits/men/10.jpg" },
    { name: "Anjali Patil", party: "Progressive Alliance", state: "Maharashtra", city: "Pune", image: "https://randomuser.me/api/portraits/women/12.jpg" },
    { name: "Vikram Joshi", party: "City Development Front", state: "Maharashtra", city: "Pune", image: "https://randomuser.me/api/portraits/men/22.jpg" },
    // Mumbai
    { name: "Suresh Shinde", party: "Shiv Sena (Legacy)", state: "Maharashtra", city: "Mumbai", image: "https://randomuser.me/api/portraits/men/33.jpg" },
    { name: "Priya Mehta", party: "Mumbai Citizens Party", state: "Maharashtra", city: "Mumbai", image: "https://randomuser.me/api/portraits/women/35.jpg" },
    // Bangalore
    { name: "Arjun Reddy", party: "Tech City Party", state: "Karnataka", city: "Bangalore", image: "https://randomuser.me/api/portraits/men/44.jpg" },
    { name: "Deepa Rao", party: "Kannada Rakshana", state: "Karnataka", city: "Bangalore", image: "https://randomuser.me/api/portraits/women/48.jpg" },
    // Chennai
    { name: "Karthik Aryan", party: "Dravida Munnetra", state: "Tamil Nadu", city: "Chennai", image: "https://randomuser.me/api/portraits/men/51.jpg" },
    { name: "Lakshmi Iyer", party: "Tamil Pride", state: "Tamil Nadu", city: "Chennai", image: "https://randomuser.me/api/portraits/women/55.jpg" },
    // Ahmedabad
    { name: "Patel Amit", party: "Gujarat Vikas", state: "Gujarat", city: "Ahmedabad", image: "https://randomuser.me/api/portraits/men/60.jpg" },
    { name: "Sneha Shah", party: "Business Reform", state: "Gujarat", city: "Ahmedabad", image: "https://randomuser.me/api/portraits/women/62.jpg" },
    // Lucknow
    { name: "Yadav Akhilesh", party: "Samajwadi", state: "Uttar Pradesh", city: "Lucknow", image: "https://randomuser.me/api/portraits/men/70.jpg" },
    { name: "Singh Rajnath", party: "Janata Party", state: "Uttar Pradesh", city: "Lucknow", image: "https://randomuser.me/api/portraits/men/72.jpg" },
    // Hyderabad
    { name: "Owaisi Asad", party: "AIMIM", state: "Telangana", city: "Hyderabad", image: "https://randomuser.me/api/portraits/men/80.jpg" },
    { name: "Reddy Revanth", party: "Congress", state: "Telangana", city: "Hyderabad", image: "https://randomuser.me/api/portraits/men/82.jpg" }
];

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

async function seedFullDemo() {
    try {
        console.log("🚀 Starting Full Demo Setup...");

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'evoting_db'
        });

        // 1. CLEAR EXISTING DATA
        console.log("🧹 Clearing old data...");
        await connection.query('DELETE FROM votes');
        await connection.query('DELETE FROM voters');
        await connection.query('DELETE FROM candidates');
        await connection.query('DELETE FROM locations');
        await connection.query('DELETE FROM audit_log');

        // 2. INSERT LOCATIONS
        console.log("📍 Seeding Locations...");
        for (const loc of LOCATIONS) {
            await connection.query(
                'INSERT INTO locations (state, city, village) VALUES (?, ?, ?)',
                [loc.state, loc.city, loc.village]
            );
        }

        // 3. INSERT CANDIDATES
        console.log("👔 Seeding Candidates...");
        for (const cand of CANDIDATES) {
            await connection.query(
                'INSERT INTO candidates (name, party, state, city, village, image) VALUES (?, ?, ?, ?, ?, ?)',
                [cand.name, cand.party, cand.state, cand.city, 'Main Area', cand.image]
            );
        }

        // 4. INSERT VOTERS
        console.log("👥 Seeding Voters...");

        // Group cities to generate counts
        const cityCounts = {};
        for (const loc of LOCATIONS) {
            if (!cityCounts[loc.city]) cityCounts[loc.city] = { code: loc.city.substring(0, 3).toUpperCase(), count: 0, state: loc.state };
        }

        // Generate 10 voters per city
        const voters = [];
        for (const cityName in cityCounts) {
            const cityInfo = cityCounts[cityName];
            console.log(`   -> Genering 10 voters for ${cityName}...`);

            for (let i = 1; i <= 10; i++) {
                const voterId = `${cityInfo.code}-${String(i).padStart(3, '0')}`;
                const name = getRandomName();

                // Photo URL
                const gender = Math.random() > 0.5 ? 'men' : 'women';
                const photoId = Math.floor(Math.random() * 99);
                const photoUrl = `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`;

                // Some have voted (for demo of error)
                const hasVoted = i > 8 ? 1 : 0; // Last 2 voters in each city have already voted

                await connection.query(
                    `INSERT INTO voters (voter_id, name, state, city, village, biometric_hash, has_voted, password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [voterId, name, cityInfo.state, cityName, 'Main Area', photoUrl, hasVoted, 'dummy']
                );
            }
        }

        console.log("✅ DEMO SETUP COMPLETE!");
        console.log("------------------------------------------------");
        console.log("👉 USE THESE CREDENTIALS FOR DEMO:");
        console.log("   Pune      : PUN-001 (Active), PUN-009 (Already Voted)");
        console.log("   Mumbai    : MUM-001");
        console.log("   Bangalore : BAN-001 (Note: Code might be BAN or WHI depending on substring)");
        console.log("   Chennai   : CHE-001");
        console.log("   Ahmedabad : AHM-001");
        console.log("   Lucknow   : LUC-001");
        console.log("   Hyderabad : HYD-001");
        console.log("------------------------------------------------");

        await connection.end();

    } catch (error) {
        console.error("❌ Setup Failed:", error);
    }
}

seedFullDemo();
