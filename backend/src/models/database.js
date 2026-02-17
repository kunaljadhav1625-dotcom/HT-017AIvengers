const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'evoting_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wrapper to mimic SQLite3 API for compatibility
const db = {
  // Execute a query (INSERT, UPDATE, DELETE)
  run: function (sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    pool.query(sql, params, function (err, results) {
      if (err) {
        if (callback) callback(err);
        else console.error(err);
        return;
      }
      // Mimic 'this' context of sqlite3
      if (callback) {
        callback.call({ lastID: results.insertId, changes: results.affectedRows }, null);
      }
    });
  },

  // Get a single row
  get: function (sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    pool.query(sql, params, function (err, results) {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Get all rows
  all: function (sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    pool.query(sql, params, function (err, results) {
      callback(err, results);
    });
  },

  // Serialize (Mock for compatibility, just runs callback immediately)
  serialize: function (callback) {
    callback();
  },

  // Prepare statement (Simple Mock)
  prepare: function (sql) {
    return {
      run: function (...args) {
        // Last arg might be callback?
        const params = args;
        db.run(sql, params);
      },
      finalize: function () { }
    };
  }
};

// Initialize Schemas (MySQL Syntax)
function initDB() {
  const tableConfigs = [
    `CREATE TABLE IF NOT EXISTS voters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            voter_id VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            village VARCHAR(255),
            biometric_hash VARCHAR(255) NOT NULL,
            has_voted INT DEFAULT 0,
            password VARCHAR(255), -- Kept for legacy compatibility if needed
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS candidates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            party VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            village VARCHAR(255),
            image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS votes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            voter_id VARCHAR(255) NOT NULL,
            candidate_id INT NOT NULL,
            block_hash VARCHAR(255) NOT NULL,
            block_index INT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (candidate_id) REFERENCES candidates(id)
        )`,
    `CREATE TABLE IF NOT EXISTS audit_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            action VARCHAR(255) NOT NULL,
            user_id VARCHAR(255),
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS locations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            state VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            village VARCHAR(255) NOT NULL
        )`
  ];

  tableConfigs.forEach(sql => {
    db.run(sql, [], (err) => {
      if (err) console.error("Error creating table:", err.message);
    });
  });
}

// Check connection and init
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    console.error('   Please ensure MySQL is running and .env has correct credentials.');
    console.error('   Create database "evoting_db" if it does not exist.');
  } else {
    console.log('✅ Connected to MySQL Database');
    initDB();
    connection.release();
  }
});

module.exports = db;
