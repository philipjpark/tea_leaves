import { ethers } from 'ethers';

// BSC Testnet configuration
const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const BSC_MAINNET_RPC = 'https://bsc-dataseed.binance.org/';

// Contract addresses (update these after deployment)
const ASSET_TOKENIZATION_ADDRESS = {
  testnet: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  mainnet: '0x0000000000000000000000000000000000000000'  // Replace with deployed address
};

const BARTERING_ENGINE_ADDRESS = {
  testnet: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  mainnet: '0x0000000000000000000000000000000000000000'  // Replace with deployed address
};

const LIQUIDITY_POOL_ADDRESS = {
  testnet: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  mainnet: '0x0000000000000000000000000000000000000000'  // Replace with deployed address
};

// PayPal USD token addresses on BSC
const PAYPAL_USD_ADDRESS = {
  testnet: '0x0000000000000000000000000000000000000000', // Replace with real address
  mainnet: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8'  // Real PayPal USD on BSC mainnet
};

// BNB Chain tokens - Focus on Asset Tokenization
export const BNB_TOKENS = [
  {
    symbol: 'BNB',
    name: 'BNB',
    address: '0x0000000000000000000000000000000000000000', // Native BNB
    decimals: 18,
    description: 'BNB Chain native token with high throughput and low fees',
    price: 320.45,
    change24h: 2.3,
    marketCap: '48.2B'
  },
  {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    address: PAYPAL_USD_ADDRESS.mainnet,
    decimals: 6,
    description: 'PayPal\'s stablecoin for digital payments - Asset Backing',
    price: 1.00,
    change24h: 0.0,
    marketCap: '1.2B',
    isPlatformFocus: true
  },
  {
    symbol: 'tBNB',
    name: 'Test BNB',
    address: '0x0000000000000000000000000000000000000000', // Native tBNB on testnet
    decimals: 18,
    description: 'BNB Chain testnet token for development and testing',
    price: 320.45,
    change24h: 2.3,
    marketCap: 'Testnet'
  }
];

class BNBService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private assetTokenizationContract: ethers.Contract | null = null;
  private barteringEngineContract: ethers.Contract | null = null;
  private liquidityPoolContract: ethers.Contract | null = null;
  private network: 'testnet' | 'mainnet' = 'testnet';

  constructor() {
    // Provider will be initialized when needed
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
    }
  }

  private async ensureProviderInitialized() {
    if (!this.provider) {
      await this.initializeProvider();
    }
  }

  async connectWallet(): Promise<string> {
    await this.ensureProviderInitialized();

    if (!this.provider) {
      throw new Error('MetaMask not detected');
    }

    try {
      // Request account access
      await this.provider.send('eth_requestAccounts', []);
      const address = await this.signer!.getAddress();
      
      // Get network
      const network = await this.provider.getNetwork();
      this.network = network.chainId === 97n ? 'testnet' : 'mainnet';
      
      // Initialize contracts
      if (!this.signer) throw new Error('Signer not initialized');
      
      // Asset Tokenization Contract
      this.assetTokenizationContract = new ethers.Contract(
        ASSET_TOKENIZATION_ADDRESS[this.network],
        ['function requestTokenization(string,string,uint8,string,uint256,uint256) external payable'],
        this.signer!
      );

      // Bartering Engine Contract
      this.barteringEngineContract = new ethers.Contract(
        BARTERING_ENGINE_ADDRESS[this.network],
        ['function createBarterOffer(address,uint256,address,uint256,uint256,uint8,string) external payable'],
        this.signer!
      );

      // Liquidity Pool Contract
      this.liquidityPoolContract = new ethers.Contract(
        LIQUIDITY_POOL_ADDRESS[this.network],
        ['function createPool(string,address,address,uint256,uint256,uint256) external payable'],
        this.signer!
      );

      console.log('🔗 Connected to BNB Chain:', address);
      return address;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw error;
    }
  }

  async checkNetwork(): Promise<boolean> {
    await this.ensureProviderInitialized();
    if (!this.provider) return false;

    try {
      const network = await this.provider.getNetwork();
      const isBSC = network.chainId === 97n || network.chainId === 56n;
      
      if (!isBSC) {
        console.warn('⚠️ Not connected to BNB Chain. Current chain ID:', network.chainId);
        return false;
      }
      
      this.network = network.chainId === 97n ? 'testnet' : 'mainnet';
      return true;
    } catch (error) {
      console.error('❌ Error checking network:', error);
      return false;
    }
  }

  async switchToBSCNetwork(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      // Try to switch to BSC Testnet first
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x61', // 97 in hex
          chainName: 'BSC Testnet',
          nativeCurrency: {
            name: 'tBNB',
            symbol: 'tBNB',
            decimals: 18
          },
          rpcUrls: [BSC_TESTNET_RPC],
          blockExplorerUrls: ['https://testnet.bscscan.com/']
        }]
      });

      // Then switch to it
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }]
      });

      this.network = 'testnet';
      console.log('✅ Switched to BSC Testnet');
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x61',
              chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'tBNB',
                symbol: 'tBNB',
                decimals: 18
              },
              rpcUrls: [BSC_TESTNET_RPC],
              blockExplorerUrls: ['https://testnet.bscscan.com/']
            }]
          });
          this.network = 'testnet';
          return true;
        } catch (addError) {
          console.error('❌ Failed to add BSC Testnet:', addError);
          return false;
        }
      }
      
      console.error('❌ Failed to switch to BSC Testnet:', error);
      return false;
    }
  }

  async getBNBBalance(): Promise<string> {
    await this.ensureProviderInitialized();
    if (!this.signer) throw new Error('Signer not initialized');

    try {
      // Use provider.getBalance instead of signer.getBalance in ethers v6
      const balance = await this.provider!.getBalance(await this.signer.getAddress());
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Error fetching BNB balance:', error);
      return '0.00';
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    await this.ensureProviderInitialized();
    if (!this.provider) throw new Error('Provider not initialized');

    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
        this.provider
      );

      const [balance, decimals] = await Promise.all([
        tokenContract.balanceOf(userAddress),
        tokenContract.decimals()
      ]);

      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('❌ Error fetching token balance:', error);
      return '0.00';
    }
  }

  async getAllBalances(userAddress: string): Promise<{ bnb: string; pyusd: string; tbnb: string }> {
    try {
      const [bnbBalance, pyusdBalance] = await Promise.all([
        this.getBNBBalance(),
        this.getTokenBalance(PAYPAL_USD_ADDRESS[this.network], userAddress)
      ]);

      return {
        bnb: bnbBalance,
        pyusd: pyusdBalance,
        tbnb: bnbBalance // tBNB is the same as BNB on testnet
      };
    } catch (error) {
      console.error('❌ Error fetching balances:', error);
      return {
        bnb: '0.00',
        pyusd: '0.00',
        tbnb: '0.00'
      };
    }
  }

  // Asset Tokenization Functions
  async requestTokenization(
    assetName: string,
    assetSymbol: string,
    assetClass: number,
    description: string,
    totalSupply: number,
    decimals: number
  ): Promise<ethers.ContractTransactionResponse> {
    await this.ensureProviderInitialized();
    if (!this.assetTokenizationContract) throw new Error('Asset Tokenization contract not initialized');

    const tx = await this.assetTokenizationContract.requestTokenization(
      assetName,
      assetSymbol,
      assetClass,
      description,
      totalSupply,
      decimals,
      { value: ethers.parseEther('0.01') } // Creation fee
    );

    console.log('📝 Tokenization request submitted:', tx.hash);
    return tx;
  }

  // Bartering Functions
  async createBarterOffer(
    offerToken: string,
    offerAmount: number,
    requestToken: string,
    requestAmount: number,
    expiryTimestamp: number,
    swapType: number,
    metadata: string
  ): Promise<ethers.ContractTransactionResponse> {
    await this.ensureProviderInitialized();
    if (!this.barteringEngineContract) throw new Error('Bartering Engine contract not initialized');

    const tx = await this.barteringEngineContract.createBarterOffer(
      offerToken,
      offerAmount,
      requestToken,
      requestAmount,
      expiryTimestamp,
      swapType,
      metadata,
      { value: ethers.parseEther('0.001') } // Platform fee
    );

    console.log('🤝 Barter offer created:', tx.hash);
    return tx;
  }

  // Liquidity Pool Functions
  async createLiquidityPool(
    poolName: string,
    tokenA: string,
    tokenB: string,
    initialAmountA: number,
    initialAmountB: number,
    feeRate: number
  ): Promise<ethers.ContractTransactionResponse> {
    await this.ensureProviderInitialized();
    if (!this.liquidityPoolContract) throw new Error('Liquidity Pool contract not initialized');

    const tx = await this.liquidityPoolContract.createPool(
      poolName,
      tokenA,
      tokenB,
      initialAmountA,
      initialAmountB,
      feeRate,
      { value: ethers.parseEther('0.0005') } // Platform fee
    );

    console.log('🏊 Liquidity pool created:', tx.hash);
    return tx;
  }

  // Utility Functions
  async estimateGas(transaction: any): Promise<string> {
    try {
      const gasEstimate = await transaction.estimateGas();
      return gasEstimate.toString();
    } catch (error) {
      console.error('❌ Error estimating gas:', error);
      return '0';
    }
  }

  async getTransactionReceipt(txHash: string): Promise<any> {
    await this.ensureProviderInitialized();
    if (!this.provider) throw new Error('Provider not initialized');

    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error('❌ Error getting transaction receipt:', error);
      throw error;
    }
  }

  // Network and Contract Info
  getCurrentNetwork(): 'testnet' | 'mainnet' {
    return this.network;
  }

  getContractAddresses() {
    return {
      assetTokenization: ASSET_TOKENIZATION_ADDRESS[this.network],
      barteringEngine: BARTERING_ENGINE_ADDRESS[this.network],
      liquidityPool: LIQUIDITY_POOL_ADDRESS[this.network],
      paypalUSD: PAYPAL_USD_ADDRESS[this.network]
    };
  }

  // Mock data for development
  getMockAssetTokens() {
    return [
      {
        id: '1',
        name: 'Prediction Protocol',
        symbol: 'PRED',
        assetClass: 'PredictionMarkets',
        description: 'A revolutionary prediction market token',
        totalSupply: 1000000,
        circulatingSupply: 500000,
        decimals: 6,
        creationDate: new Date().toISOString(),
        creator: '0x1234...5678',
        status: 'Active',
        isVerified: true
      }
    ];
  }

  getMockBarterOffers() {
    return [
      {
        id: '1',
        offerMaker: '0x1234...5678',
        offerToken: 'PRED',
        offerAmount: 1000,
        requestToken: 'PYUSD',
        requestAmount: 100,
        expiryTimestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Open',
        swapType: 'Direct'
      }
    ];
  }
}

export default new BNBService(); 