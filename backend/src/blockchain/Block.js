const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0; // For Proof of Work
    this.hash = this.mineBlock(2); // Difficulty level 2 (fast for demo)
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  // Proof of Work: Mine block until hash starts with required zeros
  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);

    while (this.hash === undefined || !this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`⛏️  Block mined! Hash: ${this.hash} (Nonce: ${this.nonce})`);
    return this.hash;
  }
}

module.exports = Block;
