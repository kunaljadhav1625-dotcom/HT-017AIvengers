const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
    // Voters table
    db.run(`
    CREATE TABLE IF NOT EXISTS voters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voter_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      has_voted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Candidates table
    db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      party TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Votes table
    db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voter_id TEXT NOT NULL,
      candidate_id INTEGER NOT NULL,
      block_hash TEXT NOT NULL,
      block_index INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    )
  `);

    // Audit log table
    db.run(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      user_id TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Seed candidates if empty
    db.get('SELECT COUNT(*) as count FROM candidates', (err, row) => {
        if (row && row.count === 0) {
            const candidates = [
                ['Candidate A', 'Party 1', 'https://via.placeholder.com/150'],
                ['Candidate B', 'Party 2', 'https://via.placeholder.com/150'],
                ['Candidate C', 'Party 3', 'https://via.placeholder.com/150'],
            ];

            const stmt = db.prepare('INSERT INTO candidates (name, party, image) VALUES (?, ?, ?)');
            candidates.forEach(candidate => stmt.run(candidate));
            stmt.finalize();
        }
    });
});

module.exports = db;
