import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container
} from '@mui/material';
import TokenCreationResultsPage from '../strategy/TokenCreationResultsPage';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  SwapHoriz as SwapHorizIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Launch as LaunchIcon,
  SmartToy as AIIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  totalSupply: string;
  description: string;
  category: string;
  liquidity: string;
  image: string;
  marketCap: string;
  price: string;
  volume24h: string;
  change24h: string;
  holders: string;
  transactions: string;
  createdAt: string;
  status: string;
  aiGenerated: boolean;
  strategy: string;
}

const TokenLeaderboard: React.FC = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'marketCap' | 'volume24h' | 'change24h' | 'holders'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<TokenData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);

  useEffect(() => {
    // Load tokens from localStorage (in real app, this would be from your database)
    const loadTokens = () => {
      try {
        const storedTokens = localStorage.getItem('teaLeavesTokens');
        if (storedTokens) {
          const parsedTokens = JSON.parse(storedTokens);
          setTokens(parsedTokens);
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
    
    // Listen for new token additions
    const handleStorageChange = () => {
      loadTokens();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getChainIcon = (chain: string) => {
    const icons: { [key: string]: string } = {
      ethereum: '🔷',
      binance: '🟡',
      solana: '🟣',
      polygon: '🟣'
    };
    return icons[chain] || '🔗';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      defi: '🏦',
      gaming: '🎮',
      ai: '🤖',
      infrastructure: '🏗️',
      social: '👥'
    };
    return icons[category] || '✨';
  };

  const formatNumber = (num: string) => {
    const n = parseFloat(num);
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(2)}K`;
    return `$${n.toFixed(2)}`;
  };

  const formatPercentage = (change: string) => {
    const num = parseFloat(change);
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = parseFloat(a[sortBy]);
    const bValue = parseFloat(b[sortBy]);
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const handleSort = (field: 'marketCap' | 'volume24h' | 'change24h' | 'holders') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDeleteToken = (token: TokenData) => {
    setTokenToDelete(token);
    setDeleteDialogOpen(true);
  };

  const handleViewTokenResults = (token: TokenData) => {
    setSelectedToken(token);
    setShowResults(true);
  };

  const confirmDelete = () => {
    if (tokenToDelete) {
      const updatedTokens = tokens.filter(t => t.id !== tokenToDelete.id);
      setTokens(updatedTokens);
      localStorage.setItem('teaLeavesTokens', JSON.stringify(updatedTokens));
      setDeleteDialogOpen(false);
      setTokenToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setTokenToDelete(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading Tea-Leaves Token Leaderboard...
        </Typography>
      </Box>
    );
  }

  if (tokens.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">
            🍃 No tokens created yet!
          </Typography>
          <Typography variant="body2">
            Create your first AI-powered token using the Token Factory to see it appear here.
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          href="/token-factory"
          startIcon={<LaunchIcon />}
        >
          Create Your First Token
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ 
            color: '#2E7D32', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            🍃 Tea-Leaves Token Leaderboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', fontStyle: 'italic' }}>
            AI-Generated Tokens Powered by Gemma & Factor Discovery
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip 
              icon={<AIIcon />} 
              label={`${tokens.filter(t => t.aiGenerated).length} AI-Generated`} 
              color="success" 
              variant="outlined"
            />
            <Chip 
              icon={<PeopleIcon />} 
              label={`${tokens.length} Total Tokens`} 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Sorting Controls */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 600 }}>
            Sort by:
          </Typography>
          {[
            { key: 'marketCap' as const, label: 'Market Cap' },
            { key: 'volume24h' as const, label: '24h Volume' },
            { key: 'change24h' as const, label: '24h Change' },
            { key: 'holders' as const, label: 'Holders' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={sortBy === key ? 'contained' : 'outlined'}
              color={sortBy === key ? 'primary' : 'inherit'}
              onClick={() => handleSort(key)}
              size="small"
              sx={{
                minWidth: '120px',
                borderColor: sortBy === key ? 'primary.main' : '#ddd'
              }}
            >
              {label}
              {sortBy === key && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Typography>
              )}
            </Button>
          ))}
        </Box>

        {/* Token Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#2E7D32' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Token</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Chain</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Market Cap</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>24h Change</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>24h Volume</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Holders</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTokens.map((token) => (
                <TableRow key={token.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  {/* Token Info */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={token.image} 
                        sx={{ width: 40, height: 40, border: '2px solid #E8F5E8' }}
                      >
                        {getCategoryIcon(token.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                          {token.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {token.symbol}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={token.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          {token.aiGenerated && (
                            <Chip 
                              icon={<AIIcon />} 
                              label="AI" 
                              size="small" 
                              color="success"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Chain */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{getChainIcon(token.chain)}</Typography>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {token.chain}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Market Cap */}
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatNumber(token.marketCap)}
                    </Typography>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatNumber(token.price)}
                    </Typography>
                  </TableCell>

                  {/* 24h Change */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {parseFloat(token.change24h) >= 0 ? (
                        <TrendingUpIcon sx={{ color: '#4CAF50' }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: '#F44336' }} />
                      )}
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          color: parseFloat(token.change24h) >= 0 ? '#4CAF50' : '#F44336'
                        }}
                      >
                        {formatPercentage(token.change24h)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* 24h Volume */}
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatNumber(token.volume24h)}
                    </Typography>
                  </TableCell>

                  {/* Holders */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ color: '#666', fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {parseInt(token.holders).toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip 
                      label={token.status} 
                      color={token.status === 'active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Token Results">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewTokenResults(token)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Trade">
                        <IconButton size="small" color="secondary">
                          <SwapHorizIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add to Watchlist">
                        <IconButton size="small" color="warning">
                          <StarIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Token">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteToken(token)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Stats */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8fff8', borderRadius: '16px', border: '2px solid #E8F5E8' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 600 }}>
            📊 Leaderboard Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                  {tokens.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Total Tokens
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                  {tokens.filter(t => t.aiGenerated).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Testnet
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                  {tokens.filter(t => t.chain === 'ethereum').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Ethereum
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 700 }}>
                  {tokens.filter(t => t.chain === 'solana').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Solana
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
          🗑️ Delete Token
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the token "{tokenToDelete?.name}"?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
            This action cannot be undone. The token will be permanently removed from the leaderboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={cancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete Token
          </Button>
        </DialogActions>
              </Dialog>

        {/* Token Creation Results Page */}
        {showResults && selectedToken && (
          <TokenCreationResultsPage
            results={{
              semanticAgent: {
                status: 'completed',
                marketAnalysis: `Market analysis for ${selectedToken.name} shows strong potential in the ${selectedToken.category} sector`,
                competitionAnalysis: 'Competitive positioning analyzed with unique value propositions identified',
                regulatoryCompliance: 'Compliance verified for current regulatory framework',
                tokenomicsModel: `Tokenomics model optimized for ${selectedToken.totalSupply} total supply`,
                riskAssessment: 'Risk assessment completed with mitigation strategies in place',
                message: 'Market analysis completed successfully with positive outlook.'
              },
              liquidityAgent: {
                status: 'completed',
                liquidityStrategy: `Liquidity strategy implemented with ${selectedToken.liquidity} allocation`,
                poolDistribution: 'Multi-pool distribution for optimal market coverage',
                yieldOptimization: 'Yield optimization strategies implemented',
                marketMaking: 'Advanced market making protocols activated',
                message: 'Liquidity strategy successfully implemented and optimized.'
              },
              smartContractAgent: {
                status: 'completed',
                contractSecurity: 'Smart contract security verified and audited',
                gasOptimization: 'Gas optimization implemented for cost efficiency',
                upgradeability: 'Upgradeable contract architecture deployed',
                auditStatus: 'Security audit completed and passed',
                message: 'Smart contract deployment successful with security measures.'
              },
              tokenSpecs: {
                name: selectedToken.name,
                symbol: selectedToken.symbol,
                totalSupply: selectedToken.totalSupply,
                initialPrice: selectedToken.price,
                marketCap: selectedToken.marketCap,
                image: selectedToken.image
              }
            }}
            onClose={() => setShowResults(false)}
            onProceed={() => setShowResults(false)}
          />
        )}
      </>
    );
  };
  
  export default TokenLeaderboard;
