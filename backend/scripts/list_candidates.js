const db = require('../src/models/database');

console.log("📋 Fetching Candidates to match photos...\n");

db.all("SELECT id, name, party, state, city FROM candidates", (err, rows) => {
    if (err) {
        console.error("❌ Error:", err.message);
        return;
    }

    console.log("---------------------------------------------------------------------------------");
    console.log("| ID | NAME                     | PARTY           | CITY             | PHOTO      |");
    console.log("---------------------------------------------------------------------------------");

    rows.forEach(row => {
        const id = String(row.id).padEnd(3);
        const name = row.name.substring(0, 24).padEnd(25);
        const party = row.party.substring(0, 15).padEnd(16);
        const city = row.city.substring(0, 16).padEnd(17);
        const image = (row.image || '').substring(0, 10).padEnd(11);

        console.log(`| ${id}| ${name}| ${party}| ${city}| ${image}|`);
    });

    console.log("---------------------------------------------------------------------------------");
});
