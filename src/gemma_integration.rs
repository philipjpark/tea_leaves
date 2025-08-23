use serde::{Deserialize, Serialize};
use reqwest::Client;
use tokio::time::{sleep, Duration};
use std::collections::HashMap;

/// Tea-leaves Gemma API request structure
#[derive(Debug, Serialize)]
pub struct TeaLeavesGemmaRequest {
    pub prompt: String,
    pub max_tokens: Option<u32>,
    pub temperature: Option<f32>,
    pub top_p: Option<f32>,
    pub top_k: Option<u32>,
    pub stop_sequences: Option<Vec<String>>,
    pub tea_leaves_context: Option<String>,
}

/// Tea-leaves Gemma API response structure
#[derive(Debug, Deserialize)]
pub struct TeaLeavesGemmaResponse {
    pub candidates: Vec<TeaLeavesCandidate>,
    pub model: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct TeaLeavesCandidate {
    pub content: TeaLeavesContent,
    pub finishReason: Option<String>,
    pub index: u32,
    pub tokenCount: Option<u32>,
}

#[derive(Debug, Deserialize)]
pub struct TeaLeavesContent {
    pub parts: Vec<TeaLeavesPart>,
    pub role: String,
}

#[derive(Debug, Deserialize)]
pub struct TeaLeavesPart {
    pub text: String,
}

/// Tea-leaves trading strategy prompt templates
pub struct TeaLeavesTradingPrompts;

impl TeaLeavesTradingPrompts {
    pub fn tea_leaves_strategy_generation(asset: &str, timeframe: &str, risk_level: &str) -> String {
        format!(
            r#"You are an expert tea-leaves quantitative trader and AI strategist. Generate a comprehensive tea-leaves optimized trading strategy for {asset} on {timeframe} timeframe with {risk_level} risk tolerance.

Tea-Leaves Strategy Requirements:
1. Clear entry and exit rules using tea-leaves factor analysis
2. Risk management parameters with tea-leaves risk models
3. Position sizing guidelines optimized for tea-leaves methodology
4. Technical indicators integrated with tea-leaves factors
5. Market conditions analysis using tea-leaves regime identification
6. Expected performance metrics with tea-leaves optimization
7. Regime adaptation strategies for different market conditions

Please provide a detailed, actionable tea-leaves trading strategy that can be implemented programmatically. Include specific parameters, conditions, and logic for each component with tea-leaves specific optimizations.

Asset: {asset}
Timeframe: {timeframe}
Risk Level: {risk_level}
Tea-Leaves Platform: v1.0

Tea-Leaves Strategy:"#
        )
    }

    pub fn tea_leaves_market_analysis(symbol: &str, indicators: &[String]) -> String {
        format!(
            r#"Analyze the current market conditions for {symbol} using tea-leaves methodology and the following indicators: {}.

Provide a comprehensive tea-leaves market analysis including:
1. Current trend direction with tea-leaves regime identification
2. Support and resistance levels using tea-leaves factor analysis
3. Key technical signals optimized for tea-leaves platform
4. Market sentiment with tea-leaves sentiment scoring
5. Risk assessment using tea-leaves risk models
6. Trading recommendations with tea-leaves factor weights
7. Regime adaptation suggestions for optimal performance

Symbol: {symbol}
Indicators: {}
Tea-Leaves Platform: v1.0

Tea-Leaves Analysis:"#,
            indicators.join(", "),
            indicators.join(", ")
        )
    }

    pub fn tea_leaves_risk_assessment(portfolio: &str, market_conditions: &str) -> String {
        format!(
            r#"Assess the risk profile for the following portfolio and market conditions using tea-leaves risk methodology:

Portfolio: {portfolio}
Market Conditions: {market_conditions}

Provide a detailed tea-leaves risk assessment including:
1. Overall portfolio risk score (0-100) using tea-leaves risk models
2. Key risk factors with tea-leaves factor contribution analysis
3. Position-specific risks with tea-leaves optimization recommendations
4. Market risk factors using tea-leaves regime analysis
5. Recommended risk mitigation strategies with tea-leaves methodology
6. Portfolio optimization suggestions using tea-leaves factor analysis
7. Regime adaptation for risk management

Tea-Leaves Platform: v1.0

Tea-Leaves Risk Assessment:"#
        )
    }

    pub fn tea_leaves_portfolio_optimization(current_allocation: &str, constraints: &str) -> String {
        format!(
            r#"Optimize the following portfolio allocation based on the given constraints using tea-leaves methodology:

Current Allocation: {current_allocation}
Constraints: {constraints}

Provide tea-leaves portfolio optimization recommendations including:
1. Target allocation percentages optimized with tea-leaves factors
2. Rebalancing actions needed using tea-leaves methodology
3. Expected performance improvement with tea-leaves optimization
4. Risk-adjusted return optimization using tea-leaves risk models
5. Diversification improvements with tea-leaves factor analysis
6. Implementation timeline with tea-leaves regime adaptation
7. Factor rotation strategies for optimal performance

Tea-Leaves Platform: v1.0

Tea-Leaves Portfolio Optimization:"#
        )
    }

    pub fn tea_leaves_sentiment_analysis(text: &str) -> String {
        format!(
            r#"Analyze the sentiment of the following market-related text and provide tea-leaves insights:

Text: {text}

Provide tea-leaves sentiment analysis including:
1. Overall sentiment score (-1 to 1) with tea-leaves confidence
2. Sentiment classification (Bullish/Bearish/Neutral) using tea-leaves methodology
3. Key sentiment indicators with tea-leaves factor weights
4. Confidence level using tea-leaves validation metrics
5. Market implications with tea-leaves regime analysis
6. Trading signals based on tea-leaves sentiment analysis
7. Regime adaptation recommendations

Tea-Leaves Platform: v1.0

Tea-Leaves Sentiment Analysis:"#
        )
    }

    pub fn tea_leaves_technical_analysis(symbol: &str, data: &str) -> String {
        format!(
            r#"Perform technical analysis on {symbol} using tea-leaves methodology and the following market data:

Market Data: {data}

Provide comprehensive tea-leaves technical analysis including:
1. Trend analysis (short, medium, long term) with tea-leaves regime identification
2. Key technical indicators optimized for tea-leaves platform
3. Support and resistance levels using tea-leaves factor analysis
4. Chart patterns identification with tea-leaves confidence scoring
5. Volume analysis using tea-leaves methodology
6. Momentum indicators with tea-leaves factor weights
7. Trading signals and recommendations optimized for tea-leaves platform
8. Regime adaptation strategies for optimal performance

Tea-Leaves Platform: v1.0

Tea-Leaves Technical Analysis:"#
        )
    }

    pub fn tea_leaves_factor_discovery(market_data: &str, asset_class: &str) -> String {
        format!(
            r#"Discover trading factors for {asset_class} using tea-leaves methodology and the following market data:

Market Data: {market_data}

Provide tea-leaves factor discovery analysis including:
1. Potential factor candidates using tea-leaves methodology
2. Factor importance scoring with tea-leaves confidence metrics
3. Regime performance analysis for each factor
4. Factor correlation analysis using tea-leaves methodology
5. Implementation complexity assessment
6. Risk-adjusted factor performance
7. Factor combination recommendations
8. Tea-leaves optimization strategies

Asset Class: {asset_class}
Tea-Leaves Platform: v1.0

Tea-Leaves Factor Discovery:"#
        )
    }
}

/// Tea-leaves Gemma integration service
pub struct TeaLeavesGemmaIntegration {
    client: Client,
    base_url: String,
    max_retries: u32,
    retry_delay: Duration,
    tea_leaves_config: TeaLeavesGemmaConfig,
}

/// Tea-leaves Gemma configuration
#[derive(Debug, Clone)]
pub struct TeaLeavesGemmaConfig {
    pub platform_version: String,
    pub default_context: String,
    pub optimization_level: String,
    pub regime_adaptation: bool,
}

impl TeaLeavesGemmaIntegration {
    pub fn new(base_url: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
            max_retries: 3,
            retry_delay: Duration::from_secs(2),
            tea_leaves_config: TeaLeavesGemmaConfig {
                platform_version: "TeaLeaves_v1.0".to_string(),
                default_context: "tea-leaves trading platform".to_string(),
                optimization_level: "high".to_string(),
                regime_adaptation: true,
            },
        }
    }

    /// Generate text using tea-leaves Gemma model
    pub async fn generate_tea_leaves_text(&self, prompt: &str, max_tokens: Option<u32>) -> Result<String, Box<dyn std::error::Error>> {
        let request = TeaLeavesGemmaRequest {
            prompt: prompt.to_string(),
            max_tokens,
            temperature: Some(0.7),
            top_p: Some(0.9),
            top_k: Some(40),
            stop_sequences: None,
            tea_leaves_context: Some(self.tea_leaves_config.default_context.clone()),
        };

        let mut attempts = 0;
        loop {
            match self.make_tea_leaves_request(&request).await {
                Ok(response) => {
                    if let Some(candidate) = response.candidates.first() {
                        return Ok(candidate.content.parts.first()
                            .map(|part| part.text.clone())
                            .unwrap_or_default());
                    }
                    return Ok("No tea-leaves response generated".to_string());
                }
                Err(e) => {
                    attempts += 1;
                    if attempts >= self.max_retries {
                        return Err(e);
                    }
                    sleep(self.retry_delay).await;
                }
            }
        }
    }

    /// Generate tea-leaves trading strategy
    pub async fn generate_tea_leaves_strategy(&self, asset: &str, timeframe: &str, risk_level: &str) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_strategy_generation(asset, timeframe, risk_level);
        self.generate_tea_leaves_text(&prompt, Some(1024)).await
    }

    /// Analyze tea-leaves market conditions
    pub async fn analyze_tea_leaves_market(&self, symbol: &str, indicators: &[String]) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_market_analysis(symbol, indicators);
        self.generate_tea_leaves_text(&prompt, Some(768)).await
    }

    /// Assess tea-leaves portfolio risk
    pub async fn assess_tea_leaves_risk(&self, portfolio: &str, market_conditions: &str) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_risk_assessment(portfolio, market_conditions);
        self.generate_tea_leaves_text(&prompt, Some(512)).await
    }

    /// Optimize tea-leaves portfolio
    pub async fn optimize_tea_leaves_portfolio(&self, current_allocation: &str, constraints: &str) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_portfolio_optimization(current_allocation, constraints);
        self.generate_tea_leaves_text(&prompt, Some(768)).await
    }

    /// Analyze tea-leaves sentiment
    pub async fn analyze_tea_leaves_sentiment(&self, text: &str) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_sentiment_analysis(text);
        self.generate_tea_leaves_text(&prompt, Some(256)).await
    }

    /// Perform tea-leaves technical analysis
    pub async fn tea_leaves_technical_analysis(&self, symbol: &str, data: &str) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_technical_analysis(symbol, data);
        self.generate_tea_leaves_text(&prompt, Some(1024)).await
    }

    /// Discover tea-leaves factors
    pub async fn discover_tea_leaves_factors(&self, market_data: &str, asset_class: &str) -> Result<String, Box<dyn std::error::Error>> {
        let prompt = TeaLeavesTradingPrompts::tea_leaves_factor_discovery(market_data, asset_class);
        self.generate_tea_leaves_text(&prompt, Some(1024)).await
    }

    /// Make HTTP request to tea-leaves Gemma API
    async fn make_tea_leaves_request(&self, request: &TeaLeavesGemmaRequest) -> Result<TeaLeavesGemmaResponse, Box<dyn std::error::Error>> {
        let response = self.client
            .post(&format!("{}/v1beta/models/gemma3:4b:generateContent", self.base_url))
            .json(request)
            .send()
            .await?;

        if response.status().is_success() {
            let gemma_response: TeaLeavesGemmaResponse = response.json().await?;
            Ok(gemma_response)
        } else {
            let error_text = response.text().await?;
            Err(format!("Tea-leaves Gemma API error: {}", error_text).into())
        }
    }

    /// Test connection to tea-leaves Gemma service
    pub async fn test_tea_leaves_connection(&self) -> Result<bool, Box<dyn std::error::Error>> {
        let test_prompt = "Hello, this is a tea-leaves platform test message. Please respond with 'Tea-Leaves OK' if you can see this.";
        
        match self.generate_tea_leaves_text(test_prompt, Some(10)).await {
            Ok(_) => Ok(true),
            Err(_) => Ok(false),
        }
    }

    /// Get tea-leaves model information
    pub async fn get_tea_leaves_model_info(&self) -> Result<HashMap<String, serde_json::Value>, Box<dyn std::error::Error>> {
        let response = self.client
            .get(&format!("{}/v1beta/models/gemma3:4b", self.base_url))
            .send()
            .await?;

        if response.status().is_success() {
            let model_info: HashMap<String, serde_json::Value> = response.json().await?;
            Ok(model_info)
        } else {
            Err("Failed to get tea-leaves model information".into())
        }
    }

    /// Get tea-leaves platform status
    pub async fn get_tea_leaves_platform_status(&self) -> Result<TeaLeavesPlatformStatus, Box<dyn std::error::Error>> {
        Ok(TeaLeavesPlatformStatus {
            platform_version: self.tea_leaves_config.platform_version.clone(),
            gemma_endpoint: self.base_url.clone(),
            optimization_level: self.tea_leaves_config.optimization_level.clone(),
            regime_adaptation: self.tea_leaves_config.regime_adaptation,
            last_health_check: chrono::Utc::now(),
        })
    }
}

/// Tea-leaves platform status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesPlatformStatus {
    pub platform_version: String,
    pub gemma_endpoint: String,
    pub optimization_level: String,
    pub regime_adaptation: bool,
    pub last_health_check: chrono::DateTime<chrono::Utc>,
}

/// Configuration for tea-leaves Gemma integration
#[derive(Debug, Clone)]
pub struct GemmaConfig {
    pub base_url: String,
    pub max_retries: u32,
    pub retry_delay_seconds: u64,
    pub default_max_tokens: u32,
    pub default_temperature: f32,
    pub tea_leaves_optimization: bool,
}

impl Default for GemmaConfig {
    fn default() -> Self {
        Self {
            base_url: "https://yoree-gemma-827561407333.europe-west1.run.app".to_string(),
            max_retries: 3,
            retry_delay_seconds: 2,
            default_max_tokens: 1024,
            default_temperature: 0.7,
            tea_leaves_optimization: true,
        }
    }
}

/// Legacy compatibility functions
impl TeaLeavesGemmaIntegration {
    /// Legacy method for backward compatibility
    pub async fn generate_text(&self, prompt: &str, max_tokens: Option<u32>) -> Result<String, Box<dyn std::error::Error>> {
        self.generate_tea_leaves_text(prompt, max_tokens).await
    }

    /// Legacy method for backward compatibility
    pub async fn generate_strategy(&self, asset: &str, timeframe: &str, risk_level: &str) -> Result<String, Box<dyn std::error::Error>> {
        self.generate_tea_leaves_strategy(asset, timeframe, risk_level).await
    }

    /// Legacy method for backward compatibility
    pub async fn analyze_market(&self, symbol: &str, indicators: &[String]) -> Result<String, Box<dyn std::error::Error>> {
        self.analyze_tea_leaves_market(symbol, indicators).await
    }

    /// Legacy method for backward compatibility
    pub async fn assess_risk(&self, portfolio: &str, market_conditions: &str) -> Result<String, Box<dyn std::error::Error>> {
        self.assess_tea_leaves_risk(portfolio, market_conditions).await
    }

    /// Legacy method for backward compatibility
    pub async fn optimize_portfolio(&self, current_allocation: &str, constraints: &str) -> Result<String, Box<dyn std::error::Error>> {
        self.optimize_tea_leaves_portfolio(current_allocation, constraints).await
    }

    /// Legacy method for backward compatibility
    pub async fn analyze_sentiment(&self, text: &str) -> Result<String, Box<dyn std::error::Error>> {
        self.analyze_tea_leaves_sentiment(text).await
    }

    /// Legacy method for backward compatibility
    pub async fn technical_analysis(&self, symbol: &str, data: &str) -> Result<String, Box<dyn std::error::Error>> {
        self.tea_leaves_technical_analysis(symbol, data).await
    }

    /// Legacy method for backward compatibility
    pub async fn test_connection(&self) -> Result<bool, Box<dyn std::error::Error>> {
        self.test_tea_leaves_connection().await
    }

    /// Legacy method for backward compatibility
    pub async fn get_model_info(&self) -> Result<HashMap<String, serde_json::Value>, Box<dyn std::error::Error>> {
        self.get_tea_leaves_model_info().await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_tea_leaves_gemma_integration() {
        let gemma = TeaLeavesGemmaIntegration::new("https://yoree-gemma-827561407333.europe-west1.run.app".to_string());
        
        // Test tea-leaves connection
        let is_connected = gemma.test_tea_leaves_connection().await.unwrap_or(false);
        assert!(is_connected, "Tea-leaves Gemma service should be accessible");
    }

    #[tokio::test]
    async fn test_tea_leaves_strategy_generation() {
        let gemma = TeaLeavesGemmaIntegration::new("https://yoree-gemma-827561407333.europe-west1.run.app".to_string());
        
        let strategy = gemma.generate_tea_leaves_strategy("BTC/USD", "1h", "moderate").await;
        assert!(strategy.is_ok(), "Tea-leaves strategy generation should succeed");
        
        let strategy_text = strategy.unwrap();
        assert!(!strategy_text.is_empty(), "Tea-leaves strategy should not be empty");
    }

    #[tokio::test]
    async fn test_tea_leaves_market_analysis() {
        let gemma = TeaLeavesGemmaIntegration::new("https://yoree-gemma-827561407333.europe-west1.run.app".to_string());
        
        let indicators = vec!["RSI".to_string(), "MACD".to_string(), "Bollinger Bands".to_string()];
        let analysis = gemma.analyze_tea_leaves_market("ETH/USD", &indicators).await;
        assert!(analysis.is_ok(), "Tea-leaves market analysis should succeed");
    }

    #[tokio::test]
    async fn test_tea_leaves_factor_discovery() {
        let gemma = TeaLeavesGemmaIntegration::new("https://yoree-gemma-827561407333.europe-west1.run.app".to_string());
        
        let market_data = "BTC price data for the last 30 days";
        let discovery = gemma.discover_tea_leaves_factors(market_data, "crypto").await;
        assert!(discovery.is_ok(), "Tea-leaves factor discovery should succeed");
    }
} 