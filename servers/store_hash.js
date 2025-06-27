const { storeHash } = require('./interactions');
const [,, blockchain, hash, key] = process.argv;
storeHash(blockchain, hash, key).catch(err => {
  console.error(err);
  process.exit(1);
});
