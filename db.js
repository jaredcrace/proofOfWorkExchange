const Blockchain = require('./models/Blockchain');
const {DB_FILE} = require('./config');
const fs = require('fs');

const db = {
    blockchain: new Blockchain(),
    utxos: [],
  }

// determine if file exists
if(fs.existsSync(DB_FILE)){
  // read data from file
  try {
    var data = fs.readFileSync(DB_FILE, 'utf-8');
    console.log(`loading from: ${DB_FILE}`);
  }
  catch(err) {
    console.log(err);
    throw err;
  }
  var parsedData = JSON.parse(data.toString());
  parsedData.blockchain.blocks.forEach((block) => {
    db.blockchain.addBlock(block);
  }); 
  db.utxos = parsedData.utxos;
  console.log(`blocks: ${db.blockchain.blockHeight()}, utxos: ${db.utxos.length}`)
}

module.exports = db;
