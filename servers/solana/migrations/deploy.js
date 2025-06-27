const anchor = require('@project-serum/anchor');
const fs = require('fs');
const path = require('path');

module.exports = async function (provider) {
  anchor.setProvider(provider);
  const program = anchor.workspace.Diploma;
  console.log('Solana program deployed to:', program.programId.toBase58());

  const addressesPath = path.join(__dirname, '..', 'addresses.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath));
  addresses.solana.program = program.programId.toBase58();
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
};
