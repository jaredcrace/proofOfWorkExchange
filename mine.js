const Block = require('./models/Block');
const Blockchain = require('./models/Blockchain');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const db = require('./db');
const fs = require('fs');
const {PUBLIC_KEY} = require('./config');
const {DB_FILE} = require('./config');
const TARGET_DIFFICULTY_EASY = BigInt("0x0" + "F".repeat(63));
const TARGET_DIFFICULTY_HARD = BigInt("0x00000" + "F".repeat(59));
const BLOCK_REWARD = 10;

//let mining = true;
//mine();

function startMining() {
  console.log('startMining now');
  mining = true;
  mine();
}

function stopMining() {
  console.log(`STOP MINING called'`);
  mining = false;

  // save database to the filesystem
  console.log(db);

  const data = JSON.stringify(db);
  fs.writeFile(DB_FILE, data, (err) => {
    if(err){
      console.log('error writing file');
      throw err;
    }
    console.log(`${DB_FILE} saved`);
  })

}

function mine() {
  if(!mining) return;

  const block = new Block();

  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  var targetDifficulty = TARGET_DIFFICULTY_EASY;

  // adjust difficulty after 10 blocks are mined
  if(db.blockchain.blockHeight() > 10){
    targetDifficulty = TARGET_DIFFICULTY_HARD;
  }

  while(BigInt('0x' + block.hash()) >= targetDifficulty) {
    block.nonce++;
  }

  block.execute();

  db.blockchain.addBlock(block);

  console.log(`Mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${block.nonce}`);

  setTimeout(mine, 2500);
}

module.exports = {
  startMining,
  stopMining,
};
