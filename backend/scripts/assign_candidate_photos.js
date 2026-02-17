const fs = require('fs');
const path = require('path');
const db = require('../src/models/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
// Use localhost as requested for stability
const BASE_URL = `http://localhost:${PORT}/uploads/candidates`;
const UPLOADS_PATH = path.join(__dirname, '../uploads/candidates');

console.log("🖼️  Auto-Assigning Candidate Photos...\n");

try {
    const files = fs.readdirSync(UPLOADS_PATH);
    console.log(`📂 Found ${files.length} files in ${UPLOADS_PATH}`);

    db.all("SELECT id, name FROM candidates", (err, candidates) => {
        if (err) {
            console.error("❌ DB Error:", err);
            return;
        }

        candidates.forEach(candidate => {
            const dbName = candidate.name.toLowerCase();
            const dbParts = dbName.split(' ').filter(p => p.length > 2); // Split into parts (Devendra, Fadnavis)

            let match = null;

            // Strategy 1: Exact containment (ignoring special chars)
            // e.g. "Devendra Fadnavis" matches "Devendra_Fadnavis.jpg"
            const cleanDbName = dbName.replace(/[^a-z]/g, '');

            for (const file of files) {
                const cleanFileName = file.toLowerCase().replace(/[^a-z]/g, '');
                if (cleanFileName.includes(cleanDbName)) {
                    match = file;
                    break;
                }
            }

            // Strategy 2: All name parts present
            // e.g. "Aditya Thackeray" matches "Shri_Aaditya_Thackeray.jpg"
            if (!match && dbParts.length > 0) {
                for (const file of files) {
                    const lowerFile = file.toLowerCase();
                    const allPartsMatch = dbParts.every(part => lowerFile.includes(part));
                    if (allPartsMatch) {
                        match = file;
                        break;
                    }
                }
            }

            // Strategy 3: First Name Match only (Last Resort, risky but useful for "Narendra Modi" -> "narendra-modi.jpg")
            if (!match && dbParts.length > 0) {
                for (const file of files) {
                    if (file.toLowerCase().includes(dbParts[0])) {
                        // Creating a weak match, but verify specific cases
                        // Only accept if filename is short or looks specific
                        // Keeping it strict for now to avoid wrong matches
                    }
                }
            }

            if (match) {
                // Construct URL (Handle spaces/special chars)
                const finalUrl = `${BASE_URL}/${encodeURIComponent(match)}`;

                db.run("UPDATE candidates SET image = ? WHERE id = ?", [finalUrl, candidate.id], (err) => {
                    if (!err) console.log(`✅ [${candidate.id}] ${candidate.name} \t-> ${match}`);
                });
            } else {
                console.log(`⚠️  [${candidate.id}] ${candidate.name} \t-> NO MATCH FOUND`);
            }
        });
    });

} catch (e) {
    console.error("❌ Error reading directory:", e.message);
}
