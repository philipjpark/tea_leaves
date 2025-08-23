import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
// Mock SolanaToken interface and service to resolve import issues
interface SolanaToken {
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

// Mock service implementation
const solanaTokensService = {
  getCategories(): string[] {
    return ['All', 'Layer 1', 'Stablecoin', 'DeFi'];
  },
  getTokensByCategory(category: string): SolanaToken[] {
    const mockTokens: SolanaToken[] = [
      {
        symbol: 'SOL',
        name: 'Solana',
        address: 'So11111111111111111111111111111111111111112',
        decimals: 9,
        logoURI: 'https://example.com/sol.png',
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
        logoURI: 'https://example.com/usdc.png',
        category: 'Stablecoin',
        price: 1.00,
        change24h: 0.0,
        volume24h: 1500000000,
        marketCap: 45000000000
      }
    ];
    
    if (category === 'All') {
      return mockTokens;
    }
    return mockTokens.filter(token => token.category === category);
  }
};

interface TokenSelectorProps {
  onTokenSelect: (token: SolanaToken) => void;
  selectedToken?: SolanaToken | null;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onTokenSelect, selectedToken }) => {
  const [tokens, setTokens] = useState<SolanaToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<SolanaToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    filterTokens();
  }, [tokens, searchQuery, selectedCategory]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      // Use the correct method from solanaTokensService
      const allTokens = solanaTokensService.getTokensByCategory('All');
      setTokens(allTokens);
    } catch (err: any) {
      setError(err.message || 'Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  const filterTokens = () => {
    let filtered = tokens;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(token =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(token => token.category === selectedCategory);
    }

    setFilteredTokens(filtered);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'DeFi': '#00d4aa',
      'NFT': '#ff6b6b',
      'Gaming': '#4ecdc4',
      'Infrastructure': '#45b7d1',
      'Meme': '#96ceb4',
      'Other': '#feca57'
    };
    return colors[category] || '#95a5a6';
  };

  // handleExternalLink function removed - not needed

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6">Solana Tokens</Typography>
          </Box>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Loading Solana ecosystem tokens...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={loadTokens}>
              Retry
            </Button>
          }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6">
            Choose Wisely
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search tokens by name, symbol, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Category Tabs */}
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setActiveTab(newValue);
                const categories = ['All', ...solanaTokensService.getCategories()];
                setSelectedCategory(categories[newValue]);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="All" />
                             {solanaTokensService.getCategories().map((category: string) => (
                <Tab 
                  key={category} 
                  label={category}
                  sx={{
                    '& .MuiChip-root': {
                      backgroundColor: getCategoryColor(category),
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Tabs>
          </Paper>
        </Box>

        {/* Token Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredTokens.length} tokens found
          </Typography>
          <Chip 
            icon={<FilterListIcon />} 
            label={`Filtered by: ${selectedCategory}`} 
            size="small" 
            variant="outlined"
          />
        </Box>

        {/* Token List */}
        <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
          <List>
            {filteredTokens.map((token, index) => (
              <React.Fragment key={token.symbol}>
                <ListItem 
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: selectedToken?.symbol === token.symbol ? '#f3e5f5' : 'transparent',
                    border: selectedToken?.symbol === token.symbol ? '2px solid' : '1px solid',
                    borderColor: selectedToken?.symbol === token.symbol ? '#9c27b0' : 'divider',
                    '&:hover': {
                      backgroundColor: selectedToken?.symbol === token.symbol 
                        ? '#f3e5f5' 
                        : 'action.hover'
                    }
                  }}
                  onClick={() => onTokenSelect(token)}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        backgroundColor: selectedToken?.symbol === token.symbol 
                          ? '#9c27b0' 
                          : getCategoryColor(token.category),
                        fontWeight: 'bold'
                      }}
                    >
                      {token.symbol.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: selectedToken?.symbol === token.symbol ? '#9c27b0' : 'inherit'
                          }}
                        >
                          {token.symbol}
                        </Typography>
                        <Chip 
                          label={token.category} 
                          size="small" 
                          sx={{ 
                            backgroundColor: selectedToken?.symbol === token.symbol 
                              ? '#9c27b0'
                              : getCategoryColor(token.category),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                        {selectedToken?.symbol === token.symbol && (
                          <Chip 
                            label="Selected" 
                            size="small" 
                            sx={{ 
                              fontSize: '0.7rem',
                              backgroundColor: '#9c27b0',
                              color: 'white'
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'medium', 
                            mb: 0.5,
                            color: selectedToken?.symbol === token.symbol ? '#9c27b0' : 'inherit'
                          }}
                        >
                          {token.name}
                        </Typography>
                                                 {/* Description removed - not available in SolanaToken interface */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {token.price && (
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Price: {formatPrice(token.price)}
                            </Typography>
                          )}
                          {token.marketCap && (
                            <Typography variant="caption" color="text.secondary">
                              MCap: {formatCurrency(token.marketCap)}
                            </Typography>
                          )}
                          {token.volume24h && (
                            <Typography variant="caption" color="text.secondary">
                              Vol: {formatCurrency(token.volume24h)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  
                                     {/* External links removed - not available in SolanaToken interface */}
                </ListItem>
                {index < filteredTokens.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {filteredTokens.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              No tokens found matching your search criteria. Try adjusting your search or category filter.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenSelector; 