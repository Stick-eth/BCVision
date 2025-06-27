const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const anchor = require('@project-serum/anchor');
const { Keypair } = require('@solana/web3.js');

const addressesPath = path.join(__dirname, 'addresses.json');
const addresses = JSON.parse(fs.readFileSync(addressesPath));

async function storeHash(blockchain, hash, key) {
  if (blockchain === 'ethereum') {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const wallet = new ethers.Wallet(key, provider);
    const artifact = require('./eth/artifacts/contracts/Diploma.sol/DiplomaRegistry.json');
    const contract = new ethers.Contract(addresses.ethereum.contract, artifact.abi, wallet);
    const tx = await contract.storeHash(hash);
    await tx.wait();
    addresses.ethereum.wallet = wallet.address;
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log('Stored hash on Ethereum for', wallet.address);
  } else if (blockchain === 'solana') {
    const connection = new anchor.web3.Connection('http://127.0.0.1:8899', 'confirmed');
    const secret = JSON.parse(fs.readFileSync(key));
    const wallet = new anchor.Wallet(Keypair.fromSecretKey(new Uint8Array(secret)));
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    anchor.setProvider(provider);
    const idl = JSON.parse(fs.readFileSync(path.join(__dirname, 'solana', 'target', 'idl', 'diploma.json')));
    const programId = new anchor.web3.PublicKey(addresses.solana.program);
    const program = new anchor.Program(idl, programId, provider);
    const diploma = Keypair.generate();
    await program.methods.storeHash(hash).accounts({
      diploma: diploma.publicKey,
      authority: wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([diploma]).rpc();
    addresses.solana.wallet = wallet.publicKey.toBase58();
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log('Stored hash on Solana for', wallet.publicKey.toBase58());
  }
}

async function getHash(blockchain, walletAddr) {
  if (blockchain === 'ethereum') {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const artifact = require('./eth/artifacts/contracts/Diploma.sol/DiplomaRegistry.json');
    const contract = new ethers.Contract(addresses.ethereum.contract, artifact.abi, provider);
    const hash = await contract.getHash(walletAddr);
    return hash;
  } else if (blockchain === 'solana') {
    const connection = new anchor.web3.Connection('http://127.0.0.1:8899', 'confirmed');
    const idl = JSON.parse(fs.readFileSync(path.join(__dirname, 'solana', 'target', 'idl', 'diploma.json')));
    const programId = new anchor.web3.PublicKey(addresses.solana.program);
    const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(Keypair.generate()), {});
    const program = new anchor.Program(idl, programId, provider);
    const diplomaPubkey = new anchor.web3.PublicKey(walletAddr);
    const account = await program.account.diploma.fetch(diplomaPubkey);
    return account.hash;
  }
}

async function verifyDiploma(hash, walletAddr, blockchain) {
  const stored = await getHash(blockchain, walletAddr);
  return stored === hash;
}

module.exports = { storeHash, getHash, verifyDiploma };
