use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::gemma_integration::{GemmaIntegration, GemmaConfig};

/// Tea-leaves agent types for different trading functions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AgentType {
    StrategyGenerator,
    MarketAnalyzer,
    RiskManager,
    PortfolioOptimizer,
    SentimentAnalyzer,
    TechnicalAnalyzer,
    FactorDiscovery,
    BacktestCoordinator,
}

/// Tea-leaves agent status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AgentStatus {
    Idle,
    Running,
    Completed,
    Failed(String),
}

/// Tea-leaves agent configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentConfig {
    pub agent_type: AgentType,
    pub name: String,
    pub description: String,
    pub parameters: HashMap<String, serde_json::Value>,
    pub tea_leaves_config: TeaLeavesConfig,
}

/// Tea-leaves platform configuration for agents
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesConfig {
    pub project_id: String,
    pub region: String,
    pub model_name: String,
    pub api_key: Option<String>,
    pub gemma_endpoint: String,
    pub platform_version: String,
}

/// Tea-leaves agent message types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AgentMessage {
    StartAnalysis {
        market_data: MarketData,
        strategy_params: StrategyParameters,
    },
    GenerateStrategy {
        requirements: StrategyRequirements,
        risk_profile: RiskProfile,
    },
    OptimizePortfolio {
        current_portfolio: Portfolio,
        constraints: PortfolioConstraints,
    },
    AnalyzeRisk {
        position: Position,
        market_conditions: MarketConditions,
    },
    DiscoverFactors {
        market_data: MarketData,
        discovery_params: FactorDiscoveryParams,
    },
    CoordinateBacktest {
        strategy: Strategy,
        backtest_params: BacktestParameters,
    },
}

/// Tea-leaves market data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketData {
    pub symbol: String,
    pub price: f64,
    pub volume: f64,
    pub timestamp: i64,
    pub indicators: HashMap<String, f64>,
    pub tea_leaves_metrics: TeaLeavesMetrics,
}

/// Tea-leaves specific market metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesMetrics {
    pub volatility_regime: String,
    pub trend_strength: f64,
    pub market_efficiency: f64,
    pub factor_exposure: HashMap<String, f64>,
}

/// Tea-leaves strategy parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StrategyParameters {
    pub asset: String,
    pub timeframe: String,
    pub risk_level: RiskLevel,
    pub target_return: f64,
    pub max_drawdown: f64,
    pub tea_leaves_factors: Vec<String>,
}

/// Tea-leaves strategy requirements
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StrategyRequirements {
    pub asset_class: String,
    pub strategy_type: String,
    pub complexity: ComplexityLevel,
    pub automation_level: AutomationLevel,
    pub tea_leaves_optimization: bool,
}

/// Tea-leaves risk profile
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskProfile {
    pub risk_tolerance: RiskTolerance,
    pub investment_horizon: String,
    pub liquidity_needs: LiquidityNeeds,
    pub tea_leaves_risk_model: String,
}

/// Tea-leaves portfolio structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Portfolio {
    pub positions: Vec<Position>,
    pub total_value: f64,
    pub cash: f64,
    pub tea_leaves_score: f64,
}

/// Tea-leaves position in portfolio
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub symbol: String,
    pub quantity: f64,
    pub average_price: f64,
    pub current_value: f64,
    pub tea_leaves_rating: f64,
}

/// Tea-leaves portfolio constraints
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortfolioConstraints {
    pub max_position_size: f64,
    pub min_diversification: f64,
    pub max_sector_exposure: f64,
    pub tea_leaves_factor_limits: HashMap<String, f64>,
}

/// Tea-leaves market conditions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketConditions {
    pub volatility: f64,
    pub trend: MarketTrend,
    pub sentiment: MarketSentiment,
    pub tea_leaves_regime: String,
}

/// Tea-leaves factor discovery parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FactorDiscoveryParams {
    pub asset_class: String,
    pub time_horizon: String,
    pub min_importance: f64,
    pub max_correlation: f64,
}

/// Tea-leaves backtest parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BacktestParameters {
    pub start_date: String,
    pub end_date: String,
    pub initial_capital: f64,
    pub transaction_costs: f64,
    pub tea_leaves_metrics: bool,
}

/// Enums for various tea-leaves parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    VeryHigh,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ComplexityLevel {
    Simple,
    Moderate,
    Complex,
    Advanced,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AutomationLevel {
    Manual,
    SemiAutomated,
    FullyAutomated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RiskTolerance {
    Conservative,
    Moderate,
    Aggressive,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LiquidityNeeds {
    High,
    Medium,
    Low,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MarketTrend {
    Bullish,
    Bearish,
    Sideways,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MarketSentiment {
    Positive,
    Neutral,
    Negative,
}

/// Tea-leaves agent trait for different agent implementations
#[async_trait::async_trait]
pub trait Agent {
    async fn process_message(&mut self, message: AgentMessage) -> Result<AgentResponse, AgentError>;
    async fn get_status(&self) -> AgentStatus;
    async fn get_config(&self) -> &AgentConfig;
}

/// Tea-leaves agent response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentResponse {
    pub agent_id: String,
    pub response_type: AgentResponseType,
    pub data: serde_json::Value,
    pub confidence: f64,
    pub timestamp: i64,
    pub tea_leaves_metadata: TeaLeavesMetadata,
}

/// Tea-leaves metadata for responses
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesMetadata {
    pub platform_version: String,
    pub model_used: String,
    pub processing_time_ms: u64,
    pub quality_score: f64,
}

/// Tea-leaves agent response types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AgentResponseType {
    StrategyGenerated(Strategy),
    MarketAnalysis(MarketAnalysis),
    RiskAssessment(RiskAssessment),
    PortfolioRecommendation(PortfolioRecommendation),
    FactorsDiscovered(Vec<Factor>),
    BacktestResults(BacktestResults),
    Error(String),
}

/// Tea-leaves strategy output
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Strategy {
    pub name: String,
    pub description: String,
    pub entry_rules: Vec<TradingRule>,
    pub exit_rules: Vec<TradingRule>,
    pub risk_management: RiskManagementRules,
    pub expected_return: f64,
    pub max_drawdown: f64,
    pub tea_leaves_optimization: TeaLeavesOptimization,
}

/// Tea-leaves optimization details
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesOptimization {
    pub factor_weights: HashMap<String, f64>,
    pub regime_adaptation: bool,
    pub dynamic_rebalancing: bool,
    pub performance_metrics: HashMap<String, f64>,
}

/// Tea-leaves trading rule
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradingRule {
    pub condition: String,
    pub action: String,
    pub parameters: HashMap<String, f64>,
    pub tea_leaves_factors: Vec<String>,
}

/// Tea-leaves risk management rules
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskManagementRules {
    pub stop_loss: f64,
    pub take_profit: f64,
    pub position_sizing: PositionSizing,
    pub max_positions: usize,
    pub tea_leaves_risk_model: String,
}

/// Tea-leaves position sizing
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionSizing {
    pub method: SizingMethod,
    pub risk_per_trade: f64,
    pub max_portfolio_risk: f64,
    pub tea_leaves_optimization: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SizingMethod {
    FixedAmount(f64),
    PercentageOfPortfolio(f64),
    KellyCriterion,
    RiskBased(f64),
    TeaLeavesOptimized,
}

/// Tea-leaves market analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketAnalysis {
    pub symbol: String,
    pub analysis_type: AnalysisType,
    pub signals: Vec<Signal>,
    pub summary: String,
    pub confidence: f64,
    pub tea_leaves_insights: TeaLeavesInsights,
}

/// Tea-leaves specific insights
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesInsights {
    pub regime_identification: String,
    pub factor_exposure: HashMap<String, f64>,
    pub optimal_timeframe: String,
    pub risk_adjustment: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AnalysisType {
    Technical,
    Fundamental,
    Sentiment,
    Hybrid,
    TeaLeavesFactor,
}

/// Tea-leaves signal
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Signal {
    pub signal_type: SignalType,
    pub strength: f64,
    pub description: String,
    pub timestamp: i64,
    pub tea_leaves_confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SignalType {
    Buy,
    Sell,
    Hold,
    StrongBuy,
    StrongSell,
}

/// Tea-leaves risk assessment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskAssessment {
    pub overall_risk: RiskScore,
    pub risk_factors: Vec<RiskFactor>,
    pub recommendations: Vec<String>,
    pub tea_leaves_risk_model: TeaLeavesRiskModel,
}

/// Tea-leaves risk model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesRiskModel {
    pub model_version: String,
    pub regime_sensitivity: HashMap<String, f64>,
    pub factor_contribution: HashMap<String, f64>,
    pub stress_test_results: HashMap<String, f64>,
}

/// Tea-leaves risk score
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskScore {
    pub score: f64,
    pub level: RiskLevel,
    pub description: String,
    pub tea_leaves_adjustment: f64,
}

/// Tea-leaves risk factor
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskFactor {
    pub factor: String,
    pub impact: f64,
    pub description: String,
    pub tea_leaves_mitigation: String,
}

/// Tea-leaves portfolio recommendation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortfolioRecommendation {
    pub current_allocation: HashMap<String, f64>,
    pub recommended_allocation: HashMap<String, f64>,
    pub rebalancing_actions: Vec<RebalancingAction>,
    pub expected_improvement: f64,
    pub tea_leaves_optimization: TeaLeavesPortfolioOptimization,
}

/// Tea-leaves portfolio optimization details
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesPortfolioOptimization {
    pub factor_tilts: HashMap<String, f64>,
    pub regime_adaptation: HashMap<String, f64>,
    pub risk_parity: bool,
    pub expected_tealeaves_score: f64,
}

/// Tea-leaves rebalancing action
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RebalancingAction {
    pub action_type: ActionType,
    pub symbol: String,
    pub quantity: f64,
    pub reason: String,
    pub tea_leaves_priority: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ActionType {
    Buy,
    Sell,
    Hold,
}

/// Tea-leaves factor structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Factor {
    pub name: String,
    pub description: String,
    pub formula: String,
    pub importance_score: f64,
    pub historical_performance: Vec<f64>,
    pub tea_leaves_metadata: FactorMetadata,
}

/// Tea-leaves factor metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FactorMetadata {
    pub discovery_date: String,
    pub regime_performance: HashMap<String, f64>,
    pub correlation_stability: f64,
    pub implementation_complexity: String,
}

/// Tea-leaves backtest results
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BacktestResults {
    pub total_return: f64,
    pub sharpe_ratio: f64,
    pub max_drawdown: f64,
    pub win_rate: f64,
    pub tea_leaves_metrics: TeaLeavesBacktestMetrics,
}

/// Tea-leaves backtest metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesBacktestMetrics {
    pub factor_contribution: HashMap<String, f64>,
    pub regime_performance: HashMap<String, f64>,
    pub risk_adjusted_score: f64,
    pub optimization_impact: f64,
}

/// Tea-leaves agent error
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentError {
    pub error_type: String,
    pub message: String,
    pub details: Option<serde_json::Value>,
    pub tea_leaves_context: String,
}

/// Tea-leaves agent manager for coordinating multiple agents
pub struct AgentManager {
    agents: Arc<RwLock<HashMap<String, Box<dyn Agent + Send + Sync>>>>,
    message_tx: mpsc::Sender<(String, AgentMessage)>,
    message_rx: mpsc::Receiver<(String, AgentResponse)>,
}

impl AgentManager {
    pub fn new() -> Self {
        let (message_tx, message_rx) = mpsc::channel(100);
        Self {
            agents: Arc::new(RwLock::new(HashMap::new())),
            message_tx,
            message_rx,
        }
    }

    pub async fn register_agent(&self, agent_id: String, agent: Box<dyn Agent + Send + Sync>) {
        let mut agents = self.agents.write().await;
        agents.insert(agent_id, agent);
    }

    pub async fn send_message(&self, agent_id: String, message: AgentMessage) -> Result<(), AgentError> {
        self.message_tx
            .send((agent_id, message))
            .await
            .map_err(|e| AgentError {
                error_type: "ChannelError".to_string(),
                message: e.to_string(),
                details: None,
                tea_leaves_context: "Agent communication".to_string(),
            })
    }

    pub async fn get_agent_status(&self, agent_id: &str) -> Option<AgentStatus> {
        let agents = self.agents.read().await;
        agents.get(agent_id).map(|agent| {
            // This would need to be implemented properly with async
            AgentStatus::Idle
        })
    }
}

/// Tea-leaves AI Platform integration with Gemma
pub struct TeaLeavesAIIntegration {
    project_id: String,
    region: String,
    api_key: Option<String>,
    gemma_integration: GemmaIntegration,
}

impl TeaLeavesAIIntegration {
    pub fn new(project_id: String, region: String, api_key: Option<String>) -> Self {
        let gemma_config = GemmaConfig::default();
        let gemma_integration = GemmaIntegration::new(gemma_config.base_url);
        
        Self {
            project_id,
            region,
            api_key,
            gemma_integration,
        }
    }

    pub async fn generate_text(&self, prompt: &str, model: &str) -> Result<String, AgentError> {
        // Use Gemma for text generation
        self.gemma_integration.generate_text(prompt, Some(1024))
            .await
            .map_err(|e| AgentError {
                error_type: "GemmaError".to_string(),
                message: e.to_string(),
                details: None,
                tea_leaves_context: "AI text generation".to_string(),
            })
    }

    pub async fn analyze_sentiment(&self, text: &str) -> Result<f64, AgentError> {
        // Use Gemma for sentiment analysis
        let sentiment_text = self.gemma_integration.analyze_sentiment(text).await
            .map_err(|e| AgentError {
                error_type: "GemmaError".to_string(),
                message: e.to_string(),
                details: None,
                tea_leaves_context: "Sentiment analysis".to_string(),
            })?;
        
        // Parse sentiment score from text (simplified)
        if sentiment_text.to_lowercase().contains("positive") {
            Ok(0.8)
        } else if sentiment_text.to_lowercase().contains("negative") {
            Ok(-0.8)
        } else {
            Ok(0.0)
        }
    }

    pub async fn predict_market_movement(&self, data: &MarketData) -> Result<f64, AgentError> {
        // Use Gemma for market prediction
        let analysis_prompt = format!(
            "Analyze this tea-leaves market data and predict price movement (-1 to 1): Symbol: {}, Price: {}, Volume: {}, Tea-leaves metrics: {:?}",
            data.symbol, data.price, data.volume, data.tea_leaves_metrics
        );
        
        let prediction_text = self.gemma_integration.generate_text(&analysis_prompt, Some(256)).await
            .map_err(|e| AgentError {
                error_type: "GemmaError".to_string(),
                message: e.to_string(),
                details: None,
                tea_leaves_context: "Market movement prediction".to_string(),
            })?;
        
        // Parse prediction from text (simplified)
        if prediction_text.to_lowercase().contains("up") || prediction_text.to_lowercase().contains("bullish") {
            Ok(0.5)
        } else if prediction_text.to_lowercase().contains("down") || prediction_text.to_lowercase().contains("bearish") {
            Ok(-0.5)
        } else {
            Ok(0.0)
        }
    }

    pub async fn test_gemma_connection(&self) -> Result<bool, AgentError> {
        self.gemma_integration.test_connection().await
            .map_err(|e| AgentError {
                error_type: "GemmaError".to_string(),
                message: e.to_string(),
                details: None,
                tea_leaves_context: "Connection testing".to_string(),
            })
    }
}

/// Tea-leaves Strategy Generator Agent
pub struct StrategyGeneratorAgent {
    config: AgentConfig,
    ai_integration: TeaLeavesAIIntegration,
    status: AgentStatus,
}

impl StrategyGeneratorAgent {
    pub fn new(config: AgentConfig) -> Self {
        let ai_integration = TeaLeavesAIIntegration::new(
            config.tea_leaves_config.project_id.clone(),
            config.tea_leaves_config.region.clone(),
            config.tea_leaves_config.api_key.clone(),
        );

        Self {
            config,
            ai_integration,
            status: AgentStatus::Idle,
        }
    }
}

#[async_trait::async_trait]
impl Agent for StrategyGeneratorAgent {
    async fn process_message(&mut self, message: AgentMessage) -> Result<AgentResponse, AgentError> {
        self.status = AgentStatus::Running;

        match message {
            AgentMessage::GenerateStrategy { requirements, risk_profile } => {
                let prompt = self.build_strategy_prompt(&requirements, &risk_profile);
                let generated_text = self.ai_integration.generate_text(&prompt, "gemma-3-4b").await?;
                
                // Parse the generated text into a strategy
                let strategy = self.parse_strategy_from_text(&generated_text)?;
                
                self.status = AgentStatus::Completed;
                
                Ok(AgentResponse {
                    agent_id: self.config.name.clone(),
                    response_type: AgentResponseType::StrategyGenerated(strategy),
                    data: serde_json::json!({}),
                    confidence: 0.85,
                    timestamp: chrono::Utc::now().timestamp(),
                    tea_leaves_metadata: TeaLeavesMetadata {
                        platform_version: "1.0.0".to_string(),
                        model_used: "gemma-3-4b".to_string(),
                        processing_time_ms: 0,
                        quality_score: 0.85,
                    },
                })
            }
            _ => Err(AgentError {
                error_type: "UnsupportedMessage".to_string(),
                message: "Strategy generator only supports GenerateStrategy messages".to_string(),
                details: None,
                tea_leaves_context: "Message processing".to_string(),
            }),
        }
    }

    async fn get_status(&self) -> AgentStatus {
        self.status.clone()
    }

    async fn get_config(&self) -> &AgentConfig {
        &self.config
    }
}

impl StrategyGeneratorAgent {
    fn build_strategy_prompt(&self, requirements: &StrategyRequirements, risk_profile: &RiskProfile) -> String {
        format!(
            "Generate a tea-leaves optimized trading strategy for {} with {} complexity and {} automation level. \
             Risk tolerance: {:?}, Investment horizon: {}, Liquidity needs: {:?}. \
             Use tea-leaves factor analysis and regime adaptation. \
             Provide a complete strategy with entry/exit rules and risk management.",
            requirements.asset_class,
            requirements.strategy_type,
            requirements.complexity,
            risk_profile.risk_tolerance,
            risk_profile.investment_horizon,
            risk_profile.liquidity_needs
        )
    }

    fn parse_strategy_from_text(&self, text: &str) -> Result<Strategy, AgentError> {
        // Implementation to parse generated text into Strategy struct
        // This would use NLP or structured parsing
        Ok(Strategy {
            name: "Tea-Leaves AI Generated Strategy".to_string(),
            description: text.to_string(),
            entry_rules: vec![],
            exit_rules: vec![],
            risk_management: RiskManagementRules {
                stop_loss: 0.05,
                take_profit: 0.15,
                position_sizing: PositionSizing {
                    method: SizingMethod::TeaLeavesOptimized,
                    risk_per_trade: 0.02,
                    max_portfolio_risk: 0.10,
                    tea_leaves_optimization: true,
                },
                max_positions: 5,
                tea_leaves_risk_model: "TeaLeaves_v1.0".to_string(),
            },
            expected_return: 0.12,
            max_drawdown: 0.08,
            tea_leaves_optimization: TeaLeavesOptimization {
                factor_weights: HashMap::new(),
                regime_adaptation: true,
                dynamic_rebalancing: true,
                performance_metrics: HashMap::new(),
            },
        })
    }
}

/// Tea-leaves Market Analyzer Agent
pub struct MarketAnalyzerAgent {
    config: AgentConfig,
    ai_integration: TeaLeavesAIIntegration,
    status: AgentStatus,
}

impl MarketAnalyzerAgent {
    pub fn new(config: AgentConfig) -> Self {
        let ai_integration = TeaLeavesAIIntegration::new(
            config.tea_leaves_config.project_id.clone(),
            config.tea_leaves_config.region.clone(),
            config.tea_leaves_config.api_key.clone(),
        );

        Self {
            config,
            ai_integration,
            status: AgentStatus::Idle,
        }
    }
}

#[async_trait::async_trait]
impl Agent for MarketAnalyzerAgent {
    async fn process_message(&mut self, message: AgentMessage) -> Result<AgentResponse, AgentError> {
        self.status = AgentStatus::Running;

        match message {
            AgentMessage::StartAnalysis { market_data, strategy_params } => {
                let analysis = self.analyze_market(&market_data, &strategy_params).await?;
                
                self.status = AgentStatus::Completed;
                
                Ok(AgentResponse {
                    agent_id: self.config.name.clone(),
                    response_type: AgentResponseType::MarketAnalysis(analysis),
                    data: serde_json::json!({}),
                    confidence: 0.80,
                    timestamp: chrono::Utc::now().timestamp(),
                    tea_leaves_metadata: TeaLeavesMetadata {
                        platform_version: "1.0.0".to_string(),
                        model_used: "gemma-3-4b".to_string(),
                        processing_time_ms: 0,
                        quality_score: 0.80,
                    },
                })
            }
            _ => Err(AgentError {
                error_type: "UnsupportedMessage".to_string(),
                message: "Market analyzer only supports StartAnalysis messages".to_string(),
                details: None,
                tea_leaves_context: "Message processing".to_string(),
            }),
        }
    }

    async fn get_status(&self) -> AgentStatus {
        self.status.clone()
    }

    async fn get_config(&self) -> &AgentConfig {
        &self.config
    }
}

impl MarketAnalyzerAgent {
    async fn analyze_market(&self, market_data: &MarketData, strategy_params: &StrategyParameters) -> Result<MarketAnalysis, AgentError> {
        // Implement tea-leaves market analysis logic
        let sentiment = self.ai_integration.analyze_sentiment("Tea-leaves market analysis text").await?;
        let prediction = self.ai_integration.predict_market_movement(market_data).await?;

        Ok(MarketAnalysis {
            symbol: market_data.symbol.clone(),
            analysis_type: AnalysisType::TeaLeavesFactor,
            signals: vec![
                Signal {
                    signal_type: if prediction > 0.1 { SignalType::Buy } else if prediction < -0.1 { SignalType::Sell } else { SignalType::Hold },
                    strength: prediction.abs(),
                    description: "Tea-leaves AI-generated market signal".to_string(),
                    timestamp: chrono::Utc::now().timestamp(),
                    tea_leaves_confidence: 0.80,
                }
            ],
            summary: format!("Tea-leaves market analysis for {}: Sentiment {:.2}, Prediction {:.2}", market_data.symbol, sentiment, prediction),
            confidence: 0.80,
            tea_leaves_insights: TeaLeavesInsights {
                regime_identification: "trending".to_string(),
                factor_exposure: HashMap::new(),
                optimal_timeframe: "1h".to_string(),
                risk_adjustment: 0.05,
            },
        })
    }
}

/// Tea-leaves Risk Manager Agent
pub struct RiskManagerAgent {
    config: AgentConfig,
    status: AgentStatus,
}

impl RiskManagerAgent {
    pub fn new(config: AgentConfig) -> Self {
        Self {
            config,
            status: AgentStatus::Idle,
        }
    }
}

#[async_trait::async_trait]
impl Agent for RiskManagerAgent {
    async fn process_message(&mut self, message: AgentMessage) -> Result<AgentResponse, AgentError> {
        self.status = AgentStatus::Running;

        match message {
            AgentMessage::AnalyzeRisk { position, market_conditions } => {
                let risk_assessment = self.assess_risk(&position, &market_conditions).await?;
                
                self.status = AgentStatus::Completed;
                
                Ok(AgentResponse {
                    agent_id: self.config.name.clone(),
                    response_type: AgentResponseType::RiskAssessment(risk_assessment),
                    data: serde_json::json!({}),
                    confidence: 0.90,
                    timestamp: chrono::Utc::now().timestamp(),
                    tea_leaves_metadata: TeaLeavesMetadata {
                        platform_version: "1.0.0".to_string(),
                        model_used: "gemma-3-4b".to_string(),
                        processing_time_ms: 0,
                        quality_score: 0.90,
                    },
                })
            }
            _ => Err(AgentError {
                error_type: "UnsupportedMessage".to_string(),
                message: "Risk manager only supports AnalyzeRisk messages".to_string(),
                details: None,
                tea_leaves_context: "Message processing".to_string(),
            }),
        }
    }

    async fn get_status(&self) -> AgentStatus {
        self.status.clone()
    }

    async fn get_config(&self) -> &AgentConfig {
        &self.config
    }
}

impl RiskManagerAgent {
    async fn assess_risk(&self, position: &Position, market_conditions: &MarketConditions) -> Result<RiskAssessment, AgentError> {
        // Implement tea-leaves risk assessment logic
        let risk_score = self.calculate_risk_score(position, market_conditions);
        
        Ok(RiskAssessment {
            overall_risk: RiskScore {
                score: risk_score,
                level: if risk_score < 0.3 { RiskLevel::Low } else if risk_score < 0.6 { RiskLevel::Medium } else { RiskLevel::High },
                description: "Tea-leaves AI-calculated risk assessment".to_string(),
                tea_leaves_adjustment: 0.05,
            },
            risk_factors: vec![
                RiskFactor {
                    factor: "Market Volatility".to_string(),
                    impact: market_conditions.volatility,
                    description: "Current market volatility level".to_string(),
                    tea_leaves_mitigation: "Dynamic position sizing".to_string(),
                }
            ],
            recommendations: vec![
                "Consider reducing position size".to_string(),
                "Implement stop-loss orders".to_string(),
                "Use tea-leaves factor analysis".to_string(),
            ],
            tea_leaves_risk_model: TeaLeavesRiskModel {
                model_version: "TeaLeaves_v1.0".to_string(),
                regime_sensitivity: HashMap::new(),
                factor_contribution: HashMap::new(),
                stress_test_results: HashMap::new(),
            },
        })
    }

    fn calculate_risk_score(&self, position: &Position, market_conditions: &MarketConditions) -> f64 {
        // Simple tea-leaves risk calculation
        let position_risk = position.current_value / 10000.0; // Normalize by portfolio size
        let volatility_risk = market_conditions.volatility;
        
        (position_risk + volatility_risk) / 2.0
    }
}

/// Tea-leaves Portfolio Optimizer Agent
pub struct PortfolioOptimizerAgent {
    config: AgentConfig,
    status: AgentStatus,
}

impl PortfolioOptimizerAgent {
    pub fn new(config: AgentConfig) -> Self {
        Self {
            config,
            status: AgentStatus::Idle,
        }
    }
}

#[async_trait::async_trait]
impl Agent for PortfolioOptimizerAgent {
    async fn process_message(&mut self, message: AgentMessage) -> Result<AgentResponse, AgentError> {
        self.status = AgentStatus::Running;

        match message {
            AgentMessage::OptimizePortfolio { current_portfolio, constraints } => {
                let recommendation = self.optimize_portfolio(&current_portfolio, &constraints).await?;
                
                self.status = AgentStatus::Completed;
                
                Ok(AgentResponse {
                    agent_id: self.config.name.clone(),
                    response_type: AgentResponseType::PortfolioRecommendation(recommendation),
                    data: serde_json::json!({}),
                    confidence: 0.85,
                    timestamp: chrono::Utc::now().timestamp(),
                    tea_leaves_metadata: TeaLeavesMetadata {
                        platform_version: "1.0.0".to_string(),
                        model_used: "gemma-3-4b".to_string(),
                        processing_time_ms: 0,
                        quality_score: 0.85,
                    },
                })
            }
            _ => Err(AgentError {
                error_type: "UnsupportedMessage".to_string(),
                message: "Portfolio optimizer only supports OptimizePortfolio messages".to_string(),
                details: None,
                tea_leaves_context: "Message processing".to_string(),
            }),
        }
    }

    async fn get_status(&self) -> AgentStatus {
        self.status.clone()
    }

    async fn get_config(&self) -> &AgentConfig {
        &self.config
    }
}

impl PortfolioOptimizerAgent {
    async fn optimize_portfolio(&self, portfolio: &Portfolio, constraints: &PortfolioConstraints) -> Result<PortfolioRecommendation, AgentError> {
        // Implement tea-leaves portfolio optimization logic
        let current_allocation = self.calculate_allocation(portfolio);
        let recommended_allocation = self.generate_recommendations(&current_allocation, constraints);
        let rebalancing_actions = self.calculate_rebalancing_actions(portfolio, &recommended_allocation);

        Ok(PortfolioRecommendation {
            current_allocation,
            recommended_allocation,
            rebalancing_actions,
            expected_improvement: 0.05, // 5% expected improvement
            tea_leaves_optimization: TeaLeavesPortfolioOptimization {
                factor_tilts: HashMap::new(),
                regime_adaptation: HashMap::new(),
                risk_parity: true,
                expected_tealeaves_score: 0.85,
            },
        })
    }

    fn calculate_allocation(&self, portfolio: &Portfolio) -> HashMap<String, f64> {
        let mut allocation = HashMap::new();
        let total_value = portfolio.total_value;

        for position in &portfolio.positions {
            let percentage = position.current_value / total_value;
            allocation.insert(position.symbol.clone(), percentage);
        }

        allocation
    }

    fn generate_recommendations(&self, current: &HashMap<String, f64>, constraints: &PortfolioConstraints) -> HashMap<String, f64> {
        // Simple tea-leaves optimization - equal weight allocation
        let num_positions = current.len().max(1);
        let equal_weight = 1.0 / num_positions as f64;

        let mut recommended = HashMap::new();
        for (symbol, _) in current {
            recommended.insert(symbol.clone(), equal_weight.min(constraints.max_position_size));
        }

        recommended
    }

    fn calculate_rebalancing_actions(&self, portfolio: &Portfolio, target_allocation: &HashMap<String, f64>) -> Vec<RebalancingAction> {
        let mut actions = Vec::new();
        let total_value = portfolio.total_value;

        for (symbol, target_percentage) in target_allocation {
            let current_position = portfolio.positions.iter().find(|p| &p.symbol == symbol);
            let current_value = current_position.map(|p| p.current_value).unwrap_or(0.0);
            let target_value = total_value * target_percentage;

            if (target_value - current_value).abs() > total_value * 0.01 { // 1% threshold
                let action = if target_value > current_value {
                    RebalancingAction {
                        action_type: ActionType::Buy,
                        symbol: symbol.clone(),
                        quantity: (target_value - current_value) / portfolio.positions.iter().find(|p| &p.symbol == symbol).map(|p| p.average_price).unwrap_or(1.0),
                        reason: "Tea-leaves portfolio rebalancing".to_string(),
                        tea_leaves_priority: 1,
                    }
                } else {
                    RebalancingAction {
                        action_type: ActionType::Sell,
                        symbol: symbol.clone(),
                        quantity: (current_value - target_value) / portfolio.positions.iter().find(|p| &p.symbol == symbol).map(|p| p.average_price).unwrap_or(1.0),
                        reason: "Tea-leaves portfolio rebalancing".to_string(),
                        tea_leaves_priority: 1,
                    }
                };
                actions.push(action);
            }
        }

        actions
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_strategy_generator_agent() {
        let config = AgentConfig {
            agent_type: AgentType::StrategyGenerator,
            name: "test_strategy_generator".to_string(),
            description: "Test tea-leaves strategy generator".to_string(),
            parameters: HashMap::new(),
            tea_leaves_config: TeaLeavesConfig {
                project_id: "test-project".to_string(),
                region: "us-central1".to_string(),
                model_name: "gemma-3-4b".to_string(),
                api_key: None,
                gemma_endpoint: "https://yoree-gemma-827561407333.europe-west1.run.app".to_string(),
                platform_version: "1.0.0".to_string(),
            },
        };

        let mut agent = StrategyGeneratorAgent::new(config);
        let requirements = StrategyRequirements {
            asset_class: "crypto".to_string(),
            strategy_type: "momentum".to_string(),
            complexity: ComplexityLevel::Moderate,
            automation_level: AutomationLevel::SemiAutomated,
            tea_leaves_optimization: true,
        };

        let risk_profile = RiskProfile {
            risk_tolerance: RiskTolerance::Moderate,
            investment_horizon: "1 year".to_string(),
            liquidity_needs: LiquidityNeeds::Medium,
            tea_leaves_risk_model: "TeaLeaves_v1.0".to_string(),
        };

        let message = AgentMessage::GenerateStrategy { requirements, risk_profile };
        let response = agent.process_message(message).await;

        assert!(response.is_ok());
    }

    #[tokio::test]
    async fn test_agent_manager() {
        let manager = AgentManager::new();
        
        let config = AgentConfig {
            agent_type: AgentType::StrategyGenerator,
            name: "test_agent".to_string(),
            description: "Test tea-leaves agent".to_string(),
            parameters: HashMap::new(),
            tea_leaves_config: TeaLeavesConfig {
                project_id: "test-project".to_string(),
                region: "us-central1".to_string(),
                model_name: "gemma-3-4b".to_string(),
                api_key: None,
                gemma_endpoint: "https://yoree-gemma-827561407333.europe-west1.run.app".to_string(),
                platform_version: "1.0.0".to_string(),
            },
        };

        let agent = Box::new(StrategyGeneratorAgent::new(config));
        manager.register_agent("test_agent".to_string(), agent).await;

        let status = manager.get_agent_status("test_agent").await;
        assert!(status.is_some());
    }
} 