# SecureVote - E-Voting System

SecureVote is a blockchain-based electronic voting system built for transparency, security, and ease of use.

## 🚀 Key Features

*   **Blockchain-Backed**: Every vote is a block in an immutable chain.
*   **Tamper-Proof**: Cryptographic hashing ensures data integrity.
*   **Real-Time Results**: Instant tallying of votes.
*   **User-Friendly**: Clean, modern interface built with React & Tailwind.
*   **Secure Auth**: JWT-based authentication for voters.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide React
*   **Backend**: Node.js, Express
*   **Database**: SQLite3
*   **Security**: SHA-256 Hashing, BCrypt, JWT

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/evoting-hackathon.git
    cd evoting-hackathon
    ```

2.  Install dependencies:
    ```bash
    # Backend
    cd backend
    npm install
    
    # Frontend (in a new terminal)
    cd ../frontend
    npm install
    ```

3.  Start the application:
    ```bash
    # Backend (Port 5000)
    cd backend
    npm start

    # Frontend (Port 5173)
    cd frontend
    npm run dev
    ```

## 🧪 API Endpoints

### Auth
*   `POST /api/auth/register` - Register a new voter
*   `POST /api/auth/login` - Login to vote

### Voting
*   `GET /api/candidates` - List candidates
*   `POST /api/vote` - Cast a vote (Requires Token)

### Results & Blockchain
*   `GET /api/results` - Get election results
*   `GET /api/blockchain` - View full blockchain
*   `GET /api/blockchain/verify` - Check integrity

## 🛡️ Security Demo

To demonstrate the system's security:
1.  Go to the **Blockchain** page.
2.  Click **Simulate Attack**.
3.  Click **Verify Integrity**.
4.  The system will detect the tampering and flag the chain as invalid.

## 👥 Contributors

*   Team AIvengers