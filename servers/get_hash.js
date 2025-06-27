const { getHash } = require('./interactions');
const [,, blockchain, wallet] = process.argv;
getHash(blockchain, wallet).then(console.log).catch(err => {
  console.error(err);
  process.exit(1);
});
