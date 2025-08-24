import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  AccountBalance as AccountBalanceIcon,
  Code as CodeIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TokenCreationResults {
  semanticAgent: {
    status: string;
    marketAnalysis: string;
    competitionAnalysis: string;
    regulatoryCompliance: string;
    tokenomicsModel: string;
    riskAssessment: string;
    message: string;
  };
  liquidityAgent: {
    status: string;
    liquidityStrategy: string;
    poolDistribution: string;
    yieldOptimization: string;
    marketMaking: string;
    message: string;
  };
  smartContractAgent: {
    status: string;
    contractSecurity: string;
    gasOptimization: string;
    upgradeability: string;
    auditStatus: string;
    message: string;
  };
  tokenSpecs: {
    name: string;
    symbol: string;
    totalSupply: string;
    initialPrice: string;
    marketCap: string;
    image: string;
  };
}

interface TokenCreationResultsPageProps {
  results: TokenCreationResults;
  onClose: () => void;
  onProceed: () => void;
}

const TokenCreationResultsPage: React.FC<TokenCreationResultsPageProps> = ({
  results,
  onClose,
  onProceed
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const handleDownloadReport = () => {
    const reportContent = `
TOKEN CREATION AGENTS ANALYSIS REPORT
====================================

TOKEN SPECIFICATIONS:
- Name: ${results.tokenSpecs.name}
- Symbol: ${results.tokenSpecs.symbol}
- Total Supply: ${results.tokenSpecs.totalSupply}
- Initial Price: ${results.tokenSpecs.initialPrice}
- Market Cap: ${results.tokenSpecs.marketCap}

SEMANTIC AGENT RESULTS:
- Status: ${results.semanticAgent.status}
- Market Analysis: ${results.semanticAgent.marketAnalysis}
- Competition Analysis: ${results.semanticAgent.competitionAnalysis}
- Regulatory Compliance: ${results.semanticAgent.regulatoryCompliance}
- Tokenomics Model: ${results.semanticAgent.tokenomicsModel}
- Risk Assessment: ${results.semanticAgent.riskAssessment}
- Message: ${results.semanticAgent.message}

LIQUIDITY AGENT RESULTS:
- Status: ${results.liquidityAgent.status}
- Liquidity Strategy: ${results.liquidityAgent.liquidityStrategy}
- Pool Distribution: ${results.liquidityAgent.poolDistribution}
- Yield Optimization: ${results.liquidityAgent.yieldOptimization}
- Market Making: ${results.liquidityAgent.marketMaking}
- Message: ${results.liquidityAgent.message}

SMART CONTRACT AGENT RESULTS:
- Status: ${results.smartContractAgent.status}
- Contract Security: ${results.smartContractAgent.contractSecurity}
- Gas Optimization: ${results.smartContractAgent.gasOptimization}
- Upgradeability: ${results.smartContractAgent.upgradeability}
- Audit Status: ${results.smartContractAgent.auditStatus}
- Message: ${results.smartContractAgent.message}

GENERATED: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'token-creation-analysis-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden'
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
          opacity: 0.1,
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
          <Box sx={{ textAlign: 'center', mb: 6, position: 'relative' }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
            
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
              🪙 Token Creation Results
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#B0BEC5',
                fontWeight: 300,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Comprehensive analysis from our AI agents for token creation
            </Typography>
          </Box>
        </motion.div>

        {/* Token Specifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card
            sx={{
              mb: 6,
              background: 'rgba(156, 39, 176, 0.1)',
              border: '2px solid rgba(156, 39, 176, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#9C27B0', mr: 2, width: 60, height: 60 }}>
                  <VisibilityIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {results.tokenSpecs.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#E1BEE7', fontWeight: 400 }}>
                    ${results.tokenSpecs.symbol}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Property</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ color: '#B0BEC5' }}>Total Supply</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>{results.tokenSpecs.totalSupply}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#B0BEC5' }}>Initial Price</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>{results.tokenSpecs.initialPrice}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#B0BEC5' }}>Market Cap</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>{results.tokenSpecs.marketCap}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src={results.tokenSpecs.image} 
                      alt="Token Icon" 
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%',
                        border: '3px solid #9C27B0'
                      }} 
                    />
                    <Typography variant="body1" sx={{ color: '#E1BEE7', mt: 2 }}>
                      Token Design Generated
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadReport}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)' }
              }}
            >
              Download Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { borderColor: '#2196F3', backgroundColor: 'rgba(33, 150, 243, 0.1)' }
              }}
            >
              Print Report
            </Button>
          </Box>
        </motion.div>

        {/* Results Grid */}
        <Grid container spacing={4}>
          {/* Semantic Agent Results */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: 'rgba(33, 150, 243, 0.1)',
                  border: '2px solid rgba(33, 150, 243, 0.3)',
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#2196F3', mr: 2 }}>
                      <PsychologyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Semantic Agent
                      </Typography>
                      <Chip
                        label={results.semanticAgent.status}
                        color={getStatusColor(results.semanticAgent.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <List dense sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon sx={{ color: '#2196F3' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Market Analysis"
                        secondary={results.semanticAgent.marketAnalysis}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon sx={{ color: '#2196F3' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Competition"
                        secondary={results.semanticAgent.competitionAnalysis}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SecurityIcon sx={{ color: '#2196F3' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Compliance"
                        secondary={results.semanticAgent.regulatoryCompliance}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                  </List>

                  <Typography variant="body2" sx={{ color: '#E3F2FD', fontStyle: 'italic' }}>
                    {results.semanticAgent.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </motion.div>

          {/* Liquidity Agent Results */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                      <AccountBalanceIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Liquidity Agent
                      </Typography>
                      <Chip
                        label={results.liquidityAgent.status}
                        color={getStatusColor(results.liquidityAgent.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <List dense sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Liquidity Strategy"
                        secondary={results.liquidityAgent.liquidityStrategy}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pool Distribution"
                        secondary={results.liquidityAgent.poolDistribution}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Yield Optimization"
                        secondary={results.liquidityAgent.yieldOptimization}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                  </List>

                  <Typography variant="body2" sx={{ color: '#E8F5E8', fontStyle: 'italic' }}>
                    {results.liquidityAgent.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </motion.div>

          {/* Smart Contract Agent Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '2px solid rgba(255, 152, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#FF9800', mr: 2 }}>
                      <CodeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Smart Contract Agent
                      </Typography>
                      <Chip
                        label={results.smartContractAgent.status}
                        color={getStatusColor(results.smartContractAgent.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <List dense sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SecurityIcon sx={{ color: '#FF9800' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Contract Security"
                        secondary={results.smartContractAgent.contractSecurity}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon sx={{ color: '#FF9800' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Gas Optimization"
                        secondary={results.smartContractAgent.gasOptimization}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon sx={{ color: '#FF9800' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Upgradeability"
                        secondary={results.smartContractAgent.upgradeability}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                  </List>

                  <Typography variant="body2" sx={{ color: '#FFF3E0', fontStyle: 'italic' }}>
                    {results.smartContractAgent.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </motion.div>
        </Grid>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Paper
            sx={{
              mt: 6,
              p: 4,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
              📋 Token Creation Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2 }}>
                    ✅ Market Analysis
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    {results.semanticAgent.marketAnalysis}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Competition: {results.semanticAgent.competitionAnalysis}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                    Compliance: {results.semanticAgent.regulatoryCompliance}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#2196F3', mb: 2 }}>
                    💰 Liquidity Strategy
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    {results.liquidityAgent.liquidityStrategy}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                    Pool Distribution: {results.liquidityAgent.poolDistribution}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FF9800', mb: 2 }}>
                    🔒 Smart Contract
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Security: {results.smartContractAgent.contractSecurity}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Gas Optimization: {results.smartContractAgent.gasOptimization}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                    Upgradeability: {results.smartContractAgent.upgradeability}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ color: '#9C27B0', mb: 2 }}>
                    🎯 Next Steps
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    • Deploy token to blockchain network
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    • Initialize liquidity pools
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                    • Launch marketing campaign
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { borderColor: '#B0BEC5', backgroundColor: 'rgba(176, 190, 197, 0.1)' }
              }}
            >
              Close Report
            </Button>
            <Button
              variant="contained"
              onClick={onProceed}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { background: 'linear-gradient(45deg, #45A049 30%, #5CB85C 90%)' }
              }}
            >
              Deploy Token
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TokenCreationResultsPage;
