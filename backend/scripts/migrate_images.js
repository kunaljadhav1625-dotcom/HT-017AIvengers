const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Ensure directories exist
const uploadDirs = [
    path.join(__dirname, '../uploads/voters'),
    path.join(__dirname, '../uploads/candidates')
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function downloadImage(url, filepath) {
    try {
        const writer = fs.createWriteStream(filepath);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Failed to download ${url}:`, error.message);
    }
}

async function migrateImages() {
    try {
        console.log("🚀 Starting Image Migration to Backend...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'evoting_db'
        });

        const baseUrl = `http://localhost:${process.env.PORT || 5000}/uploads`;

        // 1. MIGRATE VOTERS
        console.log("👥 Migrating Voters...");
        const [voters] = await connection.query('SELECT id, voter_id, biometric_hash FROM voters');

        for (const voter of voters) {
            const oldUrl = voter.biometric_hash;
            const filename = `${voter.voter_id}.jpg`;
            const localPath = path.join(__dirname, `../uploads/voters/${filename}`);
            const newUrl = `${baseUrl}/voters/${filename}`;

            if (oldUrl && oldUrl.startsWith('http') && !oldUrl.includes('localhost')) {
                // External URL (RandomUser) - Download
                await downloadImage(oldUrl, localPath);
                await connection.query('UPDATE voters SET biometric_hash = ? WHERE id = ?', [newUrl, voter.id]);
                console.log(`   -> Downloaded: ${voter.voter_id}`);

            } else if (oldUrl && oldUrl.startsWith('/voters')) {
                // Local Frontend Path (PUN-001) - Copy from Frontend
                const frontendPath = path.join(__dirname, '../../frontend/public', oldUrl);
                if (fs.existsSync(frontendPath)) {
                    fs.copyFileSync(frontendPath, localPath);
                    await connection.query('UPDATE voters SET biometric_hash = ? WHERE id = ?', [newUrl, voter.id]);
                    console.log(`   -> Copied Local: ${voter.voter_id}`);
                } else {
                    console.warn(`   ⚠️ Source file not found: ${frontendPath}`);
                    // Still update DB to point to backend, user can place file later
                    await connection.query('UPDATE voters SET biometric_hash = ? WHERE id = ?', [newUrl, voter.id]);
                }
            }
        }

        // 2. MIGRATE CANDIDATES
        console.log("👔 Migrating Candidates...");
        const [candidates] = await connection.query('SELECT id, image FROM candidates');

        for (const cand of candidates) {
            const oldUrl = cand.image;
            if (oldUrl && oldUrl.startsWith('http') && !oldUrl.includes('localhost')) {
                const filename = `candidate_${cand.id}.jpg`;
                const localPath = path.join(__dirname, `../uploads/candidates/${filename}`);
                const newUrl = `${baseUrl}/candidates/${filename}`;

                await downloadImage(oldUrl, localPath);

                await connection.query('UPDATE candidates SET image = ? WHERE id = ?', [newUrl, cand.id]);
                console.log(`   -> Downloaded Candidate: ${cand.id}`);
            }
        }

        console.log("✅ All Images Migrated Locally!");
        await connection.end();

    } catch (error) {
        console.error("❌ Migration Failed:", error);
    }
}

migrateImages();
