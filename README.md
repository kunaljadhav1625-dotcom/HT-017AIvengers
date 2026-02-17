# 🗳️ Bharat E-Voting System - General Election 2026

A **blockchain-powered**, **biometric-verified**, and **tamper-proof** electronic voting system built for India's democratic future.

---

## 🌟 **Key Highlights**

### 🔐 **Security First**
- **Blockchain Technology**: Every vote is an immutable block with SHA-256 cryptographic hashing
- **Biometric Verification**: Simulated face recognition prevents duplicate voting
- **One Vote Per ID**: Strict enforcement with real-time database checks
- **Tamper Detection**: Automatic blockchain integrity verification

### 🚀 **Modern Tech Stack**
- **Frontend**: React 19 + Vite + TailwindCSS + Recharts
- **Backend**: Node.js + Express + MySQL
- **Security**: SHA-256, BCrypt, JWT, Multer (File Uploads)
- **Real-time**: Live vote counting & blockchain updates

### 🎨 **Premium UI/UX**
- Responsive design with glassmorphism effects
- Real-time charts (Bar, Pie, Progress Bars)
- Smooth animations and micro-interactions
- Mobile-first approach

---

## 📸 **Demo Credentials**

### **Voter Login**
Use any of these pre-seeded Voter IDs:

| Voter ID | City | Status |
|----------|------|--------|
| `PUN-001` | Pune | ✅ Active |
| `PUN-002` | Pune | ✅ Active |
| `MUM-001` | Mumbai | ✅ Active |
| `BAN-001` | Bangalore | ✅ Active |
| `CHE-001` | Chennai | ✅ Active |

**Note**: IDs `PUN-009`, `PUN-010` have already voted (for testing "Already Voted" flow).

### **Admin Login**
- **Username**: `admin`
- **Password**: `admin123`

---

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js (v18+)
- MySQL (v8+)
- Git

### **Step 1: Clone Repository**
```bash
git clone https://github.com/kunaljadhav1625/HT-017AIvengers.git
cd HT-017AIvengers
```

### **Step 2: Database Setup**
1. Create MySQL database:
```sql
CREATE DATABASE evoting_db;
```

2. Configure `.env` in `backend/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=evoting_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

3. Seed demo data:
```bash
cd backend
node scripts/seed_full_demo.js
```

### **Step 3: Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### **Step 4: Run Application**
```bash
# Terminal 1 - Backend (Port 5000)
cd backend
npm start

# Terminal 2 - Frontend (Port 5173)
cd frontend
npm run dev
```

### **Step 5: Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🎯 **Features Walkthrough**

### **1. Voter Journey**
1. **Home Page**: Enter Voter ID (e.g., `PUN-001`)
   - Instant validation with inline error messages
   - Checks if ID exists and hasn't voted
2. **Biometric Verification**: Simulated face scan with photo comparison
3. **Voting Page**: Select candidate from your constituency
4. **Confirmation**: Vote recorded on blockchain with hash

### **2. Admin Dashboard**
- **Login**: Use `admin/admin123`
- **Manage Candidates**: Add/Delete candidates with photo upload
- **Live Results**: Real-time vote counts, percentages, and charts
- **Blockchain Explorer**: View all blocks and verify integrity

### **3. Blockchain Security Demo**
1. Go to **Blockchain Page**
2. Click **"Simulate Attack"** to tamper with data
3. Click **"Verify Integrity"** → System detects tampering!

---

## 📡 **API Endpoints**

### **Authentication**
- `POST /api/auth/admin-login` - Admin login

### **Voting Flow**
- `GET /api/status/:voterId` - Check voter status
- `GET /api/candidates?city={city}` - Get candidates by city
- `POST /api/verify-biometric` - Verify voter biometrics
- `POST /api/vote` - Cast vote (creates blockchain block)

### **Admin Operations**
- `POST /api/candidates` - Add candidate (with image upload)
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### **Results & Blockchain**
- `GET /api/results/summary` - Get election results with stats
- `GET /api/blockchain` - View full blockchain
- `GET /api/blockchain/verify` - Verify blockchain integrity
- `POST /api/admin/tamper` - Simulate attack (demo only)

### **Location Data**
- `GET /api/locations/states` - Get all states
- `GET /api/locations/cities?state={state}` - Get cities by state
- `GET /api/locations/villages?city={city}` - Get villages by city

---

## 🏗️ **Project Structure**

```
HT-017AIvengers/
├── backend/
│   ├── src/
│   │   ├── blockchain/        # Blockchain logic (Block, Blockchain)
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes (auth, vote, locations)
│   │   ├── middleware/        # Auth middleware
│   │   └── server.js          # Express server
│   ├── scripts/               # Database seeding scripts
│   ├── uploads/               # Uploaded images (candidates, voters)
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components (AddCandidateForm, BiometricModal)
│   │   ├── pages/             # Pages (Home, Voting, Results, Blockchain, Login)
│   │   ├── services/          # API service layer
│   │   └── App.jsx            # Main app with routing
│   └── index.css              # Global styles
│
└── README.md
```

---

## 🔒 **Security Features**

1. **Blockchain Immutability**
   - Each vote creates a new block
   - SHA-256 hashing links blocks
   - Any tampering breaks the chain

2. **Biometric Verification**
   - Photo comparison (simulated)
   - Prevents impersonation

3. **One Vote Per ID**
   - Database-level enforcement
   - Pre-vote status checks

4. **Case-Insensitive Matching**
   - Robust city/location matching

5. **File Upload Security**
   - Multer with file type validation
   - Server-side image storage

---

## 📊 **Data Seeding**

The system comes with **70 pre-seeded voters** across 7 cities:
- **Pune** (10 voters)
- **Mumbai** (10 voters)
- **Bangalore** (10 voters)
- **Chennai** (10 voters)
- **Ahmedabad** (10 voters)
- **Lucknow** (10 voters)
- **Hyderabad** (10 voters)

And **14 candidates** across multiple parties.

---

## 🎨 **Design Philosophy**

- **Premium Aesthetics**: Vibrant gradients, smooth animations
- **Accessibility**: Clear error messages, loading states
- **Responsive**: Works on mobile, tablet, desktop
- **Indian Context**: Uses Indian Emblem, election terminology

---

## 🚀 **Deployment Ready**

### **Build for Production**
```bash
# Frontend
cd frontend
npm run build

# Backend (already production-ready)
cd backend
npm start
```

### **Environment Variables**
Ensure `.env` is configured for production database.

---

## 🏆 **Hackathon Winning Points**

✅ **Innovation**: Blockchain + Biometric verification  
✅ **Security**: Tamper-proof with live demo  
✅ **UX**: Premium UI with real-time updates  
✅ **Scalability**: MySQL + Modular architecture  
✅ **Completeness**: Full voter journey + admin panel  
✅ **Demo-Ready**: Pre-seeded data, clear credentials  

---

## 👥 **Team AIvengers**

Built with ❤️ for India's digital democracy.

---

## 📝 **License**

MIT License - Feel free to use for educational purposes.

---

## 🐛 **Known Limitations & Future Enhancements**

### **Current Limitations**
- Biometric verification is simulated (not real facial recognition)
- Single-server architecture (not distributed blockchain)
- No email/SMS notifications

### **Future Roadmap**
- [ ] Real facial recognition API integration
- [ ] Distributed blockchain nodes
- [ ] OTP-based voter authentication
- [ ] Multi-language support (Hindi, Marathi, etc.)
- [ ] Mobile app (React Native)
- [ ] Voter turnout analytics
- [ ] Export results to PDF

---

## 📞 **Support**

For issues or questions, please open a GitHub issue or contact the team.

**Happy Voting! 🗳️🇮🇳**