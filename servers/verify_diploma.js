const { verifyDiploma } = require('./interactions');
const [,, hash, wallet, blockchain] = process.argv;
verifyDiploma(hash, wallet, blockchain).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
