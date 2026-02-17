# 📚 TECHNICAL DOCUMENTATION

## 🏗️ **System Architecture**

### **High-Level Overview**
```
┌─────────────────┐
│   React Frontend│
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express Backend│
│   (Port 5000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ MySQL  │ │Blockchain│
│Database│ │ (Memory) │
└────────┘ └──────────┘
```

---

## 🔐 **Security Architecture**

### **1. Blockchain Layer**
- **Algorithm**: SHA-256 Cryptographic Hashing
- **Proof of Work**: Difficulty level 2 (adjustable)
- **Immutability**: Each block references previous block's hash
- **Validation**: Full chain verification on demand

### **2. Authentication Layer**
- **Admin**: BCrypt password hashing + JWT tokens
- **Voters**: Voter ID validation + Biometric check
- **Session**: Stateless (no cookies, token-based)

### **3. Data Layer**
- **Database**: MySQL with prepared statements (SQL injection prevention)
- **File Upload**: Multer with file type validation
- **Input Validation**: Express-validator middleware

---

## 💾 **Database Schema**

### **voters Table**
```sql
CREATE TABLE voters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voter_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    village VARCHAR(50),
    biometric_hash TEXT,  -- Stores photo URL
    has_voted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **candidates Table**
```sql
CREATE TABLE candidates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    village VARCHAR(50),
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **votes Table**
```sql
CREATE TABLE votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voter_id VARCHAR(20) NOT NULL,
    candidate_id INT NOT NULL,
    block_hash VARCHAR(64) NOT NULL,
    block_index INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);
```

### **locations Table**
```sql
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    village VARCHAR(50)
);
```

### **audit_log Table**
```sql
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR(50),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 **API Documentation**

### **Authentication Endpoints**

#### **POST /api/auth/admin-login**
Admin login endpoint.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

---

### **Voter Endpoints**

#### **GET /api/status/:voterId**
Check voter status before voting.

**Response:**
```json
{
  "exists": true,
  "hasVoted": false,
  "name": "Rajesh Kumar",
  "city": "Pune",
  "photoUrl": "http://localhost:5000/uploads/voters/PUN-001.jpg"
}
```

#### **POST /api/verify-biometric**
Verify voter biometrics.

**Request:**
```json
{
  "voterId": "PUN-001",
  "city": "Pune"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Biometric Verification Successful (Face ID Matched)",
  "voterName": "Rajesh Kumar"
}
```

---

### **Voting Endpoints**

#### **GET /api/candidates?city={city}**
Get candidates by city.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Narendra Modi",
    "party": "BJP",
    "state": "Maharashtra",
    "city": "Pune",
    "image": "http://localhost:5000/uploads/candidates/1234567890.jpg"
  }
]
```

#### **POST /api/vote**
Cast a vote (creates blockchain block).

**Request:**
```json
{
  "candidateId": 1,
  "voterId": "PUN-001"
}
```

**Response:**
```json
{
  "message": "Vote recorded successfully",
  "blockHash": "00a3f5d8e9c1b2a4f6e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0",
  "blockIndex": 5,
  "candidate": "Narendra Modi"
}
```

---

### **Admin Endpoints**

#### **POST /api/candidates**
Add new candidate (with file upload).

**Request (multipart/form-data):**
```
name: "Rahul Gandhi"
party: "Congress"
state: "Maharashtra"
city: "Mumbai"
image: [File]
```

**Response:**
```json
{
  "message": "Candidate added successfully",
  "id": 15
}
```

#### **DELETE /api/candidates/:id**
Delete candidate.

**Response:**
```json
{
  "message": "Candidate deleted successfully"
}
```

---

### **Results Endpoints**

#### **GET /api/results/summary**
Get election results with statistics.

**Response:**
```json
{
  "stats": {
    "totalVotes": 45,
    "leadingCandidate": {
      "id": 1,
      "name": "Narendra Modi",
      "party": "BJP",
      "voteCount": 20,
      "percentage": "44.4"
    }
  },
  "candidates": [
    {
      "id": 1,
      "name": "Narendra Modi",
      "party": "BJP",
      "city": "Pune",
      "voteCount": 20,
      "percentage": "44.4"
    }
  ]
}
```

---

### **Blockchain Endpoints**

#### **GET /api/blockchain**
Get full blockchain.

**Response:**
```json
{
  "chain": [
    {
      "index": 0,
      "timestamp": 1708164000000,
      "data": { "type": "genesis" },
      "previousHash": "0",
      "hash": "00abc123...",
      "nonce": 142
    }
  ]
}
```

#### **GET /api/blockchain/verify**
Verify blockchain integrity.

**Response:**
```json
{
  "isValid": true,
  "message": "Blockchain integrity verified ✓"
}
```

---

## 🧩 **Component Architecture**

### **Frontend Components**

```
src/
├── components/
│   ├── admin/
│   │   └── AddCandidateForm.jsx    # Candidate registration form
│   ├── BiometricModal.jsx          # Face verification modal
│   ├── Toast.jsx                   # Notification component
│   └── LoadingSpinner.jsx          # Loading state
│
├── pages/
│   ├── HomePage.jsx                # Voter ID entry
│   ├── VotingPage.jsx              # Candidate selection
│   ├── ResultsPage.jsx             # Admin dashboard
│   ├── BlockchainPage.jsx          # Blockchain explorer
│   └── LoginPage.jsx               # Admin login
│
├── services/
│   └── api.js                      # Axios API wrapper
│
└── App.jsx                         # Router configuration
```

### **Backend Modules**

```
src/
├── blockchain/
│   ├── Block.js                    # Block class with PoW
│   └── Blockchain.js               # Blockchain class
│
├── models/
│   └── database.js                 # MySQL connection
│
├── routes/
│   ├── auth.js                     # Admin authentication
│   ├── vote.js                     # Voting logic
│   └── locations.js                # Location data
│
├── middleware/
│   └── auth.js                     # JWT verification
│
└── server.js                       # Express app
```

---

## 🔄 **Data Flow**

### **Voting Flow**
```
1. User enters Voter ID
   ↓
2. Frontend calls GET /api/status/:voterId
   ↓
3. Backend checks database
   ↓
4. If valid & not voted → Navigate to Voting Page
   ↓
5. Frontend calls POST /api/verify-biometric
   ↓
6. Backend verifies voter + city match
   ↓
7. User selects candidate
   ↓
8. Frontend calls POST /api/vote
   ↓
9. Backend:
   - Creates blockchain block (with mining)
   - Inserts vote record
   - Updates has_voted flag
   - Logs audit trail
   ↓
10. Returns block hash to frontend
```

---

## ⛏️ **Blockchain Mining Process**

### **Proof of Work Algorithm**
```javascript
// Difficulty = 2 means hash must start with "00"
while (!hash.startsWith('00')) {
    nonce++;
    hash = SHA256(index + previousHash + timestamp + data + nonce);
}
```

### **Example Mining**
```
Block #5 Mining:
- Nonce 0: hash = "a3f5d8e9..." ❌
- Nonce 1: hash = "b2c4f6e8..." ❌
- Nonce 2: hash = "c1d3e5f7..." ❌
...
- Nonce 142: hash = "00a3f5d8..." ✅ (starts with "00")

⛏️ Block mined! Hash: 00a3f5d8... (Nonce: 142)
```

---

## 🎨 **UI/UX Design Patterns**

### **Color Palette**
- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Neutral**: Gray (#6b7280)

### **Typography**
- **Headings**: font-extrabold, tracking-tight
- **Body**: font-medium
- **Monospace**: font-mono (for hashes)

### **Animations**
- **Fade In**: `animate-in fade-in`
- **Slide In**: `slide-in-from-top-4`
- **Pulse**: `animate-pulse`
- **Spin**: `animate-spin`

---

## 🚀 **Performance Optimizations**

### **Frontend**
1. **Code Splitting**: Vite automatically splits routes
2. **Lazy Loading**: Images load on demand
3. **Debouncing**: Search inputs debounced (300ms)
4. **Memoization**: React.memo for heavy components

### **Backend**
1. **Connection Pooling**: MySQL connection pool (max 10)
2. **Caching**: Blockchain cached in memory
3. **Async Operations**: Non-blocking I/O
4. **Prepared Statements**: SQL query optimization

---

## 🐛 **Error Handling**

### **Frontend Error Boundaries**
```javascript
try {
    await api.vote(data);
} catch (error) {
    if (error.response?.status === 403) {
        alert("Already voted!");
    } else if (error.response?.status === 404) {
        alert("Voter not found!");
    } else {
        alert("Network error. Please try again.");
    }
}
```

### **Backend Error Responses**
```javascript
// 400 Bad Request
{ "error": "Voter ID and City are required" }

// 403 Forbidden
{ "error": "Voter has already cast a vote!" }

// 404 Not Found
{ "error": "Voter not found in Government Database for Pune" }

// 500 Internal Server Error
{ "error": "Database error" }
```

---

## 🧪 **Testing Strategy**

### **Manual Testing Checklist**
- [ ] Valid voter can vote
- [ ] Invalid voter ID shows error
- [ ] Already voted voter blocked
- [ ] Blockchain integrity verified
- [ ] Tamper detection works
- [ ] Admin can add/delete candidates
- [ ] Results update in real-time
- [ ] File upload works
- [ ] Mobile responsive

### **Test Cases**
1. **Happy Path**: PUN-001 votes successfully
2. **Already Voted**: PUN-009 blocked
3. **Invalid ID**: INVALID-123 rejected
4. **Blockchain Tamper**: Attack detected
5. **Case Insensitive**: PUNE = Pune

---

## 📦 **Deployment Guide**

### **Production Checklist**
1. **Environment Variables**
   ```env
   NODE_ENV=production
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=strong_random_secret
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Serve Static Files**
   ```javascript
   app.use(express.static('frontend/dist'));
   ```

4. **Database Migration**
   ```bash
   node scripts/seed_full_demo.js
   ```

5. **Start Backend**
   ```bash
   npm start
   ```

---

## 🔮 **Future Enhancements**

### **Phase 2 (Post-Hackathon)**
1. **Real Biometrics**: AWS Rekognition API
2. **OTP Verification**: Twilio SMS integration
3. **Distributed Blockchain**: Multi-node network
4. **Mobile App**: React Native
5. **Analytics Dashboard**: Voter turnout, demographics

### **Phase 3 (Production)**
1. **Load Balancing**: Nginx + PM2
2. **Database Replication**: Master-slave MySQL
3. **CDN**: Cloudflare for static assets
4. **Monitoring**: Prometheus + Grafana
5. **Backup**: Automated daily backups

---

## 📞 **Support & Contribution**

For technical questions or contributions:
- **GitHub**: [Repository Link]
- **Email**: team@aivengers.com
- **Documentation**: This file!

---

**Built with ❤️ by Team AIvengers**
