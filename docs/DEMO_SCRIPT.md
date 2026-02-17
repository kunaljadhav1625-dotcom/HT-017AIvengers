# 🗳️ E-Voting System (Hackathon Demo Script)

**Goal**: Demonstrate a secure, transparent, and user-friendly voting system powered by blockchain.

## 1. Introduction (1 min)
- **Problem**: Current voting systems lack transparency and trust.
- **Solution**: "SecureVote" - A decentralized voting platform where every vote is an immutable block on the blockchain.
- **Key Features**: verifiable integrity, real-time results, and tamper-proof security.

## 2. User Registration & Login (1 min)
- **Action**: Open incognito window.
- **Navigate**: Go to the **Login Page**.
- **Scenario**: "Let's use one of our pre-registered demo accounts."
- **Login**: 
  - Voter ID: `DEMO-001`
  - Password: `password123`
- **Result**: Successfully logged in as "Alice Wonderland", redirected to Voting Page.

## 3. The Voting Process (1.5 min)
- **Scenario**: "Alice reviews the candidates."
- **Action**: Scroll through candidate cards (Candidate A, B, C).
- **Decision**: "Alice decides to vote for Candidate B."
- **Click**: Candidate B card -> "Submit Vote".
- **Observe**: Success modal appears.
- **Highlight**: "Notice the **Block Hash** and **Block Index**. This proves your vote has been cryptographically secured."

## 4. Blockchain Transparency (1 min)
- **Navigate**: Go to **Blockchain Page**.
- **Action**: Scroll down to see the latest block (Alice's vote).
- **Click**: "Verify Integrity".
- **Result**: Green shield "Blockchain is valid".
- **Explanation**: "The system recalculates all hashes to ensure no data has been altered."

## 5. Attempted Tampering (Authentication of Security) (1 min)
- **Scenario**: "What if a hacker tries to change a vote in the database?"
- **Action**: Click the red **"Simulate Attack"** button.
- **Result**: Alert "Attack simulation successful!".
- **Action**: Click "Verify Integrity" again.
- **Result**: 🔴 **RED ALERT**: "Blockchain has been tampered with!".
- **Explanation**: "Because the data changed, the hash no longer matches. The system immediately flags this corruption, preserving election integrity."

## 6. Real-time Results (30 sec)
- **Navigate**: Go to **Results Page**.
- **Action**: Show differences in vote counts.
- **Highlight**: "Results are aggregated directly from the valid votes."

## 7. Conclusion (30 sec)
- "SecureVote makes elections trustless and verifiable. Thank you!"

## 📝 Demo Credentials
- **Password**: `password123`
- **Users**:
  - `DEMO-001` (Alice)
  - `DEMO-002` (Bob)
  - `DEMO-003` (Charlie)
