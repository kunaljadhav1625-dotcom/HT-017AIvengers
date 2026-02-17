const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const Blockchain = require('./blockchain/Blockchain');
const db = require('./models/database'); // This initializes tables

// Routes
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const resultsRoutes = require('./routes/results');
const blockchainRoutes = require('./routes/blockchain');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/locations'); // NEW

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize blockchain
global.blockchain = new Blockchain();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', voteRoutes);
app.use('/api', resultsRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes); // NEW

// Serve static files (optional, for images if needed locally)
// app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        blockchain: {
            blocks: global.blockchain.getTotalBlocks(),
            isValid: global.blockchain.isChainValid()
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⛓️  Blockchain initialized with ${global.blockchain.getTotalBlocks()} blocks`);
});
