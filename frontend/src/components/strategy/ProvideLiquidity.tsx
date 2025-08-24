import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Chip,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Water as WaterIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Build as BuildIcon,
  NetworkCheck as NetworkIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as TreasuryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import LiquidityProviderAgentsPage from './LiquidityProviderAgentsPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`liquidity-tabpanel-${index}`}
      aria-labelledby={`liquidity-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProvideLiquidity: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<any>({});
  const [systemPrompt, setSystemPrompt] = useState('');
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [githubLinkOpen, setGithubLinkOpen] = useState(false);
  const [showAgents, setShowAgents] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Workflow functions
  const openWorkflow = (method: any) => {
    setSelectedMethod(method);
    setWorkflowOpen(true);
    setCurrentStep(0);
    setWorkflowData({});
    setSystemPrompt('');
  };

  const closeWorkflow = () => {
    setWorkflowOpen(false);
    setSelectedMethod(null);
    setCurrentStep(0);
    setWorkflowData({});
    setSystemPrompt('');
  };

  const handleChooseToken = () => {
    // Show empty vault message
    alert('Your vault is empty. Please create a token first using the Token Factory.');
  };

  const handleNext = () => {
    if (currentStep < workflowConfigs[selectedMethod.id as keyof typeof workflowConfigs].steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateSystemPrompt();
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStepDataChange = (field: string, value: string) => {
    setWorkflowData({
      ...workflowData,
      [field]: value
    });
  };

  const generateSystemPrompt = () => {
    const config = workflowConfigs[selectedMethod.id as keyof typeof workflowConfigs];
    let prompt = `You are a tea-leaves liquidity expert helping a user set up as a ${selectedMethod.title}.\n\n`;
    prompt += `User Configuration:\n`;
    
    config.steps.forEach(step => {
      const value = workflowData[step.field];
      if (value) {
        prompt += `- ${step.label}: ${value}\n`;
      }
    });
    
    prompt += `\nPlease provide a comprehensive setup guide including:\n`;
    prompt += `1. Step-by-step implementation process\n`;
    prompt += `2. Required tools and resources\n`;
    prompt += `3. Risk considerations and mitigation strategies\n`;
    prompt += `4. Expected rewards and timeline\n`;
    prompt += `5. Best practices and optimization tips\n`;
    
    setSystemPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(systemPrompt);
  };

  // Workflow configuration for each liquidity method
  const workflowConfigs = {
    'leaderboard': {
      title: 'Leaderboard Warrior Setup',
      steps: [
        {
          label: 'Trading Strategy',
          field: 'strategy',
          options: ['Momentum Trading', 'Mean Reversion', 'Arbitrage', 'Trend Following', 'Contrarian'],
          description: 'Select your preferred trading approach'
        },
        {
          label: 'Risk Tolerance',
          field: 'riskLevel',
          options: ['Conservative', 'Moderate', 'Aggressive', 'High Risk'],
          description: 'Choose your risk appetite level'
        },
        {
          label: 'Asset Focus',
          field: 'assetFocus',
          options: ['Crypto Only', 'Mixed Assets', 'Real Estate Tokens', 'Commodities', 'Startup Equity'],
          description: 'Select your preferred asset classes'
        },
        {
          label: 'Time Horizon',
          field: 'timeHorizon',
          options: ['Short-term (Days)', 'Medium-term (Weeks)', 'Long-term (Months)', 'Flexible'],
          description: 'Define your investment timeline'
        }
      ]
    },
    'liquidity-provider': {
      title: 'Liquidity Provider Setup',
      steps: [
        {
          label: 'Pool Type',
          field: 'poolType',
          options: ['Stable Pairs', 'Volatile Pairs', 'Single Asset', 'Multi-Asset', 'Custom'],
          description: 'Select the type of liquidity pool'
        },
        {
          label: 'Capital Amount',
          field: 'capitalAmount',
          options: ['$1K - $10K', '$10K - $100K', '$100K - $1M', '$1M+', 'Variable'],
          description: 'Choose your capital commitment range'
        },
        {
          label: 'Fee Structure',
          field: 'feeStructure',
          options: ['Standard (0.3%)', 'High Fee (1%)', 'Low Fee (0.1%)', 'Dynamic', 'Custom'],
          description: 'Select your preferred fee structure'
        },
        {
          label: 'Lock Period',
          field: 'lockPeriod',
          options: ['No Lock', '30 Days', '90 Days', '180 Days', '1 Year'],
          description: 'Choose your liquidity lock period'
        }
      ]
    },
    'custodian': {
      title: 'Custodian Setup',
      steps: [
        {
          label: 'Verification Level',
          field: 'verificationLevel',
          options: ['Basic KYC', 'Enhanced KYC', 'Institutional KYC', 'Custom'],
          description: 'Select your verification requirements'
        },
        {
          label: 'User Type',
          field: 'userType',
          options: ['Retail Users', 'Institutional Users', 'Mixed', 'Enterprise Only'],
          description: 'Choose your target user base'
        },
        {
          label: 'Service Scope',
          field: 'serviceScope',
          options: ['Wallet Management', 'Asset Custody', 'Trading Support', 'Full Service'],
          description: 'Define your service offerings'
        },
        {
          label: 'Geographic Focus',
          field: 'geographicFocus',
          options: ['Global', 'North America', 'Europe', 'Asia Pacific', 'Custom Regions'],
          description: 'Select your service regions'
        }
      ]
    },
    'staking-validator': {
      title: 'Staking Validator Setup',
      steps: [
        {
          label: 'Stake Amount',
          field: 'stakeAmount',
          options: ['Minimum (1,000 TEALV)', 'Standard (10,000 TEALV)', 'Large (100,000 TEALV)', 'Whale (1M+ TEALV)'],
          description: 'Choose your staking commitment'
        },
        {
          label: 'Validation Type',
          field: 'validationType',
          options: ['Transaction Validation', 'Block Validation', 'Smart Contract Validation', 'Cross-chain Validation'],
          description: 'Select your validation focus'
        },
        {
          label: 'Uptime Commitment',
          field: 'uptimeCommitment',
          options: ['99% Uptime', '99.5% Uptime', '99.9% Uptime', '24/7 Operation'],
          description: 'Define your availability commitment'
        },
        {
          label: 'Reward Preference',
          field: 'rewardPreference',
          options: ['TEALV Tokens', 'Transaction Fees', 'Mixed Rewards', 'Custom Split'],
          description: 'Choose your reward structure'
        }
      ]
    },
    'developer': {
      title: 'Developer Setup',
      steps: [
        {
          label: 'Development Area',
          field: 'developmentArea',
          options: ['Smart Contracts', 'Frontend UI', 'Backend APIs', 'Integration Tools', 'Security Features'],
          description: 'Select your development focus'
        },
        {
          label: 'Programming Language',
          field: 'programmingLanguage',
          options: ['Solidity', 'Rust', 'TypeScript/JavaScript', 'Python', 'Go', 'Multiple'],
          description: 'Choose your preferred languages'
        },
        {
          label: 'Project Scope',
          field: 'projectScope',
          options: ['Bug Fixes', 'Feature Development', 'Complete Module', 'Integration', 'Custom Project'],
          description: 'Define your project scope'
        },
        {
          label: 'Timeline',
          field: 'timeline',
          options: ['1-2 Weeks', '1 Month', '2-3 Months', 'Ongoing', 'Flexible'],
          description: 'Set your development timeline'
        }
      ]
    }
  };

  const liquidityMethods = [
    {
      id: 'leaderboard',
      title: 'Leaderboard Warrior',
      description: 'Compete for the most liquid, creative and lucrative tokens',
      icon: <StarIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32',
      status: 'active',
      requirements: 'Competitive spirit',
      rewards: 'Weekly TEALV rewards + recognition',
      customContent: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 2, fontStyle: 'italic' }}>
            Deploy your token to our testnet and climb the leaderboard.
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleChooseToken()}
            sx={{
              bgcolor: '#FFD700',
              color: '#000',
              '&:hover': { bgcolor: '#FFD700', opacity: 0.9 }
            }}
          >
            Choose Your Token
          </Button>
        </Box>
      )
    },
    {
      id: 'liquidity-provider',
      title: 'Liquidity Provider',
      description: 'Provide liquidity and earn from trading fees',
      icon: <WaterIcon sx={{ fontSize: 32 }} />,
      color: '#6A1B9A',
      status: 'active',
      requirements: 'Asset deposits',
      rewards: '0.3% trading fees + TEALV rewards'
    },
    {
      id: 'custodian',
      title: 'Custodian',
      description: 'Participate in our buddy system for new users',
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32',
      status: 'active',
      requirements: 'KYC verification',
      rewards: 'Monthly TEALV + referral bonuses'
    },
    {
      id: 'staking-validator',
      title: 'Staking Validator',
      description: 'Stake TEALV tokens to validate transactions and earn',
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      color: '#6A1B9A',
      status: 'active',
      requirements: 'TEALV token holdings',
      rewards: 'Staking rewards + transaction fees'
    },
    {
      id: 'developer',
      title: 'Developer',
      description: 'Make pull requests for TEALV token rewards',
      icon: <BuildIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32',
      status: 'active',
      requirements: 'Coding skills',
      rewards: 'TEALV tokens per PR'
    },
    {
      id: 'sub-exchange',
      title: 'Create Sub-Exchanges',
      description: 'Limit exposure, private networks, and testnet environments',
      icon: <NetworkIcon sx={{ fontSize: 32 }} />,
      color: '#6A1B9A',
      status: 'coming-soon',
      requirements: 'Enterprise partnership',
      rewards: 'Revenue sharing + TEALV rewards'
    }
  ];

  const activeOpportunities = [
    {
      id: 1,
      type: 'Liquidity Pool',
      asset: 'REAL-ESTATE-TOKENS',
      apy: '12.5%',
      tvl: '$2.4M',
      status: 'Open'
    },
    {
      id: 2,
      type: 'Staking Program',
      asset: 'TEALV-TOKENS',
      apy: '18.2%',
      tvl: '$890K',
      status: 'Open'
    },
    {
      id: 3,
      type: 'Validator Network',
      asset: 'TRANSACTION-FEES',
      apy: '22.1%',
      tvl: '$1.6M',
      status: 'Limited'
    }
  ];

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
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{ 
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: 700,
                color: '#2E7D32',
                mb: 3
              }}
            >
              Provide Liquidity
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2E7D32',
                opacity: 0.8,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Choose your preferred method of participation and start earning liquidity rewards in the{' '}
              <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
              <Box component="span" sx={{ fontStyle: 'italic' }}>_leaves</Box> ecosystem
            </Typography>
          </Box>
        </motion.div>

        {/* Liquidity Methods Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {liquidityMethods.map((method, index) => (
            <Grid item xs={12} md={6} lg={4} key={method.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    border: `2px solid ${method.color}`,
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 48px rgba(0,0,0,0.15)`,
                      borderWidth: '3px'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          background: method.color,
                          fontSize: '2rem'
                        }}
                      >
                        {method.icon}
                      </Avatar>
                      <Chip
                        label={method.status === 'active' ? 'Active' : 
                               method.status === 'pending' ? 'Pending' : 'Coming Soon'}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: method.status === 'active' ? '#4CAF50' : 
                                   method.status === 'pending' ? '#FF9800' : '#9E9E9E',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: method.color,
                        mb: 2
                      }}
                    >
                      {method.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2E7D32',
                        mb: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {method.description}
                    </Typography>

                    <Box sx={{ textAlign: 'left', mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32', mb: 1 }}>
                        Requirements:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2E7D32', opacity: 0.8, mb: 2 }}>
                        {method.requirements}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32', mb: 1 }}>
                        Rewards:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2E7D32', opacity: 0.8 }}>
                        {method.rewards}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        if (method.id === 'sub-exchange') {
                          setComingSoonOpen(true);
                        } else if (method.id === 'developer') {
                          setGithubLinkOpen(true);
                        } else if (method.id === 'liquidity-provider') {
                          setShowAgents(true);
                        }
                        else {
                          openWorkflow(method);
                        }
                      }}
                      sx={{
                        bgcolor: method.color,
                        '&:hover': { bgcolor: method.color, opacity: 0.9 },
                        '&:disabled': { bgcolor: '#9E9E9E' }
                      }}
                    >
                      {method.status === 'active' ? 'Start Earning' : 
                       method.status === 'pending' ? 'Apply Now' : 'Coming Soon'}
                    </Button>

                    {/* Custom Content for specific methods */}
                    {method.customContent && method.customContent}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Active Opportunities */}
        <Card sx={{ borderRadius: '16px', border: '2px solid #E0E0E0' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 600, mb: 3 }}>
              🚀 Active Liquidity Opportunities
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List>
              {activeOpportunities.map((opp) => (
                <ListItem key={opp.id} divider sx={{ borderRadius: '8px', mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2E7D32' }}>
                      <TrendingUpIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={opp.type}
                    secondary={`${opp.asset} • TVL: ${opp.tvl}`}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                      {opp.apy} APY
                    </Typography>
                    <Chip 
                      label={opp.status} 
                      color={opp.status === 'Open' ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>

      {/* Workflow Modal */}
      <Dialog 
        open={workflowOpen} 
        onClose={closeWorkflow}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#2E7D32',
          fontWeight: 600
        }}>
          {selectedMethod && workflowConfigs[selectedMethod.id as keyof typeof workflowConfigs]?.title}
          <IconButton onClick={closeWorkflow} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedMethod && (
            <Box>
              {!systemPrompt ? (
                <Stepper activeStep={currentStep} orientation="vertical">
                  {workflowConfigs[selectedMethod.id as keyof typeof workflowConfigs].steps.map((step, index) => (
                    <Step key={index}>
                      <StepLabel sx={{ color: '#2E7D32', fontWeight: 600 }}>
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" sx={{ color: '#2E7D32', mb: 2, opacity: 0.8 }}>
                          {step.description}
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                          <InputLabel>Select Option</InputLabel>
                          <Select
                            value={workflowData[step.field] || ''}
                            onChange={(e) => handleStepDataChange(step.field, e.target.value)}
                            label="Select Option"
                            sx={{ bgcolor: 'white' }}
                          >
                            {step.options.map((option, optIndex) => (
                              <MenuItem key={optIndex} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!workflowData[step.field]}
                            sx={{
                              bgcolor: '#2E7D32',
                              '&:hover': { bgcolor: '#2E7D32', opacity: 0.9 },
                              '&:disabled': { bgcolor: '#9E9E9E' }
                            }}
                          >
                            {index === workflowConfigs[selectedMethod.id as keyof typeof workflowConfigs].steps.length - 1 ? 'Generate Prompt' : 'Next'}
                          </Button>
                          {index > 0 && (
                            <Button
                              onClick={handleBack}
                              sx={{ ml: 1, color: '#2E7D32' }}
                            >
                              Back
                            </Button>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              ) : (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    System prompt generated successfully! Copy this prompt and use it with your preferred AI assistant.
                  </Alert>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={systemPrompt}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputProps={{
                      readOnly: true,
                      sx: { bgcolor: 'white' }
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={copyToClipboard}
                      sx={{ bgcolor: '#6A1B9A' }}
                    >
                      Copy to Clipboard
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setSystemPrompt('')}
                      sx={{ color: '#2E7D32', borderColor: '#2E7D32' }}
                    >
                      Generate New Prompt
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeWorkflow} sx={{ color: '#2E7D32' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Coming Soon Dialog */}
      <Dialog
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#6A1B9A',
          fontWeight: 600
        }}>
          Coming Soon!
          <IconButton onClick={() => setComingSoonOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#6A1B9A', textAlign: 'center', mb: 2 }}>
            This feature is currently under development.
          </Typography>
          <Typography variant="body2" sx={{ color: '#6A1B9A', opacity: 0.8 }}>
            We are working hard to bring this exciting opportunity to you. Stay tuned!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setComingSoonOpen(false)} sx={{ color: '#6A1B9A' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* GitHub Link Dialog */}
      <Dialog
        open={githubLinkOpen}
        onClose={() => setGithubLinkOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#2E7D32',
          fontWeight: 600
        }}>
          Developer Contribution
          <IconButton onClick={() => setGithubLinkOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#2E7D32', textAlign: 'center', mb: 2 }}>
            Ready to contribute to{' '}
            <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
            <Box component="span" sx={{ fontStyle: 'italic' }}>_leaves</Box>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#2E7D32', opacity: 0.8, mb: 3 }}>
            Visit our GitHub repository to start contributing code, report issues, or submit pull requests. 
            Earn TEALV tokens for your contributions!
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              href="https://github.com/philipjpark/tea_leaves"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#2E7D32', opacity: 0.9 }
              }}
            >
              Open GitHub Repository
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setGithubLinkOpen(false)} sx={{ color: '#2E7D32' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

                 {/* Liquidity Provider Agents Page */}
           <LiquidityProviderAgentsPage 
             open={showAgents} 
             onComplete={(results) => {
               console.log('Liquidity provider agents completed:', results);
               setShowAgents(false);
             }}
             onClose={() => setShowAgents(false)} 
           />
    </Box>
  );
};

export default ProvideLiquidity; 