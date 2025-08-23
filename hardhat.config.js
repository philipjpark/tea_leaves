require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // BNB Chain Networks
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // Solana Networks (for future cross-chain support)
    solanaDevnet: {
      url: "https://api.devnet.solana.com",
      accounts: process.env.SOLANA_PRIVATE_KEY ? [process.env.SOLANA_PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
  },
  // Tea-leaves specific configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // Tea-leaves platform configuration
  teaLeaves: {
    platform: "Tea-Leaves v1.0",
    gemmaEndpoint: "https://yoree-gemma-827561407333.europe-west1.run.app",
    factorDiscovery: true,
    aiOptimization: true
  }
}; 