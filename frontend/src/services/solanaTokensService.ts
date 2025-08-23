export interface SolanaToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  category: string;
  price?: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
}

class SolanaTokensService {
  private tokens: SolanaToken[] = [
    {
      symbol: 'SOL',
      name: 'Solana',
      address: 'So11111111111111111111111111111111111111112',
      decimals: 9,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      category: 'Layer 1',
      price: 140.50,
      change24h: 5.2,
      volume24h: 2500000000,
      marketCap: 65000000000
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      category: 'Stablecoin',
      price: 1.00,
      change24h: 0.0,
      volume24h: 1500000000,
      marketCap: 45000000000
    },
    {
      symbol: 'RAY',
      name: 'Raydium',
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
      category: 'DeFi',
      price: 0.85,
      change24h: -2.1,
      volume24h: 25000000,
      marketCap: 220000000
    },
    {
      symbol: 'SRM',
      name: 'Serum',
      address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png',
      category: 'DeFi',
      price: 0.12,
      change24h: 1.8,
      volume24h: 15000000,
      marketCap: 180000000
    },
    {
      symbol: 'ORCA',
      name: 'Orca',
      address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png',
      category: 'DeFi',
      price: 2.45,
      change24h: 3.2,
      volume24h: 35000000,
      marketCap: 120000000
    },
    {
      symbol: 'MNGO',
      name: 'Mango',
      address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/logo.png',
      category: 'DeFi',
      price: 0.035,
      change24h: -1.5,
      volume24h: 8000000,
      marketCap: 35000000
    }
  ];

  getCategories(): string[] {
    const categories = [...new Set(this.tokens.map(token => token.category))];
    return ['All', ...categories];
  }

  getTokensByCategory(category: string): SolanaToken[] {
    if (category === 'All') {
      return this.tokens;
    }
    return this.tokens.filter(token => token.category === category);
  }

  searchTokens(query: string): SolanaToken[] {
    const lowercaseQuery = query.toLowerCase();
    return this.tokens.filter(token => 
      token.symbol.toLowerCase().includes(lowercaseQuery) ||
      token.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  getTokenByAddress(address: string): SolanaToken | undefined {
    return this.tokens.find(token => token.address === address);
  }

  getTokenBySymbol(symbol: string): SolanaToken | undefined {
    return this.tokens.find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
  }

  getTopTokens(limit: number = 10): SolanaToken[] {
    return this.tokens
      .filter(token => token.marketCap)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, limit);
  }

  getTrendingTokens(): SolanaToken[] {
    return this.tokens
      .filter(token => token.change24h !== undefined)
      .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
      .slice(0, 5);
  }

  async updateTokenPrices(): Promise<void> {
    // Simulate API call to update token prices
    // In a real implementation, this would fetch from CoinGecko or similar
    console.log('Updating token prices...');
    
    // Simulate price updates
    this.tokens.forEach(token => {
      if (token.price) {
        const change = (Math.random() - 0.5) * 0.1; // ±5% change
        token.price = token.price * (1 + change);
        token.change24h = change * 100;
      }
    });
  }
}

const solanaTokensService = new SolanaTokensService();
export default solanaTokensService; 