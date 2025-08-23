import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LocalCafe as TeaCupIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Handshake as HandshakeIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';

const WhatsInAName: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 4,
                  background: 'linear-gradient(135deg, #6A1B9A 0%, #2E7D32 100%)',
                  border: '4px solid white',
                  boxShadow: '0 8px 32px rgba(106, 27, 154, 0.3)'
                }}
              >
                <TeaCupIcon sx={{ fontSize: 60, color: 'white' }} />
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
              What's in a Name?
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
              The story behind <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic', fontWeight: 600 }}>tea</Box>
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 600 }}>_leaves</Box> and why it represents the future of finance
            </Typography>
          </Box>

          {/* Main Content Grid */}
          <Grid container spacing={6}>
            {/* Left Column - The Acronym */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card sx={{ 
                  height: '100%',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
                  border: '2px solid #E8F5E8',
                  boxShadow: '0 12px 40px rgba(46, 125, 50, 0.15)',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 3,
                          background: 'linear-gradient(135deg, #6A1B9A 0%, #4CAF50 100%)',
                          boxShadow: '0 6px 20px rgba(106, 27, 154, 0.3)'
                        }}
                      >
                        <TrendingUpIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Avatar>
                      
                      <Typography variant="h4" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700, 
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        The Acronym
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h3" sx={{ 
                        color: '#6A1B9A', 
                        fontWeight: 800, 
                        textAlign: 'center',
                        mb: 3,
                        textShadow: '0 2px 4px rgba(106, 27, 154, 0.2)'
                      }}>
                        T.E.A.
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ 
                          color: '#2E7D32', 
                          fontWeight: 600, 
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Chip label="T" size="small" sx={{ 
                            background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem'
                          }} />
                          Tokenizing
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', ml: 6 }}>
                          Converting real-world assets into digital tokens
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ 
                          color: '#2E7D32', 
                          fontWeight: 600, 
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Chip label="E" size="small" sx={{ 
                            background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem'
                          }} />
                          Every
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', ml: 6 }}>
                          No asset class is off-limits - from real estate to music royalties
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ 
                          color: '#2E7D32', 
                          fontWeight: 600, 
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Chip label="A" size="small" sx={{ 
                            background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem'
                          }} />
                          Asset
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', ml: 6 }}>
                          Creating a unified ecosystem for all tradable value
                        </Typography>
                      </Box>
                    </Box>

                    <Paper sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, #F3E5F5 0%, #E8F5E8 100%)',
                      border: '1px solid #E1BEE7',
                      borderRadius: '16px'
                    }}>
                      <Typography variant="body1" sx={{ 
                        color: '#6A1B9A', 
                        fontStyle: 'italic',
                        textAlign: 'center',
                        fontWeight: 500
                      }}>
                        "We're not just tokenizing assets - we're democratizing access to every form of value in the world."
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Right Column - The Folklore */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card sx={{ 
                  height: '100%',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
                  border: '2px solid #E8F5E8',
                  boxShadow: '0 12px 40px rgba(46, 125, 50, 0.15)',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 3,
                          background: 'linear-gradient(135deg, #6A1B9A 0%, #4CAF50 100%)',
                          boxShadow: '0 6px 20px rgba(106, 27, 154, 0.3)'
                        }}
                      >
                        <PsychologyIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Avatar>
                      
                      <Typography variant="h4" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 700, 
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        The Folklore
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ 
                      color: '#666', 
                      mb: 4, 
                      lineHeight: 1.8,
                      fontSize: '1.1rem'
                    }}>
                      Throughout history, tea leaves have been used as a mystical tool for divination - 
                      a way to peer into the future and understand what lies ahead. Ancient cultures 
                      from China to England practiced the art of tasseography, reading patterns in 
                      tea leaves to predict fortunes and guide decisions.
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 600, 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <SparkleIcon sx={{ color: '#6A1B9A' }} />
                        The Ancient Practice
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        • Chinese tea ceremonies dating back to the Tang Dynasty
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        • European fortune-telling traditions in the 17th century
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        • Middle Eastern mystical practices and symbolism
                      </Typography>
                    </Box>

                    <Paper sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, #E8F5E8 0%, #F3E5F5 100%)',
                      border: '1px solid #A5D6A7',
                      borderRadius: '16px'
                    }}>
                      <Typography variant="body1" sx={{ 
                        color: '#2E7D32', 
                        fontStyle: 'italic',
                        textAlign: 'center',
                        fontWeight: 500
                      }}>
                        "Just as tea leaves reveal hidden patterns, we're revealing the hidden value in every asset."
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Bridge Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Box sx={{ mt: 8, mb: 6 }}>
              <Card sx={{ 
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #6A1B9A 0%, #2E7D32 100%)',
                border: 'none',
                boxShadow: '0 16px 48px rgba(106, 27, 154, 0.3)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3
                }} />
                
                <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 3,
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                      }}
                    >
                      <HandshakeIcon sx={{ fontSize: 50, color: 'white' }} />
                    </Avatar>
                    
                    <Typography variant="h3" sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      mb: 3,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      Bridging Web2 & Web3
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    mb: 4, 
                    lineHeight: 1.8,
                    textAlign: 'center',
                    opacity: 0.95
                  }}>
                    The future of finance isn't just about blockchain technology - it's about creating 
                    a seamless bridge between traditional financial systems and the decentralized world. 
                    With the help of the most popular drink in the world... <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 600 }}>tea</Box> 🍵
                  </Typography>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 3,
                      opacity: 0.9
                    }}>
                      Join Our Community
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      color: 'white', 
                      opacity: 0.85,
                      maxWidth: '600px',
                      mx: 'auto',
                      lineHeight: 1.7
                    }}>
                      We're building more than a platform - we're creating a movement. A movement that 
                      brings together traditional finance, DeFi, and the wisdom of ages to create a 
                      financial system that works for everyone. Where every asset has a voice, and 
                      every prediction becomes a possibility.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Paper sx={{ 
                p: 4, 
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
                  Ready to Shape the Future?
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: '#666', 
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  The leaves are speaking, and they're telling us that the future of finance is here. 
                  Will you join us in this journey?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label="🍵 Token Factory" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 2,
                      py: 1
                    }} 
                  />
                  <Chip 
                    label="💧 Provide Liquidity" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 2,
                      py: 1
                    }} 
                  />
                                     <Chip 
                     label="🏆 Trad Fin on Rails" 
                     sx={{ 
                       background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                       color: 'white',
                       fontWeight: 600,
                       fontSize: '1rem',
                       px: 2,
                       py: 1
                     }} 
                   />
                </Box>
              </Paper>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WhatsInAName; 