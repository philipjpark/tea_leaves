import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TokenCreationResultsPage from './TokenCreationResultsPage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SmartToy as AgentIcon,
  Psychology as BrainIcon,
  TrendingUp as ChartIcon,
  Code as CodeIcon,
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface AgentWork {
  id: string;
  name: string;
  description: string;
  status: 'waiting' | 'working' | 'completed' | 'error';
  progress: number;
  color: string;
  icon: React.ReactNode;
  details: string[];
  currentTask: string;

}

interface AgentsWorkingPageProps {
  formData: any;
  onComplete: (results: any) => void;
  onClose: () => void;
}

const AgentsWorkingPage: React.FC<AgentsWorkingPageProps> = ({ formData, onComplete, onClose }) => {
  const [agents, setAgents] = useState<AgentWork[]>([
    {
      id: 'semantic',
      name: 'Semantic Agent',
      description: 'Analyzing token viability, market fit, and risk assessment',
      status: 'waiting',
      progress: 0,
      color: '#2196F3',
      icon: <BrainIcon />,
      details: [
        'Initializing market analysis algorithms...',
        'Evaluating market demand and competition analysis',
        'Assessing regulatory compliance requirements',
        'Analyzing tokenomics and economic model validation',
        'Calculating risk-reward ratio metrics',
        'Generating comprehensive market sentiment analysis',
        'Finalizing viability assessment report'
      ],
      currentTask: 'Initializing analysis...',
      
    },
    {
      id: 'fundraiser',
      name: 'Fundraiser Agent',
      description: 'Alerting liquidity providers and potential investors',
      status: 'waiting',
      progress: 0,
      color: '#4CAF50',
      icon: <ChartIcon />,
      details: [
        'Initializing liquidity provider database connection...',
        'Scanning liquidity provider database for matches',
        'Analyzing investor preferences and risk tolerance',
        'Calculating optimal fundraising strategy parameters',
        'Preparing investor outreach materials and templates',
        'Estimating initial liquidity potential and market depth',
        'Finalizing investor communication strategy'
      ],
      currentTask: 'Preparing to launch...',
      
    },
    {
      id: 'execution',
      name: 'Execution Agent',
      description: 'Generating smart contracts and deployment scripts',
      status: 'waiting',
      progress: 0,
      color: '#FF9800',
      icon: <CodeIcon />,
      details: [
        'Initializing smart contract development environment...',
        'Designing smart contract architecture and security model',
        'Implementing security best practices and audit trails',
        'Optimizing gas efficiency and transaction costs',
        'Creating deployment automation and testing scripts',
        'Preparing comprehensive audit documentation',
        'Finalizing deployment readiness checklist'
      ],
      currentTask: 'Standby mode...',
      
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initialization');
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [agentResults, setAgentResults] = useState<any>(null);
  const [canDeploy, setCanDeploy] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [currentAgentDetails, setCurrentAgentDetails] = useState<string>('');

  useEffect(() => {
    if (!isPaused) {
      startAgentWorkflow();
    }
  }, [isPaused]);

  const addSystemLog = (message: string) => {
    setSystemLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startAgentWorkflow = () => {
    addSystemLog('🚀 Starting AI Agent Workflow for Token Creation');
    addSystemLog('📋 Initializing system resources and agent coordination');
    
    // Start with Semantic Agent
    setTimeout(() => startAgent('semantic'), 1000);
    
    // Start Fundraiser Agent after 2 seconds
    setTimeout(() => startAgent('fundraiser'), 3000);
    
    // Start Execution Agent after 4 seconds
    setTimeout(() => startAgent('execution'), 5000);
  };

  const startAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      addSystemLog(`🤖 ${agent.name} is now active and beginning analysis`);
      setCurrentPhase(`${agent.name} Phase`);
      setCurrentAgentDetails(agent.description);
      
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, status: 'working', progress: 0 }
          : a
      ));

      // Simulate work progress with detailed logging
      const interval = setInterval(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === agentId && a.status === 'working') {
            const newProgress = Math.min(a.progress + Math.random() * 8, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              addSystemLog(`✅ ${a.name} has completed all tasks successfully`);
              return { ...a, status: 'completed', progress: 100 };
            }
            
            // Add progress logs at key milestones
            if (newProgress > a.progress && newProgress % 25 === 0) {
              addSystemLog(`📊 ${a.name} progress: ${Math.round(newProgress)}% - ${a.currentTask}`);
            }
            
            return { ...a, progress: newProgress };
          }
          return a;
        }));
      }, 300);

      // Update current task and phase with detailed progression
      let taskIndex = 0;
      const taskInterval = setInterval(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === agentId && a.status === 'working') {
            const newTaskIndex = Math.min(taskIndex + 1, a.details.length - 1);
            taskIndex = newTaskIndex;
            const newTask = a.details[newTaskIndex];
            
            addSystemLog(`🔄 ${a.name} is now: ${newTask}`);
            setCurrentAgentDetails(newTask);
            
            return { ...a, currentTask: newTask };
          }
          return a;
        }));
        
        if (taskIndex >= (agent?.details.length || 0) - 1) {
          clearInterval(taskInterval);
        }
      }, 2500);
    }
  };

  useEffect(() => {
    // Calculate overall progress
    const totalProgress = agents.reduce((sum, agent) => sum + agent.progress, 0);
    const averageProgress = totalProgress / agents.length;
    setOverallProgress(averageProgress);

    // Check if all agents are complete
    if (agents.every(agent => agent.status === 'completed')) {
      setTimeout(() => {
        setShowResults(true);
      }, 2000);
    }
  }, [agents]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'waiting',
      progress: 0,
      currentTask: agent.details[0]
    })));
    setOverallProgress(0);
    setCurrentPhase('Initialization');
    setIsPaused(false);
  };

  const handleComplete = () => {
    const results = {
      semanticAgent: {
        status: 'completed',
        marketAnalysis: 'High market demand for DeFi tokens with strong community focus',
        competitionAnalysis: 'Moderate competition with unique value proposition identified',
        regulatoryCompliance: 'Compliant with current DeFi regulations and guidelines',
        tokenomicsModel: 'Sustainable tokenomics with 60% community allocation',
        riskAssessment: 'Low to medium risk with strong mitigation strategies',
        message: 'Market analysis completed successfully. Token shows strong potential for growth.'
      },
      liquidityAgent: {
        status: 'completed',
        liquidityStrategy: 'Multi-pool approach with automated market making',
        poolDistribution: '40% ETH pair, 30% USDC pair, 30% stablecoin pairs',
        yieldOptimization: 'Expected 15-25% APY through liquidity mining',
        marketMaking: 'Advanced AMM with concentrated liquidity positions',
        message: 'Liquidity strategy optimized for maximum yield and stability.'
      },
      smartContractAgent: {
        status: 'completed',
        contractSecurity: 'High security with multiple audit recommendations',
        gasOptimization: 'Optimized for cost-effective transactions',
        upgradeability: 'Modular design with upgradeable components',
        auditStatus: 'Ready for professional security audit',
        message: 'Smart contract architecture completed with security best practices.'
      },
      tokenSpecs: {
        name: formData.tokenName || 'TeaLeaves Token',
        symbol: formData.tokenSymbol || 'TEA',
        totalSupply: '1,000,000,000 TEA',
        initialPrice: '$0.10',
        marketCap: '$100,000,000',
        image: '/images/default-tree-token.svg'
      }
    };
    setAgentResults(results);
    setShowResults(true);
    setCanDeploy(true);
  };

  const handleDeployToLeaderboard = () => {
    // Create token data for leaderboard
    const tokenData = {
      id: Date.now().toString(),
      name: formData.tokenName || 'TeaLeaves Token',
      symbol: formData.tokenSymbol || 'TEA',
      chain: formData.chain || 'Ethereum',
      assetClass: formData.assetClass || 'DeFi',
      description: formData.description || 'AI-powered DeFi strategy token',
      fundraisingAmount: formData.fundraisingAmount || '$100,000',
      pricing: formData.pricing || 'Market-based',
      liquidityOption: formData.liquidityOption || 'Automated',
      image: '/images/default-tree-token.svg', // Default tree token image
      createdAt: new Date().toISOString(),
      status: 'active',
      marketCap: '$0',
      volume24h: '$0',
      priceChange24h: '0%',
      liquidity: '$0',
      holders: 0,
      agentResults: agentResults
    };

    // Store in localStorage for leaderboard
    const existingTokens = JSON.parse(localStorage.getItem('teaLeavesTokens') || '[]');
    existingTokens.push(tokenData);
    localStorage.setItem('teaLeavesTokens', JSON.stringify(existingTokens));

    // Show deployment success
    setDeploymentSuccess(true);
    
    // Call onComplete with deployment success
    onComplete({ ...agentResults, deployed: true, tokenData });
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
              🚀 AI Agents at Work
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
              Your token creation request is being processed by our advanced AI agents
            </Typography>
          </Box>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ 
            mb: 6, 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Overall Progress: {Math.round(overallProgress)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                  Current Phase: {currentPhase}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4CAF50', mb: 3, fontStyle: 'italic' }}>
                  {currentAgentDetails}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={overallProgress}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4CAF50, #2196F3, #FF9800)',
                      borderRadius: 6
                    }
                  }}
                />
              </Box>

              {/* Control Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handlePauseResume}
                  startIcon={isPaused ? <PlayIcon /> : <PauseIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRestart}
                  startIcon={<RefreshIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Restart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ 
            mb: 6, 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                📋 System Activity Logs
              </Typography>
              <Box sx={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                p: 2,
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {systemLogs.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#B0BEC5', textAlign: 'center' }}>
                    Waiting for system initialization...
                  </Typography>
                ) : (
                  systemLogs.map((log, index) => (
                    <Box key={index} sx={{ 
                      color: 'white', 
                      mb: 1, 
                      opacity: index < systemLogs.length - 10 ? 0.6 : 1,
                      transition: 'opacity 0.3s ease'
                    }}>
                      {log}
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agent Cards */}
        <Grid container spacing={4}>
          {agents.map((agent, index) => (
            <Grid item xs={12} md={4} key={agent.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${agent.color}15 0%, ${agent.color}05 100%)`,
                  border: `2px solid ${agent.status === 'working' ? agent.color : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px ${agent.color}30`
                  }
                }}>
                  {/* Status Indicator */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: agent.status === 'completed' ? '#4CAF50' : 
                               agent.status === 'working' ? agent.color : '#666',
                    boxShadow: agent.status === 'working' ? `0 0 20px ${agent.color}` : 'none',
                    animation: agent.status === 'working' ? 'pulse 2s infinite' : 'none'
                  }} />

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Agent Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}80)`,
                          boxShadow: `0 8px 32px ${agent.color}40`
                        }}
                      >
                        {agent.icon}
                      </Avatar>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {agent.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 2 }}>
                        {agent.description}
                      </Typography>
                      <Chip
                        label={agent.status}
                        color={agent.status === 'completed' ? 'success' : 
                               agent.status === 'working' ? 'primary' : 'default'}
                        variant="outlined"
                        sx={{ color: 'white' }}
                      />
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                          Progress
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {Math.round(agent.progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={agent.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${agent.color}, ${agent.color}80)`,
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    {/* Current Task */}
                    <Box sx={{ mb: 3, flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                        Current Task:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic' }}>
                        {agent.currentTask}
                      </Typography>
                    </Box>

                    {/* Estimated Time */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
    
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Token Info Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card sx={{ 
            mt: 6,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                🎯 Token Creation Request
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Token Name: <span style={{ color: 'white' }}>{formData.tokenName}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Chain: <span style={{ color: 'white' }}>{formData.chain}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Category: <span style={{ color: 'white' }}>{formData.assetClass}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Fundraising: <span style={{ color: 'white' }}>{formData.fundraisingAmount}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Liquidity: <span style={{ color: 'white' }}>{formData.liquidityOption}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Description: <span style={{ color: 'white' }}>{formData.description.substring(0, 50)}...</span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion Section with Deploy Button */}
        {agents.every(agent => agent.status === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Card sx={{ 
              mt: 4,
              background: 'rgba(76, 175, 80, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '20px'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  🎉 Token Creation Complete!
                </Typography>
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 4, fontWeight: 500 }}>
                  All AI agents have successfully completed their analysis. Your token is ready to be deployed to the Leaderboard!
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleComplete}
                    startIcon={<LaunchIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976D2, #1565C0)'
                      }
                    }}
                  >
                    View Results
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleDeployToLeaderboard}
                    startIcon={<LaunchIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E7D32, #1B5E20)'
                      }
                    }}
                  >
                    🚀 Deploy to Leaderboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Deployment Success Message */}
        {deploymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ 
              mt: 4,
              background: 'rgba(76, 175, 80, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(76, 175, 80, 0.4)',
              borderRadius: '20px'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  🎉 Token Successfully Deployed!
                </Typography>
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 4, fontWeight: 500 }}>
                  Your token has been successfully deployed to the Leaderboard! You can now view it in the Token Leaderboard section.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => onComplete({ deployed: true, message: 'Token deployed successfully' })}
                    startIcon={<LaunchIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E7D32, #1B5E20)'
                      }
                    }}
                  >
                    Continue to App
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>

      {/* Results Page */}
      {showResults && agentResults && (
        <TokenCreationResultsPage
          results={agentResults}
          onClose={() => setShowResults(false)}
          onProceed={() => {
            setShowResults(false);
            handleDeployToLeaderboard();
          }}
        />
      )}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default AgentsWorkingPage;
