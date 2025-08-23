import { ethers } from 'ethers';

export interface TokenMetadata {
  id: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  value: number;
  valueUnit: string;
  collateral: number;
  status: 'pending' | 'active' | 'settled' | 'expired';
  createdAt: string;
  owner: string;
  contractAddress?: string;
}

export interface SwapOffer {
  id: string;
  fromToken: TokenMetadata;
  toToken: TokenMetadata;
  amount: number;
  exchangeRate: number;
  expiry: Date;
  status: 'open' | 'accepted' | 'expired' | 'cancelled';
  creator: string;
  acceptor?: string;
  createdAt: string;
}

export interface BarterTransaction {
  id: string;
  fromToken: TokenMetadata;
  toToken: TokenMetadata;
  amount: number;
  exchangeRate: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  blockNumber?: number;
}

class BarterService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  // BNB Chain configuration
  private readonly BSC_TESTNET_CHAIN_ID = '0x61'; // 97
  private readonly BSC_MAINNET_CHAIN_ID = '0x38'; // 56
  private readonly BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  private readonly BSC_MAINNET_RPC = 'https://bsc-dataseed.binance.org/';

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
        
        console.log('Barter service initialized with provider');
      } catch (error) {
        console.error('Failed to initialize barter service:', error);
      }
    }
  }

  private handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      // User disconnected wallet
      this.signer = null;
      this.contract = null;
    } else {
      // User switched accounts
      this.initializeProvider();
    }
  }

  private handleChainChanged(chainId: string) {
    // Reload page when chain changes
    window.location.reload();
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }
      
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const address = await this.signer.getAddress();
      console.log('Connected wallet:', address);
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  async checkNetwork(): Promise<{ isCorrect: boolean; chainId: string; networkName: string }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const network = await this.provider.getNetwork();
      const chainId = network.chainId.toString();
      
      const isCorrect = chainId === this.BSC_TESTNET_CHAIN_ID || chainId === this.BSC_MAINNET_CHAIN_ID;
      const networkName = chainId === this.BSC_TESTNET_CHAIN_ID ? 'BSC Testnet' : 
                         chainId === this.BSC_MAINNET_CHAIN_ID ? 'BSC Mainnet' : 'Unknown';
      
      return { isCorrect, chainId, networkName };
    } catch (error) {
      console.error('Failed to check network:', error);
      return { isCorrect: false, chainId: '0', networkName: 'Unknown' };
    }
  }

  async switchToBSCNetwork(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.BSC_TESTNET_CHAIN_ID }], // Default to testnet
      });

      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: this.BSC_TESTNET_CHAIN_ID,
              chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'tBNB',
                symbol: 'tBNB',
                decimals: 18
              },
              rpcUrls: [this.BSC_TESTNET_RPC],
              blockExplorerUrls: ['https://testnet.bscscan.com/']
            }]
          });
          return true;
        } catch (addError) {
          console.error('Failed to add BSC testnet:', addError);
          return false;
        }
      }
      console.error('Failed to switch to BSC network:', error);
      return false;
    }
  }

  async createToken(metadata: Omit<TokenMetadata, 'id' | 'status' | 'createdAt' | 'owner'>): Promise<TokenMetadata | null> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const owner = await this.signer.getAddress();
      const id = `TOKEN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const token: TokenMetadata = {
        ...metadata,
        id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        owner
      };

      // In a real implementation, this would deploy a smart contract
      // For now, we'll simulate the process
      console.log('Creating token:', token);
      
      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status to active
      token.status = 'active';
      token.contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      return token;
    } catch (error) {
      console.error('Failed to create token:', error);
      return null;
    }
  }

  async createSwapOffer(
    fromToken: TokenMetadata,
    toToken: TokenMetadata,
    amount: number
  ): Promise<SwapOffer | null> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const creator = await this.signer.getAddress();
      const id = `SWAP_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const offer: SwapOffer = {
        id,
        fromToken,
        toToken,
        amount,
        exchangeRate: fromToken.value / toToken.value,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        status: 'open',
        creator,
        createdAt: new Date().toISOString()
      };

      console.log('Creating swap offer:', offer);
      
      // In a real implementation, this would create a smart contract offer
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return offer;
    } catch (error) {
      console.error('Failed to create swap offer:', error);
      return null;
    }
  }

  async acceptSwapOffer(offerId: string): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const acceptor = await this.signer.getAddress();
      console.log('Accepting swap offer:', offerId, 'by:', acceptor);
      
      // In a real implementation, this would execute the swap on-chain
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error('Failed to accept swap offer:', error);
      return false;
    }
  }

  async getTokenBalance(tokenAddress: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      // In a real implementation, this would query the token contract
      // For now, return a mock balance
      return '1000.0';
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return '0.0';
    }
  }

  async getBNBBalance(): Promise<string> {
    try {
      if (!this.provider || !this.signer) {
        throw new Error('Provider or signer not initialized');
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get BNB balance:', error);
      return '0.0';
    }
  }

  async estimateSwapGas(
    fromToken: TokenMetadata,
    toToken: TokenMetadata,
    amount: number
  ): Promise<string> {
    try {
      // In a real implementation, this would estimate gas for the swap
      // For now, return a mock estimate
      const baseGas = 150000; // Base gas for swap
      const complexityMultiplier = 1.2; // Adjust based on token complexity
      
      const estimatedGas = Math.floor(baseGas * complexityMultiplier);
      const gasPrice = 5000000000; // 5 gwei in wei
      
      const totalCost = estimatedGas * gasPrice;
      return ethers.formatEther(totalCost);
    } catch (error) {
      console.error('Failed to estimate swap gas:', error);
      return '0.001';
    }
  }

  // Mock data for development
  getMockTokens(): TokenMetadata[] {
    return [
      {
        id: 'PRED_001',
        name: 'Jake Paul vs Tank Davis',
        symbol: 'JP_TD',
        category: 'Prediction Markets',
        description: 'Prediction token for Jake Paul winning by KO',
        value: 0.85,
        valueUnit: 'ETH',
        collateral: 200,
        status: 'active',
        createdAt: new Date().toISOString(),
        owner: '0x1234...5678',
        contractAddress: '0xabcd...efgh'
      },
      {
        id: 'RE_001',
        name: 'Downtown Office Complex',
        symbol: 'DT_OFF',
        category: 'Real Estate',
        description: 'Tokenized office building in downtown area',
        value: 2500000,
        valueUnit: 'USD',
        collateral: 3000000,
        status: 'active',
        createdAt: new Date().toISOString(),
        owner: '0x8765...4321',
        contractAddress: '0xdcba...hgfe'
      }
    ];
  }

  getMockSwapOffers(): SwapOffer[] {
    return [
      {
        id: 'SWAP_001',
        fromToken: this.getMockTokens()[0],
        toToken: this.getMockTokens()[1],
        amount: 100,
        exchangeRate: 0.85 / 2500000,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'open',
        creator: '0x1234...5678',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export default new BarterService(); 