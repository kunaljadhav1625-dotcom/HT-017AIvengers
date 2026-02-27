# Bharat E-Voting Backend Documentation

---

## Project Overview

This backend powers a Bharat E-Voting system, providing APIs for authentication, voting, candidate and voter management, blockchain-based vote integrity, and location hierarchy (state/city/village). It uses Node.js (Express), MySQL, and Python for biometric verification.

---

## Folder Structure

- **src/**
  - **server.js**: Main entry point, sets up Express server, middleware, and routes.
  - **routes/**: API route handlers.
    - **auth.js**: Authentication endpoints (login, register, etc.).
    - **vote.js**: Voting endpoints, candidate listing, biometric verification.
    - **admin.js**: Admin endpoints (blockchain tamper, reset, etc.).
    - **blockchain.js**: Blockchain status and block retrieval.
    - **locations.js**: State, city, village endpoints.
  - **blockchain/**: Blockchain logic.
    - **Block.js**, **Blockchain.js**
  - **models/database.js**: Database connection and helpers.
  - **config/**, **middleware/**: Config and Express middleware (auth, validation).
- **scripts/**: Utility scripts for seeding, migration, and DB management.
- **uploads/**: Static files for candidates and voters (images).
- **temp/**: Temporary files.
- **package.json**: Node dependencies and scripts.
- **.env**: Environment variables.

---

## Setup Instructions

1. **Install dependencies**  
   Run `npm install` in the backend folder.

2. **Configure environment**  
   Edit `.env` for DB credentials, JWT secret, and server port:
   ```
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=root
   DB_NAME=evoting_db
   HOST_IP=your-server-ip
   ```

3. **Database**  
   - MySQL is required.  
   - Use scripts like `setup_mysql.js` or `reset_mysql_schema.js` to initialize schema.
   - Seed data with scripts like `seed_full_demo.js`, `seed_india.js`, or `seed_voters.js`.

4. **Run the server**  
   - Development: `npm run dev`
   - Production: `npm start`
   - Server runs on `http://<HOST_IP>:<PORT>`

5. **Static Files**  
   - Images are served from `/uploads/voters` and `/uploads/candidates`.

---

## API Endpoints

### Auth

- `POST /api/auth/admin-login`  
  Admin login.  
  Request: `{ "username": "admin", "password": "admin123" }`

- `POST /api/auth/register`  
  User registration.

### Voting

- `GET /api/status/:voterId`  
  Get voter status.

- `POST /api/vote`  
  Submit a vote (with biometric verification).

- `GET /api/candidates`  
  List all candidates.

- `GET /api/results`  
  Get voting results.

### Blockchain

- `GET /api/blockchain`  
  Get full blockchain.

- `GET /api/blockchain/verify`  
  Verify blockchain integrity.

- `GET /api/blockchain/block/:index`  
  Get a specific block.

### Locations

- `GET /api/locations/states`  
  List all states.

- `GET /api/locations/cities?state=STATE`  
  List cities in a state.

- `GET /api/locations/villages?city=CITY`  
  List villages in a city.

### Admin

- `POST /api/admin/tamper`  
  Tamper with blockchain (for demo/testing).

- `POST /api/admin/reset`  
  Reset blockchain and votes.

---

## Biometric Verification

- Uses Python script `scripts/verify_face.py` for face comparison.
- Node.js calls this script during voting to verify voter identity using images.

---

## Scripts

- **Seeding & Resetting**:  
  - `seed_full_demo.js`, `seed_india.js`, `seed_large.js`, `seed_voters.js`, `reset_db.js`, `reset_votes.js`
- **Image Management**:  
  - `migrate_images.js`, `assign_candidate_photos.js`, `set_master_photo.js`, `update_photo.js`
- **Environment**:  
  - `set_ip.js` (syncs backend/frontend IPs)

---

## Dependencies

- express, cors, dotenv, multer, mysql2, jsonwebtoken, bcryptjs, express-validator, axios

---

## Usage Notes

- All API responses are JSON.
- JWT is used for authentication.
- Blockchain is in-memory; restart resets it unless persisted.
- For demo, some scripts assign the same photo to all voters or candidates.

---

## Example: Start-to-Finish

1. Install dependencies: `npm install`
2. Set up `.env` and database.
3. Seed demo data: `node scripts/seed_full_demo.js`
4. Start server: `npm run dev`
5. Access API at `http://localhost:5000/api/...`

---

Let me know if you need detailed API specs, code walkthroughs, or anything else!
