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
import { motion, AnimatePresence } from 'framer-motion';
import {
  SmartToy as AgentIcon,
  VerifiedUser as KYCIcon,
  AccountBalance as BudgetIcon,
  Security as ValidatorIcon,
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon
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
  estimatedTime: string;
  riskLevel?: 'low' | 'medium' | 'high';
  complianceStatus?: 'pending' | 'approved' | 'rejected';
}

interface LiquidityProviderAgentsPageProps {
  open: boolean;
  onComplete: (results: any) => void;
  onClose: () => void;
}

const LiquidityProviderAgentsPage: React.FC<LiquidityProviderAgentsPageProps> = ({ open, onComplete, onClose }) => {
  const [agents, setAgents] = useState<AgentWork[]>([
    {
      id: 'kyc',
      name: 'KYC Agent',
      description: 'Verifying identity, compliance, and regulatory requirements',
      status: 'waiting',
      progress: 0,
      color: '#2196F3',
      icon: <KYCIcon />,
      details: [
        'Initializing identity verification protocols...',
        'Scanning government databases for identity validation',
        'Verifying address and residency documentation',
        'Checking regulatory compliance status',
        'Validating financial background and history',
        'Running anti-money laundering (AML) checks',
        'Finalizing KYC compliance report'
      ],
      currentTask: 'Initializing identity verification...',
      estimatedTime: '3-4 minutes',
      complianceStatus: 'pending'
    },
    {
      id: 'budget',
      name: 'Budget Agent',
      description: 'Analyzing liquidity requirements and financial planning',
      status: 'waiting',
      progress: 0,
      color: '#4CAF50',
      icon: <BudgetIcon />,
      details: [
        'Initializing financial analysis algorithms...',
        'Calculating optimal liquidity pool requirements',
        'Analyzing market depth and volume patterns',
        'Estimating capital efficiency metrics',
        'Projecting yield and return calculations',
        'Optimizing risk-adjusted portfolio allocation',
        'Finalizing budget and liquidity strategy'
      ],
      currentTask: 'Preparing financial analysis...',
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'validator',
      name: 'Validator Agent',
      description: 'Validating smart contracts and security protocols',
      status: 'waiting',
      progress: 0,
      color: '#FF9800',
      icon: <ValidatorIcon />,
      details: [
        'Initializing smart contract validation environment...',
        'Auditing smart contract security and logic',
        'Validating liquidity pool mathematics',
        'Checking for common vulnerabilities and exploits',
        'Verifying oracle integrations and price feeds',
        'Testing emergency shutdown procedures',
        'Finalizing security validation report'
      ],
      currentTask: 'Standby mode...',
      estimatedTime: '4-5 minutes',
      riskLevel: 'low'
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initialization');
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [currentAgentDetails, setCurrentAgentDetails] = useState<string>('');
  const [complianceScore, setComplianceScore] = useState(0);
  const [riskAssessment, setRiskAssessment] = useState<string>('');

  useEffect(() => {
    if (!isPaused) {
      startAgentWorkflow();
    }
  }, [isPaused]);

  const addSystemLog = (message: string) => {
    setSystemLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startAgentWorkflow = () => {
    addSystemLog('🚀 Starting Liquidity Provider Agent Workflow');
    addSystemLog('📋 Initializing KYC, Budget, and Validator agents');
    
    // Start with KYC Agent
    setTimeout(() => startAgent('kyc'), 1000);
    
    // Start Budget Agent after 2 seconds
    setTimeout(() => startAgent('budget'), 3000);
    
    // Start Validator Agent after 4 seconds
    setTimeout(() => startAgent('validator'), 5000);
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
              
              // Update agent-specific status
              let updatedAgent: AgentWork = { ...a, status: 'completed' as const, progress: 100 };
              if (a.id === 'kyc') {
                updatedAgent = { ...updatedAgent, complianceStatus: 'approved' as const };
                setComplianceScore(95);
                addSystemLog('✅ KYC compliance approved with 95% score');
              } else if (a.id === 'validator') {
                updatedAgent = { ...updatedAgent, riskLevel: 'low' as const };
                setRiskAssessment('Low risk - All security checks passed');
                addSystemLog('✅ Security validation completed - Low risk assessment');
              }
              
              return updatedAgent;
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
      status: 'waiting' as const,
      progress: 0,
      currentTask: agent.details[0],
      complianceStatus: agent.id === 'kyc' ? ('pending' as const) : undefined,
      riskLevel: agent.id === 'validator' ? ('low' as const) : undefined
    })));
    setOverallProgress(0);
    setCurrentPhase('Initialization');
    setIsPaused(false);
    setComplianceScore(0);
    setRiskAssessment('');
    setSystemLogs([]);
  };

  const handleComplete = () => {
    const results = {
      kycAgent: {
        status: 'completed',
        complianceScore: complianceScore,
        complianceStatus: 'approved',
        message: 'KYC verification completed successfully. All compliance requirements met.'
      },
      budgetAgent: {
        status: 'completed',
        liquidityRequirement: '$2.5M',
        optimalPoolSize: '500,000 tokens',
        projectedYield: '12.5% APY',
        message: 'Budget analysis completed. Optimal liquidity strategy identified.'
      },
      validatorAgent: {
        status: 'completed',
        riskLevel: 'low',
        securityScore: '98/100',
        vulnerabilities: 'None detected',
        message: 'Security validation completed. All smart contracts verified and secure.'
      }
    };
    onComplete(results);
  };

  if (!open) return null;

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
              💧 Liquidity Provider Agents
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
              Advanced AI agents are analyzing your liquidity requirements, verifying compliance, and validating security protocols
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
                      
                      {/* Status and Additional Info */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={agent.status}
                          color={agent.status === 'completed' ? 'success' : 
                                 agent.status === 'working' ? 'primary' : 'default'}
                          variant="outlined"
                          sx={{ color: 'white' }}
                        />
                        
                        {agent.complianceStatus && (
                          <Chip
                            icon={agent.complianceStatus === 'approved' ? <CheckIcon /> : <WarningIcon />}
                            label={agent.complianceStatus}
                            color={agent.complianceStatus === 'approved' ? 'success' : 'warning'}
                            size="small"
                            sx={{ color: 'white' }}
                          />
                        )}
                        
                        {agent.riskLevel && (
                          <Chip
                            icon={<InfoIcon />}
                            label={`Risk: ${agent.riskLevel}`}
                            color={agent.riskLevel === 'low' ? 'success' : 
                                   agent.riskLevel === 'medium' ? 'warning' : 'error'}
                            size="small"
                            sx={{ color: 'white' }}
                          />
                        )}
                      </Box>
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
                        Estimated Time: {agent.estimatedTime}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Compliance & Risk Summary */}
        {(complianceScore > 0 || riskAssessment) && (
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
                  📊 Compliance & Risk Assessment
                </Typography>
                <Grid container spacing={3}>
                  {complianceScore > 0 && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: '12px' }}>
                        <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                          {complianceScore}%
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                          KYC Compliance Score
                        </Typography>
                        <Chip 
                          icon={<CheckIcon />} 
                          label="Approved" 
                          color="success" 
                          sx={{ color: 'white' }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {riskAssessment && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: '12px' }}>
                        <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                          ✓
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                          Security Risk Level
                        </Typography>
                        <Chip 
                          icon={<CheckIcon />} 
                          label="Low Risk" 
                          color="success" 
                          sx={{ color: 'white' }}
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>

      {/* Results Dialog */}
      <Dialog
        open={showResults}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#2E7D32' }}>
          🎉 Liquidity Provider Analysis Complete!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
            All AI agents have successfully completed their analysis. Your liquidity provider application is ready for review.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleComplete}
              startIcon={<LaunchIcon />}
              sx={{
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2E7D32, #1B5E20)'
                }
              }}
            >
              View Results & Proceed
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

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

export default LiquidityProviderAgentsPage;
