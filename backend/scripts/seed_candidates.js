const db = require('../src/models/database');

const constituencies = [
    { city: "Baramati", state: "Maharashtra" },
    { city: "Nagpur South West", state: "Maharashtra" },
    { city: "Kopri-Pachpakhadi (Thane)", state: "Maharashtra" },
    { city: "Kothrud (Pune)", state: "Maharashtra" },
    { city: "Worli (Mumbai)", state: "Maharashtra" },
    { city: "Parli", state: "Maharashtra" },
    { city: "Varanasi", state: "Uttar Pradesh" }
];

const parties = ["BJP", "INC", "NCP", "SHS", "AAP"];
const names = [
    ["Ajit Pawar", "Supriya Sule", "Sunetra Pawar", "Yugendra Pawar"],
    ["Devendra Fadnavis", "Praful Gudadhe", "Raju Parwe", "Vikas Thakre"],
    ["Eknath Shinde", "Kedar Dighe", "Rajan Vichare", "Naresh Mhaske"],
    ["Chandrakant Patil", "Kishor Shinde", "Deepak Mankar", "Amol Balwadkar"],
    ["Aditya Thackeray", "Milind Deora", "Sachin Ahir", "Sandeep Deshpande"],
    ["Dhananjay Munde", "Pankaja Munde", "Bajrang Sonawane", "Sanjay Daund"],
    ["Narendra Modi", "Ajay Rai", "Athar Jamal Lari", "Gagan Prakash"]
];

console.log("🌱 Seeding Candidates...");

const seed = async () => {
    // Wait for connection
    await new Promise(r => setTimeout(r, 1000));

    let count = 0;

    for (let i = 0; i < constituencies.length; i++) {
        const place = constituencies[i];
        const candidateNames = names[i] || names[0]; // Fallback

        for (let j = 0; j < candidateNames.length; j++) {
            const name = candidateNames[j];
            const party = parties[j % parties.length];
            const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;

            const sql = `INSERT INTO candidates (name, party, state, city, village, image) VALUES (?, ?, ?, ?, ?, ?)`;

            db.run(sql, [name, party, place.state, place.city, '', image], (err) => {
                if (err) console.error("Error inserting:", name, err.message);
                else {
                    process.stdout.write(".");
                }
            });
            count++;
        }
    }

    setTimeout(() => {
        console.log(`\n✅ Added ${count} candidates across ${constituencies.length} constituencies.`);
        process.exit(0);
    }, 2000); // Give time for async inserts
};

seed();
