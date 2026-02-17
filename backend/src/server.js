const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add path module

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve Static Files (Images) from 'uploads' directory
// Access via: http://localhost:5000/uploads/voters/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const locationRoutes = require('./routes/locations'); // Import location routes

app.use('/api/auth', authRoutes); // Ensure prefix is correct
app.use('/api', voteRoutes);      // Vote routes mounted at /api (e.g., /api/vote, /api/candidates)
app.use('/api/locations', locationRoutes); // Location routes

const Blockchain = require('./blockchain/Blockchain');
global.blockchain = new Blockchain();

// Initialize DB (Ensure tables exist)
require('./models/database');

// Root Route
app.get('/', (req, res) => {
    res.send('Bharat E-Voting API Running...');
});

// Start Server
// Start Server
const HOST_IP = process.env.HOST_IP || 'localhost';

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://${HOST_IP}:${PORT}`);
    console.log(`📂 Serving images at http://${HOST_IP}:${PORT}/uploads`);
    console.log(`⛓️  Blockchain initialized with ${global.blockchain.getTotalBlocks()} blocks`);
});
