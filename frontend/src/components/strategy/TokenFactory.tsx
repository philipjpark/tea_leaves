import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Chip,
  Alert,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AccountBalance as BlockchainIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  MonetizationOn as PriceIcon,
  WaterDrop as LiquidityIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  SmartToy as AgentIcon,
  Upload as UploadIcon,
  Description as FileIcon
} from '@mui/icons-material';
import AgentsWorkingPage from './AgentsWorkingPage';

interface TokenFormData {
  chain: string;
  assetClass: string;
  description: string;
  tokenName: string;
  professionalExperience: string;
  relevantBackground: string;
  investmentThesis: string;
  previousSuccesses: string;
  pdfFile: File | null;
  fundraisingAmount: string;
  pricing: string;
  liquidityOption: string;
}

interface TokenValidation {
  nameAvailable: boolean;
  nameLength: boolean;
  nameFormat: boolean;
}

const TokenFactory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<TokenFormData>({
    chain: '',
    assetClass: '',
    description: '',
    tokenName: '',
    professionalExperience: '',
    relevantBackground: '',
    investmentThesis: '',
    previousSuccesses: '',
    pdfFile: null,
    fundraisingAmount: '',
    pricing: '',
    liquidityOption: '',
  });
  const [validation, setValidation] = useState<TokenValidation>({
    nameAvailable: false,
    nameLength: false,
    nameFormat: false
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [gemmaProcessing, setGemmaProcessing] = useState(false);
  const [gemmaResults, setGemmaResults] = useState<any>(null);
  const [agentsWorkingOpen, setAgentsWorkingOpen] = useState(false);


  // Configuration data
  const chains = [
    { id: 'bnb', name: 'BNB Chain', icon: '/bnb.png', description: 'Fast, low-cost transactions' },
    { id: 'sol', name: 'Solana', icon: '/sol.png', description: 'High-performance' }
  ];

  const assetClasses = [
    { id: 'prediction', name: 'Prediction Markets', icon: '🎯', examples: 'Sports, Politics, Entertainment' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏠', examples: 'Properties, REITs, Land' },
    { id: 'music', name: 'Music Royalties', icon: '🎵', examples: 'Songs, Albums, Publishing Rights' },
    { id: 'startup', name: 'Startup Equity', icon: '🚀', examples: 'Company Shares, Venture Capital' },
    { id: 'commodity', name: 'Commodities', icon: '🪙', examples: 'Gold, Oil, Agricultural Products' },
    { id: 'crypto', name: 'Crypto Derivatives', icon: '⚡', examples: 'Futures, Options, Swaps' },
    { id: 'securities', name: 'Tokenized Securities', icon: '📊', examples: 'Bonds, ETFs, Stocks' },
    { id: 'custom', name: 'Custom Asset', icon: '✨', examples: 'Unique, Innovative Assets' }
  ];

  const liquidityOptions = [
    { id: 'auto', name: 'Auto-Liquidity Pool', description: 'Automatically create and manage liquidity pools' },
    { id: 'manual', name: 'Manual Liquidity', description: 'You provide initial liquidity manually' },
    { id: 'hybrid', name: 'Hybrid Approach', description: 'Combination of auto and manual liquidity' },
    { id: 'market-maker', name: 'Market Maker Program', description: 'Professional market makers provide liquidity' }
  ];

  const pricingSuggestions = [
    'Market-based pricing',
    'Fixed price offering',
    'Dutch auction',
    'Bonding curve',
    'Custom pricing model'
  ];

  // Validation functions
  const validateTokenName = (name: string) => {
    const length = name.length >= 2 && name.length <= 7;
    const format = /^[A-Za-z0-9]+$/.test(name);
    const available = !['BNB', 'ETH', 'SOL', 'BTC', 'USDT', 'USDC'].includes(name.toUpperCase());
    
    setValidation({
      nameLength: length,
      nameFormat: format,
      nameAvailable: available
    });

    return length && format && available;
  };

  const handleInputChange = (field: keyof TokenFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'tokenName') {
      validateTokenName(value);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, pdfFile: file }));
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setPreviewOpen(true);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0: return formData.chain !== '';
      case 1: return formData.assetClass !== '';
      case 2: return formData.description.split(' ').filter(word => word.length > 0).length >= 7;
      case 3: return validation.nameLength && validation.nameFormat && validation.nameAvailable;
      case 4: return true; // Credibility Docs is now optional
      case 5: return formData.fundraisingAmount !== '';
      case 6: return formData.pricing !== '';
      case 7: return formData.liquidityOption !== '';
      default: return false;
    }
  };

  const generateSystemPrompt = () => {
    const assetClass = assetClasses.find(ac => ac.id === formData.assetClass);
    const chain = chains.find(c => c.id === formData.chain);
    const liquidity = liquidityOptions.find(lo => lo.id === formData.liquidityOption);

    return `TOKEN CREATION REQUEST FOR GOOGLE GEMMA

CHAIN SELECTION: ${chain?.name}
- Chain ID: ${formData.chain.toUpperCase()}
- Description: ${chain?.description}

ASSET CLASS: ${assetClass?.name} (${assetClass?.icon})
- Examples: ${assetClass?.examples}
- Category: ${formData.assetClass}

PROJECT DESCRIPTION: ${formData.description}

TOKEN DETAILS:
- Name: ${formData.tokenName}
- Fundraising Goal: ${formData.fundraisingAmount}
- Pricing Strategy: ${formData.pricing}
- Liquidity Provision: ${liquidity?.name} - ${liquidity?.description}

 CREDIBILITY & BACKGROUND:
 - Professional Experience: ${formData.professionalExperience}
 - Relevant Background: ${formData.relevantBackground}
 - Investment Thesis: ${formData.investmentThesis}
 - Previous Successes: ${formData.previousSuccesses}
 - PDF Documentation: ${formData.pdfFile ? `Uploaded: ${formData.pdfFile.name}` : 'None provided'}

REQUIRED ACTIONS:
1. SEMANTIC AGENT: Analyze token viability, market fit, and risk assessment
2. FUNDRAISER AGENT: Alert all liquidity providers and potential investors
3. EXECUTION AGENT: Generate smart contracts, deployment scripts, and technical implementation

Please provide comprehensive analysis and actionable next steps for this token launch.`;
  };

  const sendToGemma = async () => {
    setGemmaProcessing(true);
    setPreviewOpen(false);
    
    // Show agents working page
    setAgentsWorkingOpen(true);
  };

  const handleAgentsComplete = (results: any) => {
    setGemmaResults(results);
    setAgentsWorkingOpen(false);
    setGemmaProcessing(false);
    
    // Deploy token to leaderboard after AI analysis
    deployTokenToLeaderboard();
  };

  const handleAgentsClose = () => {
    setAgentsWorkingOpen(false);
    setGemmaProcessing(false);
  };

  const deployTokenToLeaderboard = () => {
    // Array of 5 different token icons
    const tokenIcons = [
      '/images/default-tree-token.svg',
      '/images/token-icon-2.svg',
      '/images/token-icon-3.svg',
      '/images/token-icon-4.svg',
      '/images/token-icon-5.svg'
    ];
    
    // Randomly select a token icon
    const randomIcon = tokenIcons[Math.floor(Math.random() * tokenIcons.length)];
    
    // Create token object with all details
    const newToken = {
      id: Date.now().toString(),
      name: formData.tokenName,
      symbol: formData.tokenName.substring(0, 3).toUpperCase(),
      chain: formData.chain,
      totalSupply: formData.fundraisingAmount,
      description: formData.description,
      category: formData.assetClass,
      liquidity: formData.liquidityOption,
      image: randomIcon, // Random token icon
      marketCap: '0',
      price: '0',
      volume24h: '0',
      change24h: '0',
      holders: '0',
      transactions: '0',
      createdAt: new Date().toISOString(),
      status: 'active',
      aiGenerated: true,
      strategy: `AI Analysis Score: ${gemmaResults?.semanticAgent?.score || 'N/A'}/10\n${gemmaResults?.semanticAgent?.analysis || 'AI analysis completed'}`
    };

    // Store in localStorage (in real app, this would be a database call)
    const existingTokens = JSON.parse(localStorage.getItem('teaLeavesTokens') || '[]');
    existingTokens.unshift(newToken);
    localStorage.setItem('teaLeavesTokens', JSON.stringify(existingTokens));

    // Show success message
    alert(`🎉 Token "${formData.tokenName}" successfully deployed to leaderboard!\n\nNavigate to /leaderboard to view your token.`);
  };

  const steps = [
    {
      label: 'Choose Chain',
      description: 'Foundation',
      icon: <BlockchainIcon />,
      content: (
                 <Box>
           <Box sx={{ textAlign: 'center', mb: 5 }}>
             <Typography variant="h4" gutterBottom sx={{ 
               color: '#2E7D32', 
               mb: 2, 
               fontWeight: 700,
               textTransform: 'uppercase',
               letterSpacing: '1px'
             }}>
               Select Your Preferred Blockchain
             </Typography>
             <Typography variant="body1" sx={{ 
               color: '#666', 
               mb: 3, 
               fontStyle: 'italic',
               fontSize: '1.1rem',
               lineHeight: 1.6,
               maxWidth: '600px',
               mx: 'auto'
             }}>
               The blockchain you choose will determine transaction costs, speed, and which DeFi protocols your token can interact with.
             </Typography>
           </Box>
                     <Grid container spacing={4} justifyContent="center">
             {chains.map((chain) => (
               <Grid item xs={12} sm={6} md={5} lg={4} key={chain.id}>
                 <Card
                   sx={{
                     cursor: 'pointer',
                     border: formData.chain === chain.id ? '3px solid #2E7D32' : '2px solid #E8F5E8',
                     borderRadius: '20px',
                     background: formData.chain === chain.id 
                       ? 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)'
                       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                     minHeight: '220px',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     position: 'relative',
                     overflow: 'hidden',
                     '&:hover': { 
                       transform: 'translateY(-8px)', 
                       boxShadow: formData.chain === chain.id
                         ? '0 16px 40px rgba(46, 125, 50, 0.25)'
                         : '0 16px 40px rgba(0,0,0,0.15)',
                       borderColor: formData.chain === chain.id ? '#4CAF50' : '#2E7D32'
                     },
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       right: 0,
                       height: '4px',
                       background: formData.chain === chain.id 
                         ? 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)'
                         : 'transparent',
                       transition: 'all 0.3s ease'
                     }
                   }}
                   onClick={() => handleInputChange('chain', chain.id)}
                 >
                   <CardContent sx={{ 
                     textAlign: 'center', 
                     p: 5, 
                     flex: 1, 
                     display: 'flex', 
                     flexDirection: 'column', 
                     justifyContent: 'center',
                     position: 'relative',
                     zIndex: 1
                   }}>
                     <Box sx={{ 
                       mb: 4, 
                       display: 'flex', 
                       justifyContent: 'center',
                       position: 'relative'
                     }}>
                                               <Box sx={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: formData.chain === chain.id
                            ? 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
                            : 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: formData.chain === chain.id
                            ? '0 8px 24px rgba(46, 125, 50, 0.3)'
                            : '0 4px 16px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease'
                        }}>
                                                   <img 
                            src={chain.icon} 
                            alt={`${chain.name} logo`}
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'contain'
                            }} 
                          />
                       </Box>
                     </Box>
                     <Typography variant="h4" sx={{ 
                       fontWeight: 700, 
                       mb: 2, 
                       color: formData.chain === chain.id ? '#2E7D32' : '#424242',
                       textTransform: 'uppercase',
                       letterSpacing: '1px'
                     }}>
                       {chain.name}
                     </Typography>
                     <Typography variant="body1" sx={{ 
                       color: formData.chain === chain.id ? '#2E7D32' : '#666', 
                       lineHeight: 1.6,
                       fontSize: '1.1rem',
                       fontWeight: 500
                     }}>
                       {chain.description}
                     </Typography>
                     
                     {/* Selection Indicator */}
                     {formData.chain === chain.id && (
                       <Box sx={{
                         position: 'absolute',
                         top: '16px',
                         right: '16px',
                         width: '32px',
                         height: '32px',
                         borderRadius: '50%',
                         background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '18px',
                         fontWeight: 'bold',
                         boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                         animation: 'pulse 2s infinite'
                       }}>
                         ✓
                       </Box>
                     )}
                   </CardContent>
                 </Card>
               </Grid>
             ))}
           </Grid>
        </Box>
      )
    },
    {
      label: 'Asset Class',
      description: 'Category',
      icon: <CategoryIcon />,
      content: (
        <Box>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#2E7D32', 
              mb: 2, 
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Select Your Asset Class
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#666', 
              mb: 3, 
              fontStyle: 'italic',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto'
            }}>
              Different asset classes have varying regulatory requirements, liquidity profiles, and investor appeal.
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ maxWidth: '600px', mx: 'auto' }}>
            <InputLabel sx={{ color: '#2E7D32', fontWeight: 600 }}>Asset Class</InputLabel>
            <Select
              value={formData.assetClass}
              onChange={(e) => handleInputChange('assetClass', e.target.value)}
              label="Asset Class"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2E7D32',
                    borderWidth: '2px'
                  }
                }
              }}
            >
              {assetClasses.map((asset) => (
                <MenuItem key={asset.id} value={asset.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span>{asset.icon}</span>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {asset.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                        {asset.examples}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )
    },
    {
      label: 'Description',
      description: 'Value',
      icon: <DescriptionIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
            Why Should Your Token Be Supported?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            A compelling description helps investors understand your project's value and potential impact.
          </Typography>
          <TextField
            fullWidth
            label="Project Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your project in at least 7 words..."
            multiline
            rows={4}
            helperText={`${formData.description.split(' ').filter(word => word.length > 0).length}/7 words minimum`}
          />
          
          {formData.description.split(' ').filter(word => word.length > 0).length >= 7 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Description meets minimum word requirement!
            </Alert>
          )}
        </Box>
      )
    },
    {
      label: 'Token Name',
      description: 'Brand',
      icon: <EditIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
            Choose Your Token Name
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            A memorable, unique name helps with branding and prevents confusion with existing tokens.
          </Typography>
          <TextField
            fullWidth
            label="Token Name"
            value={formData.tokenName}
            onChange={(e) => handleInputChange('tokenName', e.target.value.toUpperCase())}
            placeholder="Enter 2-7 characters"
            sx={{ mb: 3 }}
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={validation.nameLength ? <CheckIcon /> : <ErrorIcon />}
              label="2-7 characters"
              color={validation.nameLength ? 'success' : 'error'}
              size="small"
            />
            <Chip
              icon={validation.nameFormat ? <CheckIcon /> : <ErrorIcon />}
              label="Alphanumeric only"
              color={validation.nameFormat ? 'success' : 'error'}
              size="small"
            />
            <Chip
              icon={validation.nameAvailable ? <CheckIcon /> : <ErrorIcon />}
              label="Name available"
              color={validation.nameAvailable ? 'success' : 'error'}
              size="small"
            />
          </Box>

          {formData.tokenName && (
            <Alert severity={validation.nameLength && validation.nameFormat && validation.nameAvailable ? 'success' : 'warning'}>
              {validation.nameLength && validation.nameFormat && validation.nameAvailable 
                ? `Token name "${formData.tokenName}" is available and valid!`
                : 'Please fix the validation issues above to proceed.'
              }
            </Alert>
          )}
        </Box>
      )
    },
    {
      label: 'Credibility Docs',
      description: 'Experience',
      icon: <DescriptionIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
            Update Relevant Documentation to Show Your Credibility (Optional)
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            Provide information about your experience, background, and investment thesis to build investor confidence. This step is optional.
          </Typography>
          
          {/* PDF Upload Section */}
          <Box sx={{ mb: 4, p: 3, border: '2px dashed #E8F5E8', borderRadius: '12px', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#2E7D32', mb: 2 }}>
              📄 Upload Experience Documentation
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Upload a PDF containing your professional experience, credentials, or any relevant documentation
            </Typography>
            
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="pdf-upload"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                sx={{
                  borderColor: '#2E7D32',
                  color: '#2E7D32',
                  '&:hover': {
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)'
                  }
                }}
              >
                Choose PDF File
              </Button>
            </label>
            
            {formData.pdfFile && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <FileIcon sx={{ color: '#4CAF50' }} />
                <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 500 }}>
                  {formData.pdfFile.name}
                </Typography>
                <Chip 
                  label="PDF Uploaded" 
                  color="success" 
                  size="small" 
                  icon={<CheckIcon />}
                />
              </Box>
            )}
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Professional Experience"
                value={formData.professionalExperience}
                onChange={(e) => handleInputChange('professionalExperience', e.target.value)}
                placeholder="e.g., 5+ years in DeFi, former PM at Coinbase..."
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Relevant Background"
                value={formData.relevantBackground}
                onChange={(e) => handleInputChange('relevantBackground', e.target.value)}
                placeholder="e.g., Computer Science degree, blockchain developer..."
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Investment Thesis"
                value={formData.investmentThesis}
                onChange={(e) => handleInputChange('investmentThesis', e.target.value)}
                placeholder="Explain your vision for this token and why it will succeed..."
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Previous Successes"
                value={formData.previousSuccesses}
                onChange={(e) => handleInputChange('previousSuccesses', e.target.value)}
                placeholder="e.g., Successfully launched 3 tokens, $2M+ in TVL..."
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> This step is optional. You can provide text descriptions, upload a PDF, or both. The more credible and detailed your background information, the more likely investors will support your token launch.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      label: 'Fundraising',
      description: 'Capital',
      icon: <MoneyIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
            How Much Do You Want to Raise?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            The fundraising amount should align with your project's development needs and market validation goals.
          </Typography>
          <TextField
            fullWidth
            label="Fundraising Amount"
            value={formData.fundraisingAmount}
            onChange={(e) => handleInputChange('fundraisingAmount', e.target.value)}
            placeholder="e.g., $100,000 or 50 ETH"
            helperText="Specify amount in USD or cryptocurrency"
          />
        </Box>
      )
    },
    {
      label: 'Pricing',
      description: 'Strategy',
      icon: <PriceIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
            How Would You Like to Price Your Token?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            Pricing strategy affects initial distribution, investor incentives, and long-term token value dynamics.
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Pricing Strategy</InputLabel>
            <Select
              value={formData.pricing}
              onChange={(e) => handleInputChange('pricing', e.target.value)}
              label="Pricing Strategy"
            >
              {pricingSuggestions.map((suggestion, index) => (
                <MenuItem key={index} value={suggestion}>
                  {suggestion}
                </MenuItem>
              ))}
              <MenuItem value="custom">Custom pricing model</MenuItem>
            </Select>
          </FormControl>
          
          {formData.pricing === 'custom' && (
            <TextField
              fullWidth
              label="Custom Pricing Description"
              placeholder="Describe your custom pricing strategy..."
              multiline
              rows={3}
            />
          )}
        </Box>
      )
    },
    {
      label: 'Liquidity',
      description: 'Market',
      icon: <LiquidityIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
            How Would You Like to Provide Liquidity?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            Liquidity provision strategy affects trading volume, price stability, and investor confidence.
          </Typography>
                     <Grid container spacing={2}>
             {liquidityOptions.map((option) => (
               <Grid item xs={12} md={6} key={option.id}>
                 <Card
                   sx={{
                     cursor: 'pointer',
                     border: formData.liquidityOption === option.id ? '3px solid #2E7D32' : '2px solid #E0E0E0',
                     borderRadius: '16px',
                     background: formData.liquidityOption === option.id 
                       ? 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)'
                       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                     position: 'relative',
                     overflow: 'hidden',
                     '&:hover': { 
                       transform: 'translateY(-4px)', 
                       boxShadow: formData.liquidityOption === option.id
                         ? '0 12px 32px rgba(46, 125, 50, 0.25)'
                         : '0 8px 24px rgba(0,0,0,0.15)',
                       borderColor: formData.liquidityOption === option.id ? '#4CAF50' : '#2E7D32'
                     },
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       right: 0,
                       height: '4px',
                       background: formData.liquidityOption === option.id 
                         ? 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)'
                         : 'transparent',
                       transition: 'all 0.3s ease'
                     }
                   }}
                   onClick={() => handleInputChange('liquidityOption', option.id)}
                 >
                   <CardContent sx={{ 
                     p: 3, 
                     position: 'relative',
                     zIndex: 1
                   }}>
                     <Typography variant="h6" sx={{ 
                       fontWeight: 600, 
                       mb: 1,
                       color: formData.liquidityOption === option.id ? '#2E7D32' : '#424242'
                     }}>
                       {option.name}
                     </Typography>
                     <Typography variant="body2" sx={{ 
                       color: formData.liquidityOption === option.id ? '#2E7D32' : '#666',
                       lineHeight: 1.5
                     }}>
                       {option.description}
                     </Typography>
                     
                     {/* Selection Indicator */}
                     {formData.liquidityOption === option.id && (
                       <Box sx={{
                         position: 'absolute',
                         top: '16px',
                         right: '16px',
                         width: '32px',
                         height: '32px',
                         borderRadius: '50%',
                         background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '18px',
                         fontWeight: 'bold',
                         boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                         animation: 'pulse 2s infinite'
                       }}>
                         ✓
                       </Box>
                     )}
                   </CardContent>
                 </Card>
               </Grid>
             ))}
           </Grid>
        </Box>
      )
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
        py: 4,
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: 0.8
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1
          }
        }
      }}
    >
      <Container maxWidth="lg">
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
              Token Factory
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
              Create your own tokenized asset in the{' '}
              <Box component="span" sx={{ color: '#6A1B9A', fontStyle: 'italic' }}>tea</Box>
              <Box component="span" sx={{ fontStyle: 'italic' }}>_leaves</Box> ecosystem
            </Typography>
          </Box>
        </motion.div>

        <Card sx={{ 
          borderRadius: '20px', 
          overflow: 'hidden', 
          mb: 6,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
          border: '2px solid #E8F5E8',
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ 
                color: '#2E7D32', 
                fontWeight: 700, 
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Token Creation Flow
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#666', 
                fontStyle: 'italic',
                maxWidth: '600px',
                mx: 'auto'
              }}>
                 Substrings concatenating into a pre-processed sys prompt, pipeliing into an agentic framework that creates your tokenized asset 
              </Typography>
            </Box>
            
                        <Stepper activeStep={activeStep} orientation="horizontal" sx={{ 
              mb: 4,
              '& .MuiStep-root': {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }
            }}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel 
                    icon={step.icon}
                    sx={{ 
                      textAlign: 'center',
                      '& .MuiStepLabel-iconContainer': {
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: activeStep >= index 
                          ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
                          : 'linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                        boxShadow: activeStep >= index 
                          ? '0 3px 12px rgba(46, 125, 50, 0.3)'
                          : '0 2px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: activeStep >= index ? 'scale(1.05)' : 'scale(1.02)'
                        },
                        '& svg': {
                          fontSize: '24px',
                          color: 'white'
                        }
                      },
                      '& .MuiStepLabel-label': {
                        color: activeStep >= index ? '#2E7D32' : '#9E9E9E',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '6px',
                        textAlign: 'center'
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ 
                      color: activeStep >= index ? '#2E7D32' : '#9E9E9E', 
                      display: 'block', 
                      maxWidth: '120px', 
                      lineHeight: 1.2,
                      fontSize: '0.7rem',
                      fontStyle: 'italic',
                      opacity: activeStep >= index ? 0.9 : 0.6,
                      textAlign: 'center',
                      mx: 'auto'
                    }}>
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Progress Bar */}
            <Box sx={{ 
              width: '100%', 
              height: '4px', 
              background: '#E8F5E8', 
              borderRadius: '2px',
              overflow: 'hidden',
              mb: 2
            }}>
              <Box sx={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)',
                transition: 'width 0.5s ease',
                borderRadius: '2px'
              }} />
            </Box>
            
            <Typography variant="body2" sx={{ 
              textAlign: 'center', 
              color: '#2E7D32', 
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card sx={{ 
          borderRadius: '20px', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%)',
          border: '2px solid #E8F5E8',
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)'
        }}>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ mb: 4 }}>
              {steps[activeStep].content}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 3,
              borderTop: '2px solid #E8F5E8'
            }}>
              <Box>
                {activeStep > 0 && (
                  <Button 
                    onClick={handleBack} 
                    variant="outlined"
                    sx={{ 
                      color: '#2E7D32', 
                      borderColor: '#2E7D32',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)'
                      }
                    }}
                  >
                    ← Back
                  </Button>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #F8FFF8 0%, #E8F5E8 100%)',
                  border: '1px solid #E8F5E8'
                }}>
                  <Typography variant="body2" sx={{ 
                    color: '#2E7D32', 
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    Step {activeStep + 1} of {steps.length}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  sx={{
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    borderRadius: '12px',
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': { 
                      background: 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)',
                      boxShadow: 'none',
                      transform: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {activeStep === steps.length - 1 ? '🎯 Preview & Send' : 'Next →'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            color: '#2E7D32',
            fontWeight: 600
          }}>
            Preview & Send to Agents
            <IconButton onClick={() => setPreviewOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', mb: 3 }}>
              System Prompt for Google Gemma
            </Typography>
            
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5', fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
              {generateSystemPrompt()}
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#6A1B9A', mb: 2 }}>
                🚀 Gemma Agent Workflow
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#E3F2FD', border: '1px solid #2196F3' }}>
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: '#2196F3', mx: 'auto', mb: 1 }}>
                        <AgentIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976D2' }}>
                        Semantic Agent
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1976D2', fontSize: '0.75rem' }}>
                        Analyze viability & market fit
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#E8F5E8', border: '1px solid #4CAF50' }}>
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: '#4CAF50', mx: 'auto', mb: 1 }}>
                        <AgentIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                        Fundraiser Agent
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2E7D32', fontSize: '0.75rem' }}>
                        Alert liquidity providers
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#FFF3E0', border: '1px solid #FF9800' }}>
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: '#FF9800', mx: 'auto', mb: 1 }}>
                        <AgentIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#E65100' }}>
                        Execution Agent
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#E65100', fontSize: '0.75rem' }}>
                        Generate contracts & deploy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setPreviewOpen(false)} sx={{ color: '#2E7D32' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={sendToGemma}
              disabled={gemmaProcessing}
              startIcon={gemmaProcessing ? <PreviewIcon /> : <SendIcon />}
              sx={{ 
                bgcolor: '#6A1B9A',
                '&:hover': { bgcolor: '#6A1B9A', opacity: 0.9 }
              }}
            >
              {gemmaProcessing ? 'Processing...' : 'Send to Agents'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Gemma Results */}
        {gemmaResults && (
          <Card sx={{ mt: 4, borderRadius: '16px', border: '2px solid #2E7D32' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: '#2E7D32', fontWeight: 600, mb: 3 }}>
                🎯 Google Gemma Analysis Results
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#E3F2FD', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#2196F3' }}>
                          <AgentIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: '#1976D2' }}>
                          Semantic Agent
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#1976D2', mb: 2 }}>
                        {gemmaResults.semanticAgent.analysis}
                      </Typography>
                      <Chip 
                        label={`Score: ${gemmaResults.semanticAgent.score}/10`} 
                        color="primary" 
                        size="small" 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#E8F5E8', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#4CAF50' }}>
                          <AgentIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                          Fundraiser Agent
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#2E7D32', mb: 2 }}>
                        {gemmaResults.fundraiserAgent.alerts}
                      </Typography>
                      <Chip 
                        label={`${gemmaResults.fundraiserAgent.contacts} contacts`} 
                        color="success" 
                        size="small" 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#FFF3E0', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#FF9800' }}>
                          <AgentIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: '#E65100' }}>
                          Execution Agent
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#E65100', mb: 2 }}>
                        {gemmaResults.executionAgent.contracts}
                      </Typography>
                      <Chip 
                        label={gemmaResults.executionAgent.deployment} 
                        color="warning" 
                        size="small" 
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    bgcolor: '#2E7D32',
                    '&:hover': { bgcolor: '#2E7D32', opacity: 0.9 }
                  }}
                >
                  🚀 Launch Your Token
                </Button>
                
                {/* Navigation to Leaderboard */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                    Your token has been deployed to the leaderboard! 🎉
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => window.location.href = '/leaderboard'}
                    sx={{ 
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      '&:hover': { 
                        borderColor: '#2E7D32',
                        backgroundColor: 'rgba(76, 175, 80, 0.04)'
                      }
                    }}
                  >
                    📊 View Token Leaderboard
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
                 )}
         
         
       </Container>
       {/* Agents Working Page */}
        {agentsWorkingOpen && (
          <AgentsWorkingPage
            formData={formData}
            onComplete={handleAgentsComplete}
            onClose={handleAgentsClose}
          />
        )}
     </Box>
   );
 };

export default TokenFactory; 