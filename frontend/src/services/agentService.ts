import axios from 'axios';

// Types for agent communication
export interface AgentMessage {
  agentId: string;
  messageType: 'start' | 'stop' | 'configure' | 'analyze' | 'generate' | 'optimize';
  data?: any;
  parameters?: Record<string, any>;
}

export interface AgentResponse {
  agentId: string;
  responseType: string;
  data: any;
  confidence: number;
  timestamp: string;
  status: 'success' | 'error' | 'processing';
}

export interface AgentConfig {
  agentId: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  description: string;
  confidence: number;
  lastUpdate: string;
  performance: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

export interface AssetTokenizationRequest {
  assetClass: string;
  tokenType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'advanced';
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: string;
  liquidityNeeds: 'high' | 'medium' | 'low';
}

export interface MarketAnalysisRequest {
  symbol: string;
  timeframe: string;
  analysisType: 'technical' | 'fundamental' | 'sentiment' | 'hybrid';
  indicators?: string[];
}

export interface RiskAssessmentRequest {
  portfolio: any;
  marketConditions: any;
  riskThreshold: number;
}

export interface PortfolioOptimizationRequest {
  currentPortfolio: any;
  constraints: {
    maxPositionSize: number;
    minDiversification: number;
    maxSectorExposure: number;
  };
  targetReturn?: number;
  riskTolerance: number;
}

class AgentService {
  private baseURL: string;
  private apiKey: string | null;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    this.apiKey = localStorage.getItem('tea_leaves_api_key');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // Get all available agents
  async getAgents(): Promise<AgentConfig[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/agents`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  }

  // Get agent by ID
  async getAgent(agentId: string): Promise<AgentConfig | null> {
    try {
      const response = await axios.get(`${this.baseURL}/api/agents/${agentId}`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  // Start an agent
  async startAgent(agentId: string, parameters?: Record<string, any>): Promise<AgentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/agents/${agentId}/start`,
        { parameters },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error starting agent:', error);
      throw error;
    }
  }

  // Stop an agent
  async stopAgent(agentId: string): Promise<AgentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/agents/${agentId}/stop`,
        {},
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error stopping agent:', error);
      throw error;
    }
  }

  // Configure an agent
  async configureAgent(agentId: string, config: Partial<AgentConfig>): Promise<AgentResponse> {
    try {
      const response = await axios.put(
        `${this.baseURL}/api/agents/${agentId}/configure`,
        config,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error configuring agent:', error);
      throw error;
    }
  }

  // Analyze market data
  async analyzeMarket(request: MarketAnalysisRequest): Promise<AgentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/agents/analyze`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error analyzing market:', error);
      throw error;
    }
  }

  // Assess portfolio risk
  async assessRisk(request: RiskAssessmentRequest): Promise<AgentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/agents/risk-assessment`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error assessing risk:', error);
      throw error;
    }
  }

  // Optimize portfolio
  async optimizePortfolio(request: PortfolioOptimizationRequest): Promise<AgentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/agents/optimize-portfolio`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error optimizing portfolio:', error);
      throw error;
    }
  }

  // Generate asset tokenization insights
  async generateTokenizationInsights(request: AssetTokenizationRequest): Promise<AgentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/agents/tokenization-insights`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error generating tokenization insights:', error);
      throw error;
    }
  }

  // Get agent performance metrics
  async getAgentPerformance(agentId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/api/agents/${agentId}/performance`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      return null;
    }
  }

  // Get system health status
  async getSystemHealth(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/api/health`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      return null;
    }
  }

  // Set API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('tea_leaves_api_key', apiKey);
  }

  // Remove API key
  removeApiKey() {
    this.apiKey = null;
    localStorage.removeItem('tea_leaves_api_key');
  }

  // Check if API key is set
  hasApiKey(): boolean {
    return !!this.apiKey;
  }
}

export default new AgentService(); 