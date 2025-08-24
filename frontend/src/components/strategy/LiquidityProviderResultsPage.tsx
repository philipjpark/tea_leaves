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
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon,
  Code as CodeIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface LiquidityProviderResults {
  kycAgent: {
    status: string;
    complianceScore: number;
    complianceStatus: string;
    message: string;
  };
  budgetAgent: {
    status: string;
    liquidityRequirement: string;
    optimalPoolSize: string;
    projectedYield: string;
    message: string;
  };
  validatorAgent: {
    status: string;
    riskLevel: string;
    securityScore: string;
    vulnerabilities: string;
    message: string;
  };
}

interface LiquidityProviderResultsPageProps {
  results: LiquidityProviderResults;
  onClose: () => void;
  onProceed: () => void;
}

const LiquidityProviderResultsPage: React.FC<LiquidityProviderResultsPageProps> = ({
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const handleDownloadReport = () => {
    const reportContent = `
LIQUIDITY PROVIDER AGENTS ANALYSIS REPORT
========================================

KYC AGENT RESULTS:
- Status: ${results.kycAgent.status}
- Compliance Score: ${results.kycAgent.complianceScore}%
- Compliance Status: ${results.kycAgent.complianceStatus}
- Message: ${results.kycAgent.message}

BUDGET AGENT RESULTS:
- Status: ${results.budgetAgent.status}
- Liquidity Requirement: ${results.budgetAgent.liquidityRequirement}
- Optimal Pool Size: ${results.budgetAgent.optimalPoolSize}
- Projected Yield: ${results.budgetAgent.projectedYield}
- Message: ${results.budgetAgent.message}

VALIDATOR AGENT RESULTS:
- Status: ${results.validatorAgent.status}
- Risk Level: ${results.validatorAgent.riskLevel}
- Security Score: ${results.validatorAgent.securityScore}
- Vulnerabilities: ${results.validatorAgent.vulnerabilities}
- Message: ${results.validatorAgent.message}

GENERATED: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liquidity-provider-analysis-report.txt';
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
              📊 Analysis Results
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
              Comprehensive analysis from our AI agents for liquidity provision
            </Typography>
          </Box>
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
          {/* KYC Agent Results */}
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
                      <AccountBalanceIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        KYC Agent
                      </Typography>
                      <Chip
                        label={results.kycAgent.status}
                        color={getStatusColor(results.kycAgent.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      Compliance Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={results.kycAgent.complianceScore}
                        sx={{
                          flexGrow: 1,
                          mr: 2,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getComplianceColor(results.kycAgent.complianceScore) === 'success' ? '#4CAF50' : 
                                           getComplianceColor(results.kycAgent.complianceScore) === 'warning' ? '#FF9800' : '#F44336'
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, minWidth: '40px' }}>
                        {results.kycAgent.complianceScore}%
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={results.kycAgent.complianceStatus}
                    color={results.kycAgent.complianceStatus === 'approved' ? 'success' : 'warning' as any}
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" sx={{ color: '#E3F2FD', fontStyle: 'italic' }}>
                    {results.kycAgent.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </motion.div>

          {/* Budget Agent Results */}
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
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Budget Agent
                      </Typography>
                      <Chip
                        label={results.budgetAgent.status}
                        color={getStatusColor(results.budgetAgent.status) as any}
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
                        primary="Liquidity Requirement"
                        secondary={results.budgetAgent.liquidityRequirement}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Optimal Pool Size"
                        secondary={results.budgetAgent.optimalPoolSize}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Projected Yield"
                        secondary={results.budgetAgent.projectedYield}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                  </List>

                  <Typography variant="body2" sx={{ color: '#E8F5E8', fontStyle: 'italic' }}>
                    {results.budgetAgent.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </motion.div>

          {/* Validator Agent Results */}
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
                      <SecurityIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Validator Agent
                      </Typography>
                      <Chip
                        label={results.validatorAgent.status}
                        color={getStatusColor(results.validatorAgent.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      Risk Assessment
                    </Typography>
                    <Chip
                      label={results.validatorAgent.riskLevel}
                      color={getRiskColor(results.validatorAgent.riskLevel) as any}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <List dense sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SecurityIcon sx={{ color: '#FF9800' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Security Score"
                        secondary={results.validatorAgent.securityScore}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <WarningIcon sx={{ color: '#FF9800' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Vulnerabilities"
                        secondary={results.validatorAgent.vulnerabilities}
                        primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.875rem' } }}
                        secondaryTypographyProps={{ sx: { color: '#B0BEC5' } }}
                      />
                    </ListItem>
                  </List>

                  <Typography variant="body2" sx={{ color: '#FFF3E0', fontStyle: 'italic' }}>
                    {results.validatorAgent.message}
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
              📋 Executive Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2 }}>
                    ✅ Compliance Status
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    KYC verification completed with {results.kycAgent.complianceScore}% compliance score.
                    {results.kycAgent.complianceStatus === 'approved' ? ' All regulatory requirements met.' : ' Additional verification may be required.'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#2196F3', mb: 2 }}>
                    💰 Financial Analysis
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Optimal liquidity requirement: {results.budgetAgent.liquidityRequirement}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Expected yield: {results.budgetAgent.projectedYield}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FF9800', mb: 2 }}>
                    🔒 Security Assessment
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Risk level: {results.validatorAgent.riskLevel}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Security score: {results.validatorAgent.securityScore}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                    {results.validatorAgent.vulnerabilities === 'None detected' ? 'No security vulnerabilities detected.' : `Vulnerabilities: ${results.validatorAgent.vulnerabilities}`}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ color: '#9C27B0', mb: 2 }}>
                    🎯 Recommendations
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    • Proceed with liquidity provision if all agents show positive results
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 1 }}>
                    • Monitor compliance requirements regularly
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                    • Implement suggested security measures
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
              Proceed with Liquidity Provision
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LiquidityProviderResultsPage;
