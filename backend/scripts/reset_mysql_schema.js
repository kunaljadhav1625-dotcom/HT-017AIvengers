const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'evoting_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
    console.log("Connected to MySQL. Dropping tables...");

    const tables = ['votes', 'voters', 'candidates', 'audit_log', 'locations', 'admins'];

    // Disable foreign key checks to allow dropping in any order
    connection.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
        if (err) console.error(err);

        let droppedCount = 0;
        tables.forEach(table => {
            connection.query(`DROP TABLE IF EXISTS ${table}`, (err) => {
                if (err) console.error(`Error dropping ${table}:`, err);
                else console.log(`Dropped ${table}`);

                droppedCount++;
                if (droppedCount === tables.length) {
                    connection.query('SET FOREIGN_KEY_CHECKS = 1', () => {
                        console.log("All tables dropped. You can now restart the server or run seed script (which should trigger initDB via database.js interaction).");
                        // Actually, seed_india.js just inserts. It assumes tables exist.
                        // But if we run the server, it creates tables.
                        // Or we can just create them here to be safe.
                        // Let's just drop them. The next time `database.js` is loaded (e.g. by seed script), it will recreate them because of `initDB`.
                        process.exit(0);
                    });
                }
            });
        });
    });
});
