import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SwapHoriz as SwapIcon,
  Factory as FactoryIcon,
  AccountBalance as TreasuryIcon,
  Route as RouteIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  LocalFireDepartment as FireIcon,
  ShowChart as ChartIcon,
  AccountBalanceWallet as WalletIcon,
  Token as TokenIcon,
  AutoGraph as PredictionIcon,
  Home as RealEstateIcon,
  MusicNote as MusicIcon,
  Business as BusinessIcon,
  Build as BuildIcon,
  AutoAwesome as MagicIcon,
  WaterDrop as WaterIcon,
  Person as PersonIcon,
  CurrencyBitcoin as BitcoinIcon,
  Inventory as GoldBarsIcon,
  ShowChart as StockIcon,
  AccountBalance
} from '@mui/icons-material';
import TokenLaunch from '../components/TokenLaunch';
// CryptoShakers component removed - not needed for now

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Tokenization Factory',
      description: 'Transform any asset into standardized, tradeable tokens - from IP rights to commodities',
      icon: <FactoryIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32'
    },
    {
      title: 'Collateralized Swaps',
      description: 'Institutional-grade collateral backs every swap, preventing systemic risk',
      icon: <TreasuryIcon sx={{ fontSize: 32 }} />,
      color: '#6A1B9A'
    },
    {
      title: 'Liquidity Routing',
      description: 'Automated cross-chain pathfinding for seamless asset swaps across all classes',
      icon: <RouteIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32'
    },
    {
      title: 'Global Bartering Network',
      description: 'Peer-to-peer trades across all asset classes with built-in options and leverage',
      icon: <NetworkIcon sx={{ fontSize: 32 }} />,
      color: '#6A1B9A'
    },
    {
      title: 'Prediction Markets',
      description: 'Trade event outcomes like assets - from sports to politics to entertainment',
      icon: <PredictionIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32'
    },
    {
      title: 'Asset Tokenization',
      description: 'Convert real estate, music royalties, startup equity into liquid tokens',
      icon: <TokenIcon sx={{ fontSize: 32 }} />,
      color: '#6A1B9A'
    }
  ];

  const stats = [
    { label: 'Assets Tokenized', value: '15,234', icon: <TokenIcon />, color: '#2E7D32' },
    { label: 'Cross-Chain Swaps', value: '47.2K', icon: <SwapIcon />, color: '#6A1B9A' },
    { label: 'Total Volume', value: '$89.7M', icon: <ChartIcon />, color: '#2E7D32' },
    { label: 'Success Rate', value: '99.8%', icon: <StarIcon />, color: '#6A1B9A' }
  ];

  const assetExamples = [
    { name: 'Prediction Markets', icon: <PredictionIcon />, color: '#2E7D32' },
    { name: 'Real Estate', icon: <RealEstateIcon />, color: '#6A1B9A' },
    { name: 'Athletes / Artists', icon: <PersonIcon />, color: '#2E7D32' },
    { name: 'Startup Equity', icon: <DiamondIcon />, color: '#6A1B9A' },
    { name: 'Commodities', icon: <GoldBarsIcon />, color: '#2E7D32' },
    { name: 'Crypto', icon: <BitcoinIcon />, color: '#6A1B9A' },
    { name: 'User-Gen Tokens', icon: <TokenIcon />, color: '#2E7D32' },
    { name: 'Tokenized Securities', icon: <StockIcon />, color: '#6A1B9A' },
    { name: 'IP Rights', icon: <BuildIcon />, color: '#2E7D32' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#FFFFFF',
        position: 'relative'
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: 'white',
          color: '#2E7D32',
          py: { xs: 6, md: 10 },
          borderBottom: '2px solid #E0E0E0'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                  <Chip
                    label="Institutional-Grade Asset Tokenization Platform"
                    color="primary"
                    sx={{ 
                      mb: 4,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      background: '#2E7D32',
                      color: 'white',
                      border: '1px solid #2E7D32',
                      px: 3,
                      py: 1
                    }}
                  />
                  
                  {/* Logo Display */}
                  <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <img
                        src="/tea.png"
                        alt="tea_leaves Logo"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '12px',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                          border: '3px solid rgba(255, 255, 255, 0.8)'
                        }}
                      />
                    </motion.div>
                  </Box>

                  <Typography 
                    variant="h1" 
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      lineHeight: 1.1,
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
                    <Box component="span" sx={{ color: '#2E7D32' }}>_leaves</Box>
                  </Typography>
                  
                  <Typography 
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      color: '#2E7D32',
                      mb: 3,
                      textAlign: 'center',
                      fontStyle: 'italic',
                      opacity: 0.9
                    }}
                  >
                    "Tokenizing Every Asset, Reimagining Asset Classes"
                  </Typography>
                  
                  <Typography 
                    variant="h2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', md: '2rem', lg: '2.25rem' },
                      mb: 3,
                      textAlign: 'center',
                      color: '#2E7D32'
                    }}
                  >
                    Multi-Asset Bartering Exchange (BEX)
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#2E7D32',
                      opacity: 0.85,
                      maxWidth: '600px',
                      mx: 'auto'
                    }} 
                    paragraph
                  >
                    Enterprise-grade infrastructure for RWA tokenization.
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#2E7D32',
                      opacity: 0.85,
                      maxWidth: '600px',
                      mx: 'auto'
                    }} 
                    paragraph
                  >
                    <b>Asset class agnostic</b> where granular deep asset trading has real-time and reliable liquidity. 
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/token-factory')}
                      startIcon={<FactoryIcon />}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        background: '#6A1B9A',
                        borderRadius: '8px',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 16px rgba(106, 27, 154, 0.3)',
                        '&:hover': {
                          background: '#4A148C',
                          boxShadow: '0 6px 24px rgba(106, 27, 154, 0.4)',
                        }
                      }}
                    >
                      Create Token
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/provide-liquidity')}
                      sx={{ 
                        borderRadius: '8px',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: '#2E7D32',
                        color: '#2E7D32',
                        borderWidth: '2px',
                        '&:hover': {
                          borderColor: '#1B5E20',
                          background: 'rgba(46, 125, 50, 0.08)',
                          borderWidth: '2px'
                        }
                      }}
                    >
                      Yield Now...
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 5,
                    borderRadius: '12px',
                    background: 'white',
                    border: '2px solid #E0E0E0',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        textAlign: 'center', 
                        mb: 4,
                        fontWeight: 600,
                        color: '#2E7D32'
                      }}
                    >
                      Asset Classes Supported
                    </Typography>
                    <Grid container spacing={3}>
                      {assetExamples.map((asset, index) => (
                        <Grid item xs={6} md={4} key={index}>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 3,
                            borderRadius: '10px',
                            border: '1px solid #E0E0E0',
                            background: '#F8FFF8',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              borderColor: asset.color
                            }
                          }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                mx: 'auto',
                                mb: 2,
                                background: asset.color,
                                fontSize: '1.2rem'
                              }}
                            >
                              {asset.icon}
                            </Avatar>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                color: '#2E7D32',
                                fontSize: '0.875rem'
                              }}
                            >
                              {asset.name}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Liquidity Ecosystem Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{ 
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: 700,
                color: '#2E7D32',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              How It Works (Liquidity Ecosystem)
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#2E7D32',
                opacity: 0.85,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Institutions (<i>Whales</i>)and Retailers (<i>Minnows</i>) provide liquidity to power an exchange that undergirds a multi-token asset tokenization pipeline that supports and creates new assets dynamically.
            </Typography>
          </Box>

          {/* Liquidity Providers Grid */}
          <Grid container spacing={4}>
            {/* Whales - Institutions */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    color: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          mr: 3,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        <AccountBalance sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          🐋 Whales
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Institutional Liquidity
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, opacity: 0.95 }}>
                      Major financial institutions, hedge funds, and corporate treasuries provide deep liquidity 
                      pools that ensure stable pricing and enable large-scale asset tokenization.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      <Chip label="Deep Pools" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="Stable Pricing" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="Large Scale" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="Risk Management" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    </Box>
                    
                    <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
                      "Institutional capital provides the foundation for sustainable growth and market stability"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Minnows - Retailers */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                    color: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          mr: 3,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        <WalletIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          🐟 Minnows
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Retail Liquidity
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, opacity: 0.95 }}>
                      Individual investors, small businesses, and retail traders contribute diverse liquidity 
                      that democratizes access to asset tokenization and creates market depth.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      <Chip label="Diverse Access" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="Market Depth" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="Innovation" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="Community" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    </Box>
                    
                    <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
                      "Retail participation drives innovation and creates inclusive financial opportunities"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Infrastructure Connection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
                  border: '2px solid #2E7D32',
                  borderRadius: '20px',
                  p: 4,
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 600, mb: 2 }}>
                  🏗️ Infrastructure Power
                </Typography>
                <Typography variant="body1" sx={{ color: '#2E7D32', mb: 3, lineHeight: 1.6 }}>
                  Together, Whales and Minnows power the tea_leaves infrastructure, enabling:
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#2E7D32', borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                        Multi-token asset tokenization
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#2E7D32', borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                        Cross-chain liquidity routing
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#2E7D32', borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                        Institutional-grade security
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#2E7D32', borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                        Yield in the form of tokens, fiat, and/or stablecoins
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="body2" sx={{ color: '#2E7D32', opacity: 0.8, fontStyle: 'italic' }}>
                  "Liquidity is the steam of the tea_leaves ecosystem, powering the future of asset tokenization"
                </Typography>
              </Card>
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Enterprise Infrastructure Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{ 
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: 700,
                color: '#2E7D32',
                mb: 4,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Enterprise Infrastructure
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#2E7D32',
                opacity: 0.85,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              The exchange maintains and creates assets supported by in-flows (users) and out-flows (tea_leaves). 
              Institutions get access to user accounts on-rails, while retail users get opportunities to trade and earn.
            </Typography>
          </Box>

            {/* Pipeline Structure with Connected Nodes */}
            <Box sx={{ position: 'relative', mb: 4, minHeight: '400px' }}>
              {/* Node 1: Tokenization Factory */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '10%',
                      top: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      border: '5px solid white',
                      boxShadow: '0 10px 30px rgba(46, 125, 50, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                        boxShadow: '0 15px 40px rgba(46, 125, 50, 0.5)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FactoryIcon sx={{ fontSize: 42, color: 'white' }} />
                  </Box>
                  
                  {/* Node 1 Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '10%',
                      top: '70%',
                      transform: 'translate(-50%, 120px)',
                      width: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#2E7D32',
                        mb: 1,
                        fontSize: '1rem'
                      }}
                    >
                      Tokenization Factory
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2E7D32',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      Transform any asset into standardized, tradeable tokens
                    </Typography>
                  </Box>
                </motion.div>
              </Box>

              {/* Node 2: Collateralized Swaps */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '30%',
                      top: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                      border: '5px solid white',
                      boxShadow: '0 10px 30px rgba(106, 27, 154, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                        boxShadow: '0 15px 40px rgba(106, 27, 154, 0.5)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <TreasuryIcon sx={{ fontSize: 42, color: 'white' }} />
                  </Box>
                  
                  {/* Node 2 Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '30%',
                      top: '70%',
                      transform: 'translate(-50%, 120px)',
                      width: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#6A1B9A',
                        mb: 1,
                        fontSize: '1rem'
                      }}
                    >
                      Collateralized Swaps
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6A1B9A',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      Institutional-grade collateral backs every swap
                    </Typography>
                  </Box>
                </motion.div>
              </Box>

              {/* Node 3: Liquidity Routing */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      border: '5px solid white',
                      boxShadow: '0 10px 30px rgba(46, 125, 50, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                        boxShadow: '0 15px 40px rgba(46, 125, 50, 0.5)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <RouteIcon sx={{ fontSize: 42, color: 'white' }} />
                  </Box>
                  
                  {/* Node 3 Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '70%',
                      transform: 'translate(-50%, 120px)',
                      width: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#2E7D32',
                        mb: 1,
                        fontSize: '1rem'
                      }}
                    >
                      Liquidity Routing
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2E7D32',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      Automated cross-chain pathfinding for seamless swaps
                    </Typography>
                  </Box>
                </motion.div>
              </Box>

              {/* Node 4: Global Bartering Network */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '70%',
                      top: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                      border: '5px solid white',
                      boxShadow: '0 10px 30px rgba(106, 27, 154, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                        boxShadow: '0 15px 40px rgba(106, 27, 154, 0.5)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <NetworkIcon sx={{ fontSize: 42, color: 'white' }} />
                  </Box>
                  
                  {/* Node 4 Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '70%',
                      top: '70%',
                      transform: 'translate(-50%, 120px)',
                      width: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#6A1B9A',
                        mb: 1,
                        fontSize: '1rem'
                      }}
                    >
                      Global Bartering Network
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6A1B9A',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      Peer-to-peer trades across all asset classes
                    </Typography>
                  </Box>
                </motion.div>
              </Box>

              {/* Node 5: Asset Tokenization */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '90%',
                      top: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      border: '5px solid white',
                      boxShadow: '0 10px 30px rgba(46, 125, 50, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                        boxShadow: '0 15px 40px rgba(46, 125, 50, 0.5)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <TokenIcon sx={{ fontSize: 42, color: 'white' }} />
                  </Box>
                  
                  {/* Node 5 Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '90%',
                      top: '70%',
                      transform: 'translate(-50%, 120px)',
                      width: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#2E7D32',
                        mb: 1,
                        fontSize: '1rem'
                      }}
                    >
                      Asset Tokenization
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2E7D32',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      Convert real estate, music royalties, startup equity
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>

           
         </motion.div>
       </Container>

      {/* Participation Methods Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 0, md: 1 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 3,
                color: '#2E7D32',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Users Yield Liquidity (6 Ways)
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                fontWeight: 400, 
                color: '#2E7D32',
                opacity: 0.85,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}
            >
              Multiple pathways to engage with the{' '}
              <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
              <Box component="span" sx={{ fontStyle: 'italic' }}>_leaves</Box> ecosystem.{' '}
              Choose your preferred method of participation and start building the future of finance.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'Creator',
                description: 'Design custom tokens through our factory. Craft your pitch to the liquidity pool with an intuitive, AI-agent assisted system-prompt generator.',
                icon: <MagicIcon sx={{ fontSize: 32 }} />,
                color: '#6A1B9A'
              },
              {
                title: 'Leaderboard Warrior',
                description: 'Compete for the most liquid, creative, and lucrative tokens. Leaders are rewarded with TEALV tokens and deployment of their tokens.',
                icon: <StarIcon sx={{ fontSize: 32 }} />,
                color: '#2E7D32'
              },
              {
                title: 'Liquidity Provider',
                description: 'Provide liquidity, support the ecosystem, and earn from trading fees.',
                icon: <WaterIcon sx={{ fontSize: 32 }} />,
                color: '#6A1B9A'
              },
              {
                title: 'Custodian',
                description: 'Help new users onboard to the platform and custody their assets for more convenient transactions and safer asset management.',
                icon: <SecurityIcon sx={{ fontSize: 32 }} />,
                color: '#2E7D32'
              },
              {
                title: 'Developer',
                description: 'Make pull requests and return a yield of TEALV tokens as your contributions help to build the future of finance.',
                icon: <BuildIcon sx={{ fontSize: 32 }} />,
                color: '#2E7D32'
              },
              {
                title: 'Create Sub-Exchanges (Coming Soon)',
                description: 'Limit exposure, private networks, and testnet environments.',
                icon: <NetworkIcon sx={{ fontSize: 32 }} />,
                color: '#6A1B9A'
              }
            ].map((method, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        p: 4,
                        height: '100%',
                         borderRadius: '12px',
                         background: '#F8FFF8',
                         border: '1px solid #E0E0E0',
                         transition: 'all 0.3s ease',
                        '&:hover': {
                           boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                           borderColor: method.color,
                           transform: 'translateY(-4px)'
                        }
                      }}
                    >
                        <Avatar
                          sx={{
                          width: 72,
                          height: 72,
                            mb: 3,
                          background: method.color,
                          fontSize: '1.75rem',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                          }}
                        >
                        {method.icon}
                        </Avatar>
                        <Typography 
                        variant="h6" 
                          gutterBottom
                          sx={{
                          fontWeight: 600,
                          color: '#2E7D32',
                          mb: 2,
                          fontSize: '1.1rem',
                          lineHeight: 1.3
                        }}
                      >
                        {method.title}
                        </Typography>
                        <Typography 
                        variant="body2" 
                        sx={{ 
                          lineHeight: 1.6, 
                          fontWeight: 400, 
                          color: '#2E7D32',
                          opacity: 0.85,
                          fontSize: '1rem'
                        }}
                      >
                        {method.description}
                        </Typography>
                    </Card>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Token Launch Section */}
      <Box sx={{ py: 4 }}>
        <TokenLaunch />
      </Box>

      {/* CTA Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={8}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '16px',
              background: 'white',
              color: '#2E7D32',
              textAlign: 'center',
              border: '2px solid #E0E0E0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box>
              <Typography 
                variant="h3" 
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: '#2E7D32',
                  fontSize: { xs: '1.75rem', md: '2.5rem' }
                }}
              >
                Is Your Firm Ready to Support an Exchange?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5, 
                  opacity: 0.9, 
                  fontWeight: 400, 
                  color: '#2E7D32',
                  lineHeight: 1.6,
                  maxWidth: '700px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.125rem' }
                }}
              >
                Join leading institutions leveraging <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box><Box component="span">_leaves</Box> to forerun the future of finance.
              </Typography>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/token-factory')}
                  startIcon={<PlayIcon />}
                  sx={{
                    background: '#2E7D32',
                    borderRadius: '8px',
                    px: 8,
                    py: 2.5,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      background: '#1B5E20',
                      boxShadow: '0 6px 24px rgba(46, 125, 50, 0.4)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home; 