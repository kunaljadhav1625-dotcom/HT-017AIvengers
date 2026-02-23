const db = require('../src/models/database');

const namePattern = '%kunal jadhav%';

console.log(`Searching for candidate matching: ${namePattern}...`);

// First find the candidate(s)
db.all("SELECT id, name FROM candidates WHERE name LIKE ?", [namePattern], (err, rows) => {
    if (err) {
        console.error("❌ Error finding candidate:", err.message);
        return;
    }

    if (rows.length === 0) {
        console.log("⚠️ No candidate found matching that name.");
        return;
    }

    const candidateIds = rows.map(row => row.id);
    console.log(`Found candidate(s): ${rows.map(row => `${row.name} (ID: ${row.id})`).join(', ')}`);

    // Delete votes for these candidates first due to foreign key constraint
    const placeholders = candidateIds.map(() => '?').join(',');

    db.run(`DELETE FROM votes WHERE candidate_id IN (${placeholders})`, candidateIds, function (err) {
        if (err) {
            console.error("❌ Error deleting associated votes:", err.message);
            return;
        }
        console.log(`✅ Deleted ${this.changes} vote(s) associated with these candidate(s).`);

        // Now delete the candidates
        db.run(`DELETE FROM candidates WHERE id IN (${placeholders})`, candidateIds, function (err) {
            if (err) {
                console.error("❌ Error deleting candidate(s):", err.message);
                return;
            }
            console.log(`✅ Successfully deleted ${this.changes} candidate(s).`);
            process.exit(0);
        });
    });
});
