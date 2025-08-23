// Asset Tokenization Types
export interface AssetToken {
  id: string;
  name: string;
  symbol: string;
  assetClass: AssetClass;
  description: string;
  metadataURI: string;
  totalSupply: number;
  circulatingSupply: number;
  decimals: number;
  creationDate: string;
  expiryDate?: string;
  creator: string;
  status: TokenStatus;
  isVerified: boolean;
  verificationDate?: string;
  verifier?: string;
}

export enum AssetClass {
  IPRights = 'IPRights',
  MusicRoyalties = 'MusicRoyalties',
  RealEstate = 'RealEstate',
  Commodities = 'Commodities',
  PredictionMarkets = 'PredictionMarkets',
  StartupEquity = 'StartupEquity',
  CryptoTokens = 'CryptoTokens',
  TokenizedSecurities = 'TokenizedSecurities',
  Custom = 'Custom'
}

export enum TokenStatus {
  Active = 'Active',
  Paused = 'Paused',
  Suspended = 'Suspended',
  Redeemed = 'Redeemed',
  Expired = 'Expired'
}

// Bartering Types
export interface BarterOffer {
  id: string;
  offerMaker: string;
  offerToken: string;
  offerAmount: number;
  requestToken: string;
  requestAmount: number;
  expiryTimestamp: string;
  status: BarterStatus;
  swapType: SwapType;
  creationTimestamp: string;
  completionTimestamp?: string;
  acceptor?: string;
  metadata: string;
  isVerified: boolean;
  verificationTimestamp?: string;
  verifier?: string;
}

export enum BarterStatus {
  Open = 'Open',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
  Pending = 'Pending'
}

export enum SwapType {
  Direct = 'Direct',
  Conditional = 'Conditional',
  TimeLocked = 'TimeLocked',
  Escrow = 'Escrow'
}

// Liquidity Pool Types
export interface LiquidityPool {
  id: string;
  name: string;
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  totalSupply: number;
  feeRate: number;
  creationTimestamp: string;
  status: PoolStatus;
  isVerified: boolean;
  verificationTimestamp?: string;
  verifier?: string;
  swapCount: number;
  volume24h: number;
  lastSwapTimestamp?: string;
}

export enum PoolStatus {
  Active = 'Active',
  Paused = 'Paused',
  Suspended = 'Suspended',
  Deprecated = 'Deprecated'
}

export interface LiquidityPosition {
  id: string;
  poolId: string;
  provider: string;
  liquidityTokens: number;
  tokenAAmount: number;
  tokenBAmount: number;
  timestamp: string;
  isActive: boolean;
  lastClaimTimestamp: string;
  accumulatedFees: number;
}

// Market Data Types
export interface PriceData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketOverview {
  totalMarketCap: number;
  marketCapChange24h: number;
  volume24h: number;
  dominance: Record<string, number>;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  portfolio: Portfolio;
  preferences: UserPreferences;
}

export interface Portfolio {
  totalValue: number;
  assets: PortfolioAsset[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface PortfolioAsset {
  symbol: string;
  amount: number;
  value: number;
  allocation: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
}

// Token Launch Types
export interface TokenLaunchRequest {
  assetName: string;
  assetSymbol: string;
  assetClass: AssetClass;
  description: string;
  totalSupply: number;
  decimals: number;
  pricing: string;
  liquidity: string;
  professionalExperience: string;
  relevantBackground: string;
  investmentThesis: string;
  previousSuccesses: string;
  pdfFile?: File;
}

// AI Integration Types
export interface AIResponse {
  success: boolean;
  data: any;
  message: string;
  timestamp: string;
}

export interface TokenizationInsight {
  id: string;
  tokenId: string;
  type: 'optimization' | 'risk' | 'opportunity';
  description: string;
  confidence: number;
  timestamp: string;
  recommendations: string[];
}

// Research Types
export interface ResearchDocument {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'url' | 'note';
  source: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchCorpus {
  id: string;
  name: string;
  description: string;
  documents: ResearchDocument[];
  createdAt: string;
  updatedAt: string;
}

// Performance Types
export interface TokenPerformance {
  tokenId: string;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  liquidity: number;
  communityScore: number;
  innovationScore: number;
  riskScore: number;
  totalScore: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  token: AssetToken;
  performance: TokenPerformance;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  achievements: string[];
  status: 'Active' | 'Trending' | 'New' | 'Established';
} 