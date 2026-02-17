# ⚡ QUICK START GUIDE

## 🚀 **Get Running in 5 Minutes**

### **Prerequisites**
- ✅ Node.js installed
- ✅ MySQL running
- ✅ Git installed

---

## 📋 **Step-by-Step Setup**

### **1. Database Setup (2 minutes)**

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE evoting_db;
exit;
```

### **2. Configure Environment (1 minute)**

Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=evoting_db
PORT=5000
JWT_SECRET=hackathon2026secret
```

### **3. Install & Seed (2 minutes)**

```bash
# Backend
cd backend
npm install
node scripts/seed_full_demo.js

# Frontend (new terminal)
cd frontend
npm install
```

### **4. Run Application**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🎯 **Test the Demo**

### **Open Browser**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### **Try These:**

#### **Voter Flow**
1. Enter Voter ID: `PUN-001`
2. Click "Proceed to Vote"
3. Complete biometric verification
4. Select any candidate
5. Confirm vote
6. See blockchain hash!

#### **Admin Dashboard**
1. Go to `/login`
2. Username: `admin`
3. Password: `admin123`
4. View live results with charts
5. Add/delete candidates

#### **Blockchain Security**
1. Go to `/blockchain`
2. Click "Simulate Attack"
3. Click "Verify Integrity"
4. See tamper detection!

---

## 🐛 **Troubleshooting**

### **Database Connection Error**
```bash
# Check MySQL is running
mysql -u root -p

# Verify .env file exists in backend/
ls backend/.env
```

### **Port Already in Use**
```bash
# Kill existing Node processes
taskkill /F /IM node.exe

# Restart servers
```

### **Module Not Found**
```bash
# Reinstall dependencies
cd backend && npm install
cd frontend && npm install
```

---

## ✅ **You're Ready!**

Your e-voting system is now running with:
- ✅ 70 pre-seeded voters
- ✅ 14 candidates with photos
- ✅ Blockchain with Proof of Work
- ✅ Admin dashboard
- ✅ Real-time results

**Next:** Read `PRESENTATION.md` for demo script!

---

**Happy Hacking! 🏆**
