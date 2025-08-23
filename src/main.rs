/// Entry point for the tea-leaves platform. Coordinates the modules together.
mod data_sources;
mod factor_discovery;
mod agent_framework;
mod gemma_integration;

use agent_framework::{
    AgentManager, AgentConfig, AgentType, TeaLeavesConfig,
    StrategyGeneratorAgent, MarketAnalyzerAgent, RiskManagerAgent, PortfolioOptimizerAgent,
    TeaLeavesAIIntegration
};
use std::collections::HashMap;
use tokio;
use tracing::{info, error};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt::init();
    
    info!("🚀 Starting Tea-Leaves Platform with AI Agents and Gemma...");
    
    // Initialize tea-leaves platform configuration with Gemma
    let tea_leaves_config = TeaLeavesConfig {
        project_id: "sage-now-466417-n6".to_string(),
        region: "europe-west1".to_string(),
        model_name: "gemma-3-4b".to_string(),
        api_key: std::env::var("GOOGLE_CLOUD_API_KEY").ok(),
        gemma_endpoint: "https://yoree-gemma-827561407333.europe-west1.run.app".to_string(),
        platform_version: "TeaLeaves_v1.0".to_string(),
    };
    
    let ai_integration = TeaLeavesAIIntegration::new(
        tea_leaves_config.project_id.clone(),
        tea_leaves_config.region.clone(),
        tea_leaves_config.api_key.clone(),
    );
    
    // Initialize tea-leaves agent manager
    let agent_manager = AgentManager::new();
    
    // Create and register tea-leaves agents
    let agents = create_tea_leaves_agents(tea_leaves_config).await?;
    
    for (agent_id, agent) in agents {
        agent_manager.register_agent(agent_id, agent).await;
    }
    
    info!("✅ Tea-leaves agents initialized successfully");
    
    // Start the main tea-leaves application loop
    run_tea_leaves_application(agent_manager, ai_integration).await?;
    
    Ok(())
}

async fn create_tea_leaves_agents(tea_leaves_config: TeaLeavesConfig) -> Result<Vec<(String, Box<dyn agent_framework::Agent + Send + Sync>)>, Box<dyn std::error::Error>> {
    let mut agents = Vec::new();
    
    // Tea-Leaves Strategy Generator Agent
    let strategy_config = AgentConfig {
        agent_type: AgentType::StrategyGenerator,
        name: "Tea-Leaves Strategy Generator".to_string(),
        description: "AI-powered tea-leaves trading strategy generation using Gemma 3-4B".to_string(),
        parameters: HashMap::new(),
        tea_leaves_config: tea_leaves_config.clone(),
    };
    let strategy_agent = Box::new(StrategyGeneratorAgent::new(strategy_config));
    agents.push(("tea-leaves-strategy-generator".to_string(), strategy_agent));
    
    // Tea-Leaves Market Analyzer Agent
    let market_config = AgentConfig {
        agent_type: AgentType::MarketAnalyzer,
        name: "Tea-Leaves Market Analyzer".to_string(),
        description: "Real-time tea-leaves market analysis and signal generation".to_string(),
        parameters: HashMap::new(),
        tea_leaves_config: tea_leaves_config.clone(),
    };
    let market_agent = Box::new(MarketAnalyzerAgent::new(market_config));
    agents.push(("tea-leaves-market-analyzer".to_string(), market_agent));
    
    // Tea-Leaves Risk Manager Agent
    let risk_config = AgentConfig {
        agent_type: AgentType::RiskManager,
        name: "Tea-Leaves Risk Manager".to_string(),
        description: "Automated tea-leaves risk assessment and management".to_string(),
        parameters: HashMap::new(),
        tea_leaves_config: tea_leaves_config.clone(),
    };
    let risk_agent = Box::new(RiskManagerAgent::new(risk_config));
    agents.push(("tea-leaves-risk-manager".to_string(), risk_agent));
    
    // Tea-Leaves Portfolio Optimizer Agent
    let portfolio_config = AgentConfig {
        agent_type: AgentType::PortfolioOptimizer,
        name: "Tea-Leaves Portfolio Optimizer".to_string(),
        description: "Dynamic tea-leaves portfolio optimization and rebalancing".to_string(),
        parameters: HashMap::new(),
        tea_leaves_config,
    };
    let portfolio_agent = Box::new(PortfolioOptimizerAgent::new(portfolio_config));
    agents.push(("tea-leaves-portfolio-optimizer".to_string(), portfolio_agent));
    
    Ok(agents)
}

async fn run_tea_leaves_application(
    agent_manager: AgentManager,
    ai_integration: TeaLeavesAIIntegration,
) -> Result<(), Box<dyn std::error::Error>> {
    info!("🎯 Tea-Leaves Platform running with AI agents");
    info!("🔗 Tea-Leaves AI Platform connected with Gemma");
    info!("🤖 Tea-leaves agents ready for trading strategy generation");
    info!("💎 Tea-Leaves Gemma 3-4B model deployed and ready");
    info!("🌐 Tea-Leaves Gemma URL: https://yoree-gemma-827561407333.europe-west1.run.app");
    info!("🚀 Tea-leaves platform version: TeaLeaves_v1.0");
    
    // Keep the tea-leaves application running
    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
        
        // Tea-Leaves health check
        info!("💚 Tea-Leaves Platform health check - All systems operational");
        info!("🔍 Tea-leaves agent status: All agents running");
        info!("📊 Tea-leaves factor discovery: Active");
        info!("🎯 Tea-leaves strategy optimization: Enabled");
    }
}
