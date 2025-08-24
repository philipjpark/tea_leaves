import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Avatar,
  Paper,
  Divider,
  Alert,
  FormHelperText,
  InputAdornment,
  Slider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Launch as LaunchIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface LiquidityProviderFormData {
  // Personal Information
  entityType: 'individual' | 'corporate' | 'institution';
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  investmentHorizon: 'short-term' | 'medium-term' | 'long-term';
  
  // Financial Profile
  totalAssets: string;
  liquidAssets: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  monthlyIncome: string;
  
  // Liquidity Strategy
  preferredTokens: string[];
  poolTypes: 'stable' | 'volatile' | 'mixed';
  liquidityAmount: string;
  yieldExpectation: string;
  
  // Whale vs Minnow Dynamics
  positionSize: 'minnow' | 'small-fish' | 'medium-fish' | 'whale';
  marketImpact: 'low' | 'medium' | 'high';
  slippageTolerance: 'low' | 'medium' | 'high';
  
  // Compliance & Legal
  jurisdiction: string;
  taxStatus: 'domestic' | 'international' | 'tax-exempt';
  regulatoryCompliance: boolean;
  
  // Technical Preferences
  preferredChains: string[];
  automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
  monitoringFrequency: 'real-time' | 'daily' | 'weekly';
  
  // Risk Management
  stopLossPercentage: number;
  diversificationLevel: 'concentrated' | 'balanced' | 'diversified';
  insuranceCoverage: boolean;
  

}

const LiquidityProviderFlow: React.FC<{
  onComplete: (data: LiquidityProviderFormData) => void;
  onClose: () => void;
}> = ({ onComplete, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<LiquidityProviderFormData>({
    entityType: 'individual',
    experienceLevel: 'beginner',
    investmentHorizon: 'medium-term',
    totalAssets: '',
    liquidAssets: '',
    riskTolerance: 'moderate',
    monthlyIncome: '',
    preferredTokens: [],
    poolTypes: 'mixed',
    liquidityAmount: '',
    yieldExpectation: '',
    positionSize: 'minnow',
    marketImpact: 'low',
    slippageTolerance: 'low',
    jurisdiction: '',
    taxStatus: 'domestic',
    regulatoryCompliance: false,
    preferredChains: [],
    automationLevel: 'semi-automated',
    monitoringFrequency: 'daily',
    stopLossPercentage: 10,
    diversificationLevel: 'balanced',
    insuranceCoverage: false
  });

  const steps = [
    {
      label: 'Entity Profile',
      description: 'Basic information about who you are and your experience level',
      icon: <PersonIcon />
    },
    {
      label: 'Financial Profile',
      description: 'Your financial situation and risk tolerance',
      icon: <MoneyIcon />
    },
    {
      label: 'Liquidity Strategy',
      description: 'How you want to provide liquidity and your expectations',
      icon: <TrendingUpIcon />
    },
    {
      label: 'Whale vs Minnow Dynamics',
      description: 'Understanding your position size and market impact',
      icon: <AssessmentIcon />
    },
    {
      label: 'Compliance & Legal',
      description: 'Regulatory and legal considerations',
      icon: <SecurityIcon />
    },
    {
      label: 'Technical Preferences',
      description: 'Blockchain and automation preferences',
      icon: <BusinessIcon />
    },
    {
      label: 'Risk Management',
      description: 'How you want to manage and protect your investments',
      icon: <TimelineIcon />
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const updateFormData = (field: keyof LiquidityProviderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return formData.entityType && formData.experienceLevel && formData.investmentHorizon;
      case 1:
        return formData.totalAssets && formData.liquidAssets && formData.riskTolerance && formData.monthlyIncome;
      case 2:
        return formData.preferredTokens.length > 0 && formData.poolTypes && formData.liquidityAmount && formData.yieldExpectation;
      case 3:
        return formData.positionSize && formData.marketImpact && formData.slippageTolerance;
      case 4:
        return formData.jurisdiction && formData.taxStatus;
      case 5:
        return formData.preferredChains.length > 0 && formData.automationLevel && formData.monitoringFrequency;
      case 6:
        return formData.stopLossPercentage > 0 && formData.diversificationLevel;
      default:
        return false;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={formData.entityType}
                  onChange={(e) => updateFormData('entityType', e.target.value)}
                  label="Entity Type"
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                  <MenuItem value="institution">Financial Institution</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={formData.experienceLevel}
                  onChange={(e) => updateFormData('experienceLevel', e.target.value)}
                  label="Experience Level"
                >
                  <MenuItem value="beginner">Beginner (0-1 years)</MenuItem>
                  <MenuItem value="intermediate">Intermediate (1-3 years)</MenuItem>
                  <MenuItem value="expert">Expert (3+ years)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Investment Horizon</InputLabel>
                <Select
                  value={formData.investmentHorizon}
                  onChange={(e) => updateFormData('investmentHorizon', e.target.value)}
                  label="Investment Horizon"
                >
                  <MenuItem value="short-term">Short-term (0-1 years)</MenuItem>
                  <MenuItem value="medium-term">Medium-term (1-5 years)</MenuItem>
                  <MenuItem value="long-term">Long-term (5+ years)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Assets"
                value={formData.totalAssets}
                onChange={(e) => updateFormData('totalAssets', e.target.value)}
                placeholder="e.g., $100,000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Liquid Assets"
                value={formData.liquidAssets}
                onChange={(e) => updateFormData('liquidAssets', e.target.value)}
                placeholder="e.g., $50,000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Risk Tolerance</InputLabel>
                <Select
                  value={formData.riskTolerance}
                  onChange={(e) => updateFormData('riskTolerance', e.target.value)}
                  label="Risk Tolerance"
                >
                  <MenuItem value="conservative">Conservative (Capital Preservation)</MenuItem>
                  <MenuItem value="moderate">Moderate (Balanced Growth)</MenuItem>
                  <MenuItem value="aggressive">Aggressive (Maximum Growth)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Income"
                value={formData.monthlyIncome}
                onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
                placeholder="e.g., $5,000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Preferred Tokens</InputLabel>
                <Select
                  multiple
                  value={formData.preferredTokens}
                  onChange={(e) => updateFormData('preferredTokens', e.target.value)}
                  label="Preferred Tokens"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="ETH">Ethereum (ETH)</MenuItem>
                  <MenuItem value="USDC">USD Coin (USDC)</MenuItem>
                  <MenuItem value="USDT">Tether (USDT)</MenuItem>
                  <MenuItem value="WBTC">Wrapped Bitcoin (WBTC)</MenuItem>
                  <MenuItem value="DAI">Dai (DAI)</MenuItem>
                  <MenuItem value="UNI">Uniswap (UNI)</MenuItem>
                  <MenuItem value="LINK">Chainlink (LINK)</MenuItem>
                  <MenuItem value="AAVE">Aave (AAVE)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pool Types</InputLabel>
                <Select
                  value={formData.poolTypes}
                  onChange={(e) => updateFormData('poolTypes', e.target.value)}
                  label="Pool Types"
                >
                  <MenuItem value="stable">Stable Pairs (Low Risk)</MenuItem>
                  <MenuItem value="volatile">Volatile Pairs (High Risk/Reward)</MenuItem>
                  <MenuItem value="mixed">Mixed Strategy (Balanced)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Liquidity Amount"
                value={formData.liquidityAmount}
                onChange={(e) => updateFormData('liquidityAmount', e.target.value)}
                placeholder="e.g., $10,000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expected Annual Yield"
                value={formData.yieldExpectation}
                onChange={(e) => updateFormData('yieldExpectation', e.target.value)}
                placeholder="e.g., 15%"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  🐋 Whale vs 🐟 Minnow Dynamics
                </Typography>
                <Typography variant="body2">
                  Understanding your position size helps determine market impact, slippage tolerance, and optimal strategies.
                  Whales can move markets but face higher slippage, while minnows have minimal impact but better execution.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Position Size</InputLabel>
                <Select
                  value={formData.positionSize}
                  onChange={(e) => updateFormData('positionSize', e.target.value)}
                  label="Position Size"
                >
                  <MenuItem value="minnow">🐟 Minnow ($0 - $1K)</MenuItem>
                  <MenuItem value="small-fish">🐠 Small Fish ($1K - $10K)</MenuItem>
                  <MenuItem value="medium-fish">🐡 Medium Fish ($10K - $100K)</MenuItem>
                  <MenuItem value="whale">🐋 Whale ($100K+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Market Impact</InputLabel>
                <Select
                  value={formData.marketImpact}
                  onChange={(e) => updateFormData('marketImpact', e.target.value)}
                  label="Market Impact"
                >
                  <MenuItem value="low">Low (Minimal price movement)</MenuItem>
                  <MenuItem value="medium">Medium (Noticeable price movement)</MenuItem>
                  <MenuItem value="high">High (Significant price movement)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Slippage Tolerance</InputLabel>
                <Select
                  value={formData.slippageTolerance}
                  onChange={(e) => updateFormData('slippageTolerance', e.target.value)}
                  label="Slippage Tolerance"
                >
                  <MenuItem value="low">Low (0.1% - 0.5%)</MenuItem>
                  <MenuItem value="medium">Medium (0.5% - 2%)</MenuItem>
                  <MenuItem value="high">High (2%+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976D2' }}>
                  💡 Strategy Insights
                </Typography>
                {formData.positionSize === 'minnow' && (
                  <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                    As a minnow, you'll experience minimal slippage and can execute trades quickly. 
                    Focus on stable pairs and automated strategies for consistent returns.
                  </Typography>
                )}
                {formData.positionSize === 'small-fish' && (
                  <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                    Small fish can still execute efficiently while building meaningful positions. 
                    Consider a mix of stable and volatile pairs for growth.
                  </Typography>
                )}
                {formData.positionSize === 'medium-fish' && (
                  <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                    Medium fish need to be strategic about entry/exit timing. 
                    Use limit orders and consider splitting large positions across multiple pools.
                  </Typography>
                )}
                {formData.positionSize === 'whale' && (
                  <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                    As a whale, your trades will impact the market. Use OTC desks, 
                    time-weighted orders, and consider providing liquidity rather than trading.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Jurisdiction/Country"
                value={formData.jurisdiction}
                onChange={(e) => updateFormData('jurisdiction', e.target.value)}
                placeholder="e.g., United States, Singapore, Switzerland"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tax Status</InputLabel>
                <Select
                  value={formData.taxStatus}
                  onChange={(e) => updateFormData('taxStatus', e.target.value)}
                  label="Tax Status"
                >
                  <MenuItem value="domestic">Domestic (Same country)</MenuItem>
                  <MenuItem value="international">International (Different country)</MenuItem>
                  <MenuItem value="tax-exempt">Tax Exempt (Institution/Foundation)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.regulatoryCompliance}
                    onChange={(e) => updateFormData('regulatoryCompliance', e.target.checked)}
                  />
                }
                label="I confirm that I will comply with all applicable regulatory requirements and tax obligations"
              />
              <FormHelperText>
                This includes KYC/AML requirements, reporting obligations, and tax compliance in your jurisdiction.
              </FormHelperText>
            </Grid>
          </Grid>
        );

      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Preferred Blockchains</InputLabel>
                <Select
                  multiple
                  value={formData.preferredChains}
                  onChange={(e) => updateFormData('preferredChains', e.target.value)}
                  label="Preferred Blockchains"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="ethereum">Ethereum (ETH)</MenuItem>
                  <MenuItem value="polygon">Polygon (MATIC)</MenuItem>
                  <MenuItem value="arbitrum">Arbitrum (ARB)</MenuItem>
                  <MenuItem value="optimism">Optimism (OP)</MenuItem>
                  <MenuItem value="binance">Binance Smart Chain (BSC)</MenuItem>
                  <MenuItem value="solana">Solana (SOL)</MenuItem>
                  <MenuItem value="avalanche">Avalanche (AVAX)</MenuItem>
                  <MenuItem value="cosmos">Cosmos (ATOM)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Automation Level</InputLabel>
                <Select
                  value={formData.automationLevel}
                  onChange={(e) => updateFormData('automationLevel', e.target.value)}
                  label="Automation Level"
                >
                  <MenuItem value="manual">Manual (Full control)</MenuItem>
                  <MenuItem value="semi-automated">Semi-automated (Alerts + manual execution)</MenuItem>
                  <MenuItem value="fully-automated">Fully automated (Bot trading)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Monitoring Frequency</InputLabel>
                <Select
                  value={formData.monitoringFrequency}
                  onChange={(e) => updateFormData('monitoringFrequency', e.target.value)}
                  label="Monitoring Frequency"
                >
                  <MenuItem value="real-time">Real-time (24/7 monitoring)</MenuItem>
                  <MenuItem value="daily">Daily (Once per day)</MenuItem>
                  <MenuItem value="weekly">Weekly (Once per week)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 6:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                Stop Loss Percentage: {formData.stopLossPercentage}%
              </Typography>
              <Slider
                value={formData.stopLossPercentage}
                onChange={(_, value) => updateFormData('stopLossPercentage', value)}
                min={1}
                max={50}
                step={1}
                marks={[
                  { value: 1, label: '1%' },
                  { value: 10, label: '10%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' }
                ]}
                valueLabelDisplay="auto"
              />
              <FormHelperText>
                Automatically exit positions if they fall below this percentage
              </FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Diversification Level</InputLabel>
                <Select
                  value={formData.diversificationLevel}
                  onChange={(e) => updateFormData('diversificationLevel', e.target.value)}
                  label="Diversification Level"
                >
                  <MenuItem value="concentrated">Concentrated (1-3 pools)</MenuItem>
                  <MenuItem value="balanced">Balanced (4-8 pools)</MenuItem>
                  <MenuItem value="diversified">Diversified (9+ pools)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.insuranceCoverage}
                    onChange={(e) => updateFormData('insuranceCoverage', e.target.checked)}
                  />
                }
                label="I want insurance coverage for my liquidity positions (e.g., Nexus Mutual, Cover Protocol)"
              />
              <FormHelperText>
                Insurance can protect against smart contract risks and hacks
              </FormHelperText>
            </Grid>
          </Grid>
        );



      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D3748 50%, #4A5568 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '& .MuiFormControl-root': {
          '& .MuiInputLabel-root': {
            color: '#FFFFFF !important',
            fontWeight: 600,
            fontSize: '1rem'
          },
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)'
            }
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF !important',
            fontWeight: 500,
            fontSize: '1rem'
          },
          '& .MuiSelect-select': {
            color: '#FFFFFF !important',
            fontWeight: 500
          },
          '& .MuiChip-root': {
            backgroundColor: 'rgba(76, 175, 80, 0.3)',
            color: '#FFFFFF',
            fontWeight: 600
          }
        },
        '& .MuiFormHelperText-root': {
          color: '#E2E8F0 !important',
          fontWeight: 500
        },
        '& .MuiFormControlLabel-root': {
          '& .MuiFormControlLabel-label': {
            color: '#FFFFFF !important',
            fontWeight: 500
          }
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: 'radial-gradient(circle at 20% 80%, #4CAF50 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2196F3 0%, transparent 50%), radial-gradient(circle at 40% 40%, #FF9800 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite alternate'
        }}
      />

             <Container maxWidth="lg">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
         >
           <Box sx={{ textAlign: 'center', mb: 6 }}>
             <Typography 
               variant="h2" 
               gutterBottom
               sx={{ 
                 color: 'white',
                 fontWeight: 700,
                 textTransform: 'uppercase',
                 letterSpacing: '3px',
                 textShadow: '0 0 20px rgba(76, 175, 80, 0.5)'
               }}
             >
               💧 Liquidity Provider Setup
             </Typography>
             <Typography 
               variant="h5" 
               sx={{ 
                 color: '#FFFFFF',
                 fontWeight: 400,
                 maxWidth: '800px',
                 mx: 'auto',
                 lineHeight: 1.6
               }}
             >
               Configure your liquidity provision strategy for our AI agents to analyze
             </Typography>
           </Box>
         </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card sx={{ 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Avatar sx={{ bgcolor: activeStep >= index ? '#4CAF50' : '#666', width: 32, height: 32 }}>
                          {step.icon}
                        </Avatar>
                      )}
                    >
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {step.label}
                      </Typography>
                                                                                       <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                        {step.description}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mt: 2, mb: 2 }}>
                        {renderStepContent(index)}
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                            disabled={!canProceed()}
                            sx={{ mr: 1 }}
                            startIcon={index === steps.length - 1 ? <LaunchIcon /> : <ArrowForwardIcon />}
                          >
                            {index === steps.length - 1 ? 'Submit to AI Agents' : 'Continue'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card sx={{ 
            background: 'rgba(76, 175, 80, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.4)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                📊 Configuration Summary
              </Typography>
              <Grid container spacing={2}>
                                                                   <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                      Entity: <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formData.entityType}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                      Position Size: <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formData.positionSize}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                      Risk Tolerance: <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formData.riskTolerance}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                      Liquidity Amount: <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formData.liquidityAmount || 'Not set'}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                      Pool Types: <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formData.poolTypes}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                      Automation: <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formData.automationLevel}</span>
                    </Typography>
                  </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LiquidityProviderFlow;
