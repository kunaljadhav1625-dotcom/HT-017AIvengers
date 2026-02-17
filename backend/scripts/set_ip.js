const fs = require('fs');
const path = require('path');
const db = require('../src/models/database');

const backendEnvPath = path.join(__dirname, '../.env');
const frontendEnvPath = path.join(__dirname, '../../frontend/.env');

const TARGET_IP = process.argv[2] || '10.211.154.209'; // Default IP if not provided
const PORT = 5000;

console.log(`🌍 Setting up environment for IP: ${TARGET_IP}`);

// 1. Update Backend .env
let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
if (backendEnv.includes('HOST_IP=')) {
    backendEnv = backendEnv.replace(/HOST_IP=.*/, `HOST_IP=${TARGET_IP}`);
} else {
    backendEnv += `\nHOST_IP=${TARGET_IP}`;
}
fs.writeFileSync(backendEnvPath, backendEnv);
console.log('✅ Updated backend/.env');

// 2. Update Frontend .env
const frontendContent = `VITE_API_URL=http://${TARGET_IP}:${PORT}/api`;
fs.writeFileSync(frontendEnvPath, frontendContent);
console.log('✅ Updated frontend/.env');

// 3. Update Database Image URLs
// 3. Update Database Image URLs
console.log('🔄 Updating database image URLs...');

// Wait for DB initialization (race condition fix)
setTimeout(() => {
    // We need to fetch all candidates and update their image URLs to the new IP
    // This is safer than global replace which might miss or mess up if older IP is different
    db.all('SELECT id, image FROM candidates', [], (err, rows) => {
        if (err) {
            console.error("❌ DB Error:", err);
            // Don't exit process here immediately if we want to allow user to proceed without DB
            // But for now it's fine.
            process.exit(1);
        }

        let updates = 0;
        rows.forEach(row => {
            if (row.image && row.image.startsWith('http')) {
                try {
                    const url = new URL(row.image);
                    // If it's a local hosted image (port 5000)
                    if (url.port === '5000') {
                        url.hostname = TARGET_IP;
                        const newUrl = url.toString();

                        if (newUrl !== row.image) {
                            db.run('UPDATE candidates SET image = ? WHERE id = ?', [newUrl, row.id]);
                            updates++;
                        }
                    }
                } catch (e) {
                    // Ignore invalid URLs
                }
            }
        });

        // Allow DB operations to flush
        setTimeout(() => {
            console.log(`✅ Updated ${updates} image URLs in database.`);
            console.log('--------------------------------------------------');
            console.log(`🎉 IP switched to ${TARGET_IP}`);
            console.log('⚠️  PLEASE RESTART YOUR SERVERS (npm start)');
            process.exit(0);
        }, 2000);
    });
}, 3000);
