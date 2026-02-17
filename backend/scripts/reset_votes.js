const db = require('../src/models/database');

console.log("🔄 Resetting Election Votes for New Demo...");

db.serialize(() => {
    // 1. Clear Votes
    db.run("DELETE FROM votes", (err) => {
        if (err) console.error("❌ Error clearing votes:", err.message);
        else console.log("✅ Votes table cleared.");
    });

    // 2. Reset Voter Status
    db.run("UPDATE voters SET has_voted = 0", (err) => {
        if (err) console.error("❌ Error resetting voters:", err.message);
        else console.log("✅ All voters marked as 'Not Voted' (has_voted = 0).");
    });

    // 3. Clear Audit Logs
    db.run("DELETE FROM audit_log", (err) => {
        if (err) console.error("❌ Error clearing audit log:", err.message);
        else console.log("✅ Audit logs cleared.");
    });
});

// Allow async operations to complete
setTimeout(() => {
    console.log("\n⚠️  IMPORTANT: Please RESTART the Backend Server to reset the in-memory Blockchain!");
    process.exit(0);
}, 1000);
