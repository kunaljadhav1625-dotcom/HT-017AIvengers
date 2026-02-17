const db = require('../src/models/database');
const bcrypt = require('bcryptjs');

async function runSeed() {
    console.log('⏳ Waiting for database connection...');

    // Allow some time for the database connection and table creation to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🌱 Seeding database with Demo Voters...');

    const password = 'password123';
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const voters = [
            { id: 'DEMO-001', name: 'Alice Wonderland' },
            { id: 'DEMO-002', name: 'Bob Builder' },
            { id: 'DEMO-003', name: 'Charlie Chocolate' },
            { id: 'DEMO-004', name: 'David Dreamer' },
            { id: 'DEMO-005', name: 'Eve Explorer' },
        ];

        db.serialize(() => {
            const stmt = db.prepare('INSERT OR IGNORE INTO voters (voter_id, name, password) VALUES (?, ?, ?)');

            voters.forEach(voter => {
                stmt.run(voter.id, voter.name, hashedPassword, function (err) {
                    if (err) {
                        console.error(`❌ Error creating ${voter.name}:`, err.message);
                    } else {
                        if (this.changes > 0) {
                            console.log(`✅ Created voter: ${voter.name} (${voter.id})`);
                        } else {
                            console.log(`ℹ️  Skipped: ${voter.name} (Already exists)`);
                        }
                    }
                });
            });

            stmt.finalize(() => {
                console.log('\n✨ Seeding process finished!');
                console.log('------------------------------------------------');
                console.log('📝 DEMO CREDENTIALS:');
                console.log(`   Password for all: ${password}`);
                console.log('   Voter IDs:');
                voters.forEach(v => console.log(`   - ${v.id} (${v.name})`));
                console.log('------------------------------------------------');
                console.log('⚠️  NOTE: Server restart may be required if new tables were created.');
            });
        });
    } catch (error) {
        console.error('Seed failed:', error);
    }
}

runSeed();
