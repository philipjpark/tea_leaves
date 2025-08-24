import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Paper
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  WaterDrop as WaterDropIcon,
  Build as BuildIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Leaderboard as LeaderboardIcon,
  Security as SecurityIcon,
  LocalCafe as TeaCupIcon
} from '@mui/icons-material';
import BNBWalletConnect from './BNBWalletConnect';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const navItems = [
    {
      path: '/token-factory',
      label: 'Token Factory',
      icon: <BuildIcon sx={{ fontSize: 18 }} />,
      badge: 'NEW'
    },
    
    {
      path: '/provide-liquidity',
      label: 'Provide Liquidity',
      icon: <WaterDropIcon sx={{ fontSize: 18 }} />,
      badge: null
    },
    {
      path: '/leaderboard',
      label: 'Leaderboard',
      icon: <LeaderboardIcon sx={{ fontSize: 18 }} />,
      badge: null
    },
    {
      path: '/whats-in-a-name',
      label: "What's in a Name",
      icon: <TeaCupIcon sx={{ fontSize: 18 }} />,
      badge: null
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        boxShadow: '0 2px 12px rgba(46, 125, 50, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                mr: 4
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  mr: 2,
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}
              >
                <TeaCupIcon sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '0.5px'
                }}
              >
                <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
                <Box component="span" sx={{ color: 'white' }}>_leaves</Box>
              </Typography>
            </Box>
          </motion.div>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1 }}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    position: 'relative',
                    borderRadius: '6px',
                    px: 2.5,
                    py: 1,
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    background: isActive(item.path) 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'transparent',
                    border: isActive(item.path) 
                      ? '1px solid rgba(255, 255, 255, 0.3)' 
                      : '1px solid transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={() => setHoveredButton(item.path)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {item.label}
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        ml: 1,
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        background: '#6A1B9A',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 0.5
                        }
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </Box>

          {/* Wallet Connect */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <BNBWalletConnect variant="navbar" />
          </motion.div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 