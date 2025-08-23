import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  LinearProgress,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  LocalFireDepartment as FireIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Leaderboard as LeaderboardIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  LocalCafe as TeaIcon,
  TrendingDown as TrendingDownIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';

interface LaunchedToken {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  assetClass: string;
  description: string;
  creator: string;
  avatar: string;
  launchDate: string;
  marketCap: number;
  priceChange24h: number;
  volume24h: number;
  holders: number;
  liquidity: number;
  communityScore: number;
  innovationScore: number;
  riskScore: number;
  totalScore: number;
  rank: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  features: string[];
  achievements: string[];
  status: 'Active' | 'Trending' | 'New' | 'Established';
}

const TokenIncentivization: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<LaunchedToken | null>(null);

  // Mock data for the first launched token
  const launchedTokens: LaunchedToken[] = [
    {
      id: '1',
      name: 'Prediction Protocol',
      symbol: 'PRED',
      chain: 'BNB Chain',
      assetClass: 'Prediction Markets',
      description: 'A revolutionary prediction market token that allows users to bet on real-world events and earn rewards for accurate forecasts.',
      creator: 'philxdaegu',
      avatar: '🎯',
      launchDate: '2024-01-15',
      marketCap: 2500000,
      priceChange24h: 12.5,
      volume24h: 450000,
      holders: 1247,
      liquidity: 850000,
      communityScore: 9.2,
      innovationScore: 9.5,
      riskScore: 7.8,
      totalScore: 8.8,
      rank: 1,
      tier: 'Diamond',
      features: [
        'AI-Powered Predictions',
        'Community Governance',
        'Cross-Chain Compatibility',
        'Real-Time Oracles',
        'Staking Rewards',
        'NFT Integration'
      ],
      achievements: [
        'First Token Launch',
        'Community Choice Award',
        'Innovation Excellence',
        'Liquidity Champion'
      ],
      status: 'Trending'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond': return '#B9F2FF';
      case 'Platinum': return '#E5E4E2';
      case 'Gold': return '#FFD700';
      case 'Silver': return '#C0C0C0';
      case 'Bronze': return '#CD7F32';
      default: return '#grey';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamond': return <DiamondIcon />;
      case 'Platinum': return <StarIcon />;
      case 'Gold': return <TrophyIcon />;
      case 'Silver': return <StarIcon />;
      case 'Bronze': return <StarIcon />;
      default: return <StarIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Trending': return '#FF6B35';
      case 'New': return '#4CAF50';
      case 'Active': return '#2196F3';
      case 'Established': return '#9C27B0';
      default: return '#666';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 4,
                  background: 'linear-gradient(135deg, #6A1B9A 0%, #2E7D32 100%)',
                  border: '4px solid white',
                  boxShadow: '0 8px 32px rgba(106, 27, 154, 0.3)'
                }}
              >
                <LeaderboardIcon sx={{ fontSize: 50, color: 'white' }} />
              </Avatar>
            </motion.div>
            
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ 
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: 700,
                color: '#2E7D32',
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Token Leaderboard
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#666',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4
              }}
            >
              Discover and rank because leading tokens get deployed <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
              <Box component="span" sx={{ fontStyle: 'italic' }}>_leaves</Box> ecosystem
            </Typography>
          </Box>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {launchedTokens.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Tokens Launched
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {formatCurrency(launchedTokens.reduce((sum, token) => sum + token.marketCap, 0))}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Market Cap
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {launchedTokens.reduce((sum, token) => sum + token.holders, 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Holders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {formatCurrency(launchedTokens.reduce((sum, token) => sum + token.liquidity, 0))}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Liquidity
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card sx={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
              border: '2px solid #E8F5E8',
              boxShadow: '0 12px 40px rgba(46, 125, 50, 0.15)',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <TrophyIcon sx={{ mr: 2, color: '#FFD700', fontSize: 32 }} />
                  <Typography variant="h4" sx={{ 
                    color: '#2E7D32', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Token Rankings
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)' }}>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Token</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Chain</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Market Cap</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>24h Change</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Holders</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Score</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Tier</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2E7D32' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {launchedTokens.map((token) => (
                        <TableRow 
                          key={token.id}
                          hover
                          onClick={() => setSelectedToken(token)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ mr: 1, fontWeight: 700 }}>
                                #{token.rank}
                              </Typography>
                              {token.rank <= 3 && (
                                <TrophyIcon sx={{ color: getTierColor(token.tier), fontSize: 20 }} />
                              )}
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                mr: 2, 
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40,
                                fontSize: '1.2rem'
                              }}>
                                {token.avatar}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {token.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {token.symbol}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={token.chain}
                              size="small"
                              sx={{
                                bgcolor: '#E8F5E8',
                                color: '#2E7D32',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(token.marketCap)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {token.priceChange24h >= 0 ? (
                                <TrendingUpIcon sx={{ color: '#4CAF50', mr: 0.5, fontSize: 16 }} />
                              ) : (
                                <TrendingDownIcon sx={{ color: '#F44336', mr: 0.5, fontSize: 16 }} />
                              )}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: token.priceChange24h >= 0 ? '#4CAF50' : '#F44336',
                                  fontWeight: 600
                                }}
                              >
                                {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {formatNumber(token.holders)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating 
                                value={token.totalScore / 2} 
                                precision={0.5} 
                                readOnly 
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" fontWeight={600}>
                                {token.totalScore.toFixed(1)}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              icon={getTierIcon(token.tier)}
                              label={token.tier}
                              size="small"
                              sx={{
                                bgcolor: getTierColor(token.tier),
                                color: 'white',
                                fontWeight: 700
                              }}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={token.status}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(token.status),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedToken(token);
                              }}
                              sx={{
                                borderColor: '#2E7D32',
                                color: '#2E7D32',
                                '&:hover': {
                                  borderColor: '#4CAF50',
                                  backgroundColor: 'rgba(46, 125, 50, 0.04)'
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Token Details Modal */}
          {selectedToken && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ 
                mt: 4,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
                border: '2px solid #E8F5E8',
                boxShadow: '0 16px 48px rgba(46, 125, 50, 0.2)',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        mr: 3, 
                        bgcolor: 'primary.main',
                        width: 80,
                        height: 80,
                        fontSize: '2.5rem'
                      }}>
                        {selectedToken.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h3" sx={{ 
                          color: '#2E7D32', 
                          fontWeight: 700, 
                          mb: 1 
                        }}>
                          {selectedToken.name}
                        </Typography>
                        <Typography variant="h5" sx={{ 
                          color: '#666', 
                          mb: 2,
                          fontFamily: 'monospace'
                        }}>
                          ${selectedToken.symbol}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: '#666', 
                          maxWidth: '600px',
                          lineHeight: 1.6
                        }}>
                          {selectedToken.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        icon={getTierIcon(selectedToken.tier)}
                        label={selectedToken.tier}
                        size="medium"
                        sx={{
                          bgcolor: getTierColor(selectedToken.tier),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          mb: 2
                        }}
                      />
                      <Typography variant="h4" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700 
                      }}>
                        #{selectedToken.rank}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rank
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  {/* Key Metrics */}
                  <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700, 
                        mb: 3 
                      }}>
                        Market Performance
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                              {formatCurrency(selectedToken.marketCap)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Market Cap
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ 
                              color: selectedToken.priceChange24h >= 0 ? '#4CAF50' : '#F44336', 
                              fontWeight: 700 
                            }}>
                              {selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h.toFixed(2)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              24h Change
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                              {formatCurrency(selectedToken.volume24h)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              24h Volume
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                              {formatNumber(selectedToken.holders)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Holders
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700, 
                        mb: 3 
                      }}>
                        Scoring & Metrics
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Community Score</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedToken.communityScore.toFixed(1)}/10
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedToken.communityScore * 10} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: '#E8F5E8',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#4CAF50'
                            }
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Innovation Score</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedToken.innovationScore.toFixed(1)}/10
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedToken.innovationScore * 10} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: '#E8F5E8',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#6A1B9A'
                            }
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Risk Score</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedToken.riskScore.toFixed(1)}/10
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedToken.riskScore * 10} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: '#E8F5E8',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#FF9800'
                            }
                          }} 
                        />
                      </Box>
                      
                      <Paper sx={{ 
                        p: 2, 
                        background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
                        border: '1px solid #E8F5E8'
                      }}>
                        <Typography variant="h6" sx={{ 
                          color: '#2E7D32', 
                          fontWeight: 700, 
                          textAlign: 'center' 
                        }}>
                          Total Score: {selectedToken.totalScore.toFixed(1)}/10
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  {/* Features & Achievements */}
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700, 
                        mb: 3 
                      }}>
                        Key Features
                      </Typography>
                      
                      <Grid container spacing={1}>
                        {selectedToken.features.map((feature, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Chip
                              icon={<SparkleIcon />}
                              label={feature}
                              sx={{
                                bgcolor: '#F3E5F5',
                                color: '#6A1B9A',
                                fontWeight: 600,
                                mb: 1,
                                width: '100%'
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700, 
                        mb: 3 
                      }}>
                        Achievements
                      </Typography>
                      
                      <Stack spacing={1}>
                        {selectedToken.achievements.map((achievement, index) => (
                          <Chip
                            key={index}
                            icon={<TrophyIcon />}
                            label={achievement}
                            sx={{
                              bgcolor: '#FFF3E0',
                              color: '#E65100',
                              fontWeight: 600
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => setSelectedToken(null)}
                      sx={{
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 700,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
                        }
                      }}
                    >
                      Close Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Launch Your Token CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Paper sx={{ 
                p: 5, 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
                border: '2px solid #E8F5E8',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)'
              }}>
                <Typography variant="h4" sx={{ 
                  color: '#2E7D32', 
                  fontWeight: 700, 
                  mb: 2
                }}>
                  Ready to Launch Your Token?
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: '#666', 
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  mx: 'auto'
                }}>
                  Join the leaderboard by creating your own tokenized asset. 
                  Use our Token Factory to bring your vision to life and compete for the top spot!
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  href="/token-factory"
                  sx={{
                    background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                    borderRadius: '12px',
                    px: 5,
                    py: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%)'
                    }
                  }}
                >
                  🚀 Launch Token Now
                </Button>
              </Paper>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TokenIncentivization; 