const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Blockchain = require('./blockchain/Blockchain');
const db = require('./models/database');

// Routes (Placeholders for now)
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const resultsRoutes = require('./routes/results');
const blockchainRoutes = require('./routes/blockchain');

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
