const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🧪 Testing Face Detection & Matching System...\n");

const testCases = [
    {
        name: "Test 1: Same Photo (Vikas vs Vikas)",
        img1: "uploads/voters/vikas photo 2.jpg",
        img2: "uploads/voters/vikas photo 2.jpg",
        expectedMatch: true
    },
    {
        name: "Test 2: Same Person (Kunal vs Kunal)",
        img1: "uploads/voters/kunal.jpg",
        img2: "uploads/voters/kunal.jpg",
        expectedMatch: true
    }
];

let passed = 0;
let failed = 0;

function runTest(testCase, callback) {
    const scriptPath = path.join(__dirname, 'verify_face.py');
    const img1Path = path.join(__dirname, '..', testCase.img1);
    const img2Path = path.join(__dirname, '..', testCase.img2);

    // Check if files exist
    if (!fs.existsSync(img1Path)) {
        console.log(`❌ ${testCase.name}`);
        console.log(`   Error: Image 1 not found: ${img1Path}\n`);
        failed++;
        callback();
        return;
    }
    if (!fs.existsSync(img2Path)) {
        console.log(`❌ ${testCase.name}`);
        console.log(`   Error: Image 2 not found: ${img2Path}\n`);
        failed++;
        callback();
        return;
    }

    exec(`python "${scriptPath}" "${img1Path}" "${img2Path}"`, (err, stdout, stderr) => {
        if (err) {
            console.log(`❌ ${testCase.name}`);
            console.log(`   Error: ${err.message}`);
            console.log(`   Stderr: ${stderr}\n`);
            failed++;
            callback();
            return;
        }

        try {
            const result = JSON.parse(stdout.trim());
            const actualMatch = result.match;
            const expectedMatch = testCase.expectedMatch;

            if (actualMatch === expectedMatch) {
                console.log(`✅ ${testCase.name}`);
                console.log(`   ${result.msg}`);
                console.log(`   Expected: ${expectedMatch ? 'MATCH' : 'NO MATCH'} | Got: ${actualMatch ? 'MATCH' : 'NO MATCH'}\n`);
                passed++;
            } else {
                console.log(`❌ ${testCase.name}`);
                console.log(`   ${result.msg}`);
                console.log(`   Expected: ${expectedMatch ? 'MATCH' : 'NO MATCH'} | Got: ${actualMatch ? 'MATCH' : 'NO MATCH'}\n`);
                failed++;
            }
        } catch (e) {
            console.log(`❌ ${testCase.name}`);
            console.log(`   JSON Parse Error: ${e.message}`);
            console.log(`   Output: ${stdout}\n`);
            failed++;
        }
        callback();
    });
}

// Run tests sequentially
let index = 0;
function runNext() {
    if (index < testCases.length) {
        runTest(testCases[index], () => {
            index++;
            runNext();
        });
    } else {
        // Summary
        console.log("═══════════════════════════════════════");
        console.log(`📊 TEST SUMMARY`);
        console.log(`   Total: ${testCases.length}`);
        console.log(`   ✅ Passed: ${passed}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log("═══════════════════════════════════════\n");

        if (failed === 0) {
            console.log("🎉 All tests passed! Face detection system is working correctly.");
        } else {
            console.log("⚠️  Some tests failed. Check the errors above.");
        }
        process.exit(failed > 0 ? 1 : 0);
    }
}

runNext();
