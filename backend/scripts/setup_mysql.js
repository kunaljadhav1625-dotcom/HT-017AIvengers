const mysql = require('mysql2/promise');

async function setup() {
    try {
        console.log("🔌 Connecting to MySQL...");
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root'
        });

        console.log("🛠️ Creating Database 'evoting_db' if not exists...");
        await connection.query(`CREATE DATABASE IF NOT EXISTS evoting_db`);
        console.log("✅ Database ready.");

        await connection.end();
    } catch (error) {
        console.error("❌ Stats: Failed to setup MySQL DB");
        console.error(error.message);
    }
}

setup();
