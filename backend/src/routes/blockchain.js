const express = require('express');
const router = express.Router();

// Get entire blockchain
router.get('/', (req, res) => {
    res.json({
        chain: global.blockchain.getChain(),
        length: global.blockchain.getTotalBlocks(),
        isValid: global.blockchain.isChainValid()
    });
});

// Verify blockchain integrity
router.get('/verify', (req, res) => {
    const isValid = global.blockchain.isChainValid();

    res.json({
        isValid,
        totalBlocks: global.blockchain.getTotalBlocks(),
        message: isValid ? 'Blockchain is valid' : 'Blockchain has been tampered with!'
    });
});

// Get specific block
router.get('/block/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const chain = global.blockchain.getChain();

    if (index < 0 || index >= chain.length) {
        return res.status(404).json({ error: 'Block not found' });
    }

    res.json(chain[index]);
});

module.exports = router;
