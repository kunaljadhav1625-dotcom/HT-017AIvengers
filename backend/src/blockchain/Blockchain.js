const Block = require('./Block');
//Final Comment
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Mining difficulty (2 = fast, 4 = moderate, 6 = slow)
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), { type: 'genesis', message: 'Bharat E-Voting Genesis Block' }, '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            data,
            previousBlock.hash
        );
        this.chain.push(newBlock);
        console.log(`✅ Block #${newBlock.index} added to chain`);
        return newBlock;
    }

    getChain() {
        return this.chain;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Recalculate hash to check if block was tampered
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error(`❌ Block #${i} has been tampered!`);
                return false;
            }

            // Check if previous hash matches
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.error(`❌ Block #${i} has invalid previous hash!`);
                return false;
            }

            // Verify Proof of Work
            if (!currentBlock.hash.startsWith('0'.repeat(this.difficulty))) {
                console.error(`❌ Block #${i} doesn't meet difficulty requirement!`);
                return false;
            }
        }

        console.log('✅ Blockchain is valid!');
        return true;
    }

    getTotalBlocks() {
        return this.chain.length;
    }

    // Get blockchain statistics
    getStats() {
        return {
            totalBlocks: this.chain.length,
            totalVotes: this.chain.length - 1, // Exclude genesis
            difficulty: this.difficulty,
            latestBlockHash: this.getLatestBlock().hash,
            genesisTimestamp: this.chain[0].timestamp
        };
    }
}

module.exports = Blockchain;
