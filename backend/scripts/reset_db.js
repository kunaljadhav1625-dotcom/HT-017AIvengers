const mysql = require('mysql2/promise');
require('dotenv').config(); // Load .env for DB credentials

async function resetDatabase() {
    try {
        console.log("🧹 Connecting to MySQL to RESET tables...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'evoting_db'
        });

        const tables = ['votes', 'candidates', 'voters', 'locations', 'audit_log'];

        for (const table of tables) {
            console.log(`🔥 Dropping table: ${table}`);
            await connection.query(`DROP TABLE IF EXISTS ${table}`);
        }

        console.log("✅ All tables dropped. Database is clean.");
        await connection.end();
    } catch (error) {
        console.error("❌ Reset Error:", error.message);
    }
}

resetDatabase();
