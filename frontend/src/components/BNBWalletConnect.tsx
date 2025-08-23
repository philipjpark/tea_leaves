import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar,
  Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AccountBalanceWallet as WalletIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import bnbService from '../services/bnbService';

interface BNBWalletConnectProps {
  onConnect?: (address: string) => void;
  onClose?: () => void;
  variant?: 'default' | 'navbar';
}

const BNBWalletConnect: React.FC<BNBWalletConnectProps> = ({ onConnect, onClose, variant }) => {
  const [open, setOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const topBNBWallets = [
    {
      name: 'MetaMask',
      description: 'Most popular Web3 wallet for BNB Chain',
      icon: '🦊',
      color: '#2E7D32',
      installUrl: 'https://metamask.io/',
      isInstalled: true
    },
    {
      name: 'WalletConnect',
      description: 'Connect any wallet to BNB Chain',
      icon: '🔗',
      color: '#6A1B9A',
      installUrl: 'https://walletconnect.com/',
      isInstalled: true
    },
    {
      name: 'Trust Wallet',
      description: 'Binance\'s official mobile wallet',
      icon: '🛡️',
      color: '#2E7D32',
      installUrl: 'https://trustwallet.com/',
      isInstalled: true
    }
  ];

  const handleWalletSelect = async (wallet: any) => {
    setIsConnecting(true);
    try {
      const address = await bnbService.connectWallet();
      if (onConnect) {
        onConnect(address);
      }
      setOpen(false);
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      // If MetaMask is not installed, redirect to install page
      if (wallet.name === 'MetaMask' && error.message.includes('MetaMask not detected')) {
        window.open(wallet.installUrl, '_blank');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInstallWallet = (installUrl: string) => {
    window.open(installUrl, '_blank');
  };

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <Box>
      <Button
        variant="contained"
        size={variant === 'navbar' ? "medium" : "large"}
        data-wallet-connect
        sx={{
          bgcolor: variant === 'navbar' ? 'rgba(255, 255, 255, 0.15)' : '#2E7D32',
          color: variant === 'navbar' ? 'white' : 'white',
          px: variant === 'navbar' ? 2.5 : 4,
          py: variant === 'navbar' ? 1 : 1.5,
          borderRadius: variant === 'navbar' ? '6px' : '6px',
          fontSize: variant === 'navbar' ? '0.875rem' : '1rem',
          fontWeight: 600,
          border: variant === 'navbar' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          '&:hover': {
            bgcolor: variant === 'navbar' ? 'rgba(255, 255, 255, 0.25)' : '#1B5E20',
            transform: variant === 'navbar' ? 'none' : 'translateY(-1px)',
            boxShadow: variant === 'navbar' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(46, 125, 50, 0.3)',
            border: variant === 'navbar' ? '1px solid rgba(255, 255, 255, 0.5)' : 'none'
          },
          transition: 'all 0.2s ease'
        }}
        onClick={openDialog}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      {/* Wallet Selection Dialog */}
      <Dialog 
        open={open} 
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            background: 'white',
            border: '1px solid #E0E0E0'
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            color: '#1A1A1A',
            pb: 1
          }}
        >
          Connect to BNB Chain
        </DialogTitle>
        
        <DialogContent>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              fontWeight: 400
            }}
          >
            Choose your wallet to start trading on BNB Chain
          </Typography>
          
          <List sx={{ p: 0 }}>
            {topBNBWallets.map((wallet, index) => (
              <motion.div
                key={wallet.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: '8px',
                    background: 'white',
                    border: '1px solid #E0E0E0',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItem 
                    disablePadding
                    sx={{ p: 0 }}
                  >
                    <ListItemButton
                      onClick={() => handleWalletSelect(wallet)}
                      disabled={isConnecting}
                      sx={{
                        p: 3,
                        '&:hover': {
                          background: 'rgba(46, 125, 50, 0.05)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: wallet.color,
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {wallet.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#1A1A1A'
                            }}
                          >
                            {wallet.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 400 }}
                          >
                            {wallet.description}
                          </Typography>
                        }
                      />
                      {wallet.isInstalled ? (
                        <CheckCircleIcon 
                          sx={{ 
                            color: '#2E7D32',
                            fontSize: 24
                          }} 
                        />
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstallWallet(wallet.installUrl);
                          }}
                          sx={{
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            px: 2,
                            py: 0.5,
                            borderColor: wallet.color,
                            color: wallet.color,
                            fontWeight: 600,
                            '&:hover': {
                              background: `${wallet.color}10`,
                              borderColor: wallet.color
                            }
                          }}
                        >
                          Install
                        </Button>
                      )}
                    </ListItemButton>
                  </ListItem>
                </Paper>
              </motion.div>
            ))}
          </List>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              Don't have a wallet? 
              <Button
                variant="text"
                size="small"
                sx={{
                  ml: 1,
                  color: '#6A1B9A',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'rgba(106, 27, 154, 0.1)'
                  }
                }}
                onClick={() => window.open('https://metamask.io/', '_blank')}
              >
                Learn more
              </Button>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BNBWalletConnect; 