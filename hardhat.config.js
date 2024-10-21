require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  paths: {
    artifacts: "./tokenization/fund-token/src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
