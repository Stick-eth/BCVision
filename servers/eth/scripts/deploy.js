const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const DiplomaRegistry = await hre.ethers.getContractFactory("DiplomaRegistry");
  const diploma = await DiplomaRegistry.deploy();
  await diploma.deployed();
  console.log("Ethereum contract deployed to:", diploma.address);

  const addressesPath = path.join(__dirname, "..", "..", "addresses.json");
  const addresses = JSON.parse(fs.readFileSync(addressesPath));
  addresses.ethereum.contract = diploma.address;
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
