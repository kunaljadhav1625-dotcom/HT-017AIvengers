const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

console.log('🗑️  Dropping all tables to reset schema...');

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS voters');
    db.run('DROP TABLE IF EXISTS candidates');
    db.run('DROP TABLE IF EXISTS votes');
    db.run('DROP TABLE IF EXISTS admins');
    // Audit log can stay or go
    db.run('DROP TABLE IF EXISTS audit_log');

    console.log('✅ Tables dropped. Please restart the server to recreate them with new schema.');
});
