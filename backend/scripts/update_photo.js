const mysql = require('mysql2/promise');
require('dotenv').config();

async function updatePun001() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'evoting_db'
        });

        const photoPath = '/voters/PUN-001.jpg'; // Path relative to public folder
        const voterId = 'PUN-001';

        console.log(`📸 Updating photo for ${voterId}...`);

        await connection.query(
            'UPDATE voters SET biometric_hash = ? WHERE voter_id = ?',
            [photoPath, voterId]
        );

        console.log(`✅ Success! ${voterId} is now linked to ${photoPath}`);
        console.log("👉 Please save your image at: frontend/public/voters/PUN-001.jpg");

        await connection.end();

    } catch (error) {
        console.error("❌ Update Failed:", error);
    }
}
updatePun001();
