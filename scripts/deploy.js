const { ethers } = require("hardhat");

require("@nomicfoundation/hardhat-ethers");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const initialSupply = ethers.parseUnits("1", 18); // 1,000,000 tokens with 18 decimals
  const FundToken = await ethers.getContractFactory("FundToken");
  const token = await FundToken.deploy("1000");
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());
  // const FundToken = await ethers.getContractFactory("FundToken");

  // const initialSupply = ethers.parseUnits("1000", 18); // 1,000,000 tokens with 18 decimals
  // const contract = await FundToken.deploy(initialSupply);
  // console.log("Contract Factory: ", FundToken);
  // console.log("Contract: ", contract);
  // await contract.deployed();
  // console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
