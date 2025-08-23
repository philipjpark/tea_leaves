/// Module: Tea-leaves external data integrations (market data, news sentiment, social trends).
use std::error::Error;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use reqwest::Client;
use std::collections::HashMap;
use crate::integrations::{CoinGeckoClient, CoinGeckoOHLCV, UnifiedOHLCV, CoinGeckoMarketChart};

/// Tea-leaves simple struct to hold market price data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PriceData {
    pub symbol: String,
    pub price: f64,
    pub volume: f64,
    pub timestamp: DateTime<Utc>,
    pub change_24h: f64,
    pub tea_leaves_metrics: TeaLeavesPriceMetrics,
}

/// Tea-leaves specific price metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesPriceMetrics {
    pub volatility_regime: String,
    pub trend_strength: f64,
    pub market_efficiency: f64,
    pub factor_exposure: HashMap<String, f64>,
}

/// Tea-leaves CoinGecko API response structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoinGeckoResponse {
    pub prices: Vec<[f64; 2]>,
    pub market_caps: Vec<[f64; 2]>,
    pub total_volumes: Vec<[f64; 2]>,
}

/// Tea-leaves enhanced data provider that integrates multiple sources
pub struct TeaLeavesDataProvider {
    pub coingecko_client: CoinGeckoClient,
    pub client: Client,
    pub tea_leaves_config: TeaLeavesDataConfig,
}

/// Tea-leaves data configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesDataConfig {
    pub api_keys: HashMap<String, String>,
    pub data_sources: Vec<String>,
    pub update_frequency: String,
    pub quality_threshold: f64,
}

impl TeaLeavesDataProvider {
    pub fn new(coingecko_api_key: Option<String>) -> Self {
        let mut api_keys = HashMap::new();
        if let Some(key) = coingecko_api_key {
            api_keys.insert("coingecko".to_string(), key);
        }
        
        TeaLeavesDataProvider {
            coingecko_client: CoinGeckoClient::new(coingecko_api_key),
            client: Client::new(),
            tea_leaves_config: TeaLeavesDataConfig {
                api_keys,
                data_sources: vec!["coingecko".to_string(), "binance".to_string(), "messari".to_string()],
                update_frequency: "1m".to_string(),
                quality_threshold: 0.95,
            },
        }
    }

    /// Fetch current price data with tea-leaves analysis
    pub async fn fetch_current_price(&self, symbol: &str) -> Result<PriceData, String> {
        let url = format!("https://api.coingecko.com/api/v3/simple/price?ids={}&vs_currencies=usd&include_24hr_change=true", symbol);
        
        let response = reqwest::get(&url)
            .await
            .map_err(|e| e.to_string())?;
        
        if response.status().is_success() {
            let data: serde_json::Value = response
                .json()
                .await
                .map_err(|e| e.to_string())?;
            
            if let Some(price_info) = data.get(symbol) {
                let price = price_info["usd"].as_f64().unwrap_or(0.0);
                let change_24h = price_info["usd_24h_change"].as_f64().unwrap_or(0.0);
                
                // Calculate tea-leaves metrics
                let tea_leaves_metrics = self.calculate_tea_leaves_metrics(price, change_24h);
                
                Ok(PriceData {
                    symbol: symbol.to_string(),
                    price,
                    volume: 0.0,
                    timestamp: chrono::Utc::now(),
                    change_24h,
                    tea_leaves_metrics,
                })
            } else {
                Err(format!("Symbol {} not found", symbol))
            }
        } else {
            Err(format!("API request failed with status: {}", response.status()))
        }
    }

    /// Calculate tea-leaves specific metrics
    fn calculate_tea_leaves_metrics(&self, price: f64, change_24h: f64) -> TeaLeavesPriceMetrics {
        let volatility_regime = if change_24h.abs() > 10.0 {
            "high_volatility".to_string()
        } else if change_24h.abs() > 5.0 {
            "medium_volatility".to_string()
        } else {
            "low_volatility".to_string()
        };

        let trend_strength = (change_24h / 100.0).abs();
        let market_efficiency = 1.0 - (change_24h.abs() / 100.0).min(1.0);
        
        let mut factor_exposure = HashMap::new();
        factor_exposure.insert("momentum".to_string(), change_24h / 100.0);
        factor_exposure.insert("volatility".to_string(), change_24h.abs() / 100.0);

        TeaLeavesPriceMetrics {
            volatility_regime,
            trend_strength,
            market_efficiency,
            factor_exposure,
        }
    }

    /// Fetch historical data with tea-leaves analysis
    pub async fn fetch_historical_data(&self, symbol: &str, days: u32) -> Result<Vec<PriceData>, String> {
        let url = format!(
            "https://api.coingecko.com/api/v3/coins/{}/market_chart?vs_currency=usd&days={}&interval=daily",
            symbol, days
        );

        let response = reqwest::get(&url)
            .await
            .map_err(|e| e.to_string())?;
        
        if response.status().is_success() {
            let data: CoinGeckoResponse = response
                .json()
                .await
                .map_err(|e| e.to_string())?;
            
            let mut historical_prices = Vec::new();
            
            for (i, price_point) in data.prices.iter().enumerate() {
                let timestamp_ms = price_point[0] as i64;
                let price = price_point[1];
                let volume = data.total_volumes.get(i).map(|v| v[1]).unwrap_or(0.0);
                
                let timestamp = chrono::DateTime::from_timestamp_millis(timestamp_ms)
                    .unwrap_or_else(chrono::Utc::now);
                
                // Calculate tea-leaves metrics for historical data
                let change_24h = if i > 0 {
                    let prev_price = data.prices[i-1][1];
                    ((price - prev_price) / prev_price) * 100.0
                } else {
                    0.0
                };
                
                let tea_leaves_metrics = self.calculate_tea_leaves_metrics(price, change_24h);
                
                historical_prices.push(PriceData {
                    symbol: symbol.to_string(),
                    price,
                    volume,
                    timestamp,
                    change_24h,
                    tea_leaves_metrics,
                });
            }
            
            Ok(historical_prices)
        } else {
            Err(format!("Historical data request failed with status: {}", response.status()))
        }
    }

    /// Get comprehensive tea-leaves market data for multiple assets
    pub async fn get_tea_leaves_market_overview(
        &self,
        coin_ids: &[String],
    ) -> Result<Vec<TeaLeavesMarketData>, String> {
        let mut market_data = Vec::new();
        
        for coin_id in coin_ids {
            if let Ok(price_data) = self.fetch_current_price(coin_id).await {
                let market_data_entry = TeaLeavesMarketData {
                    symbol: coin_id.clone(),
                    price: price_data.price,
                    volume: price_data.volume,
                    change_24h: price_data.change_24h,
                    tea_leaves_score: self.calculate_tea_leaves_score(&price_data),
                    timestamp: Utc::now(),
                };
                market_data.push(market_data_entry);
            }
        }
        
        Ok(market_data)
    }

    /// Calculate tea-leaves score for an asset
    fn calculate_tea_leaves_score(&self, price_data: &PriceData) -> f64 {
        let volatility_score = 1.0 - (price_data.change_24h.abs() / 100.0).min(1.0);
        let trend_score = if price_data.change_24h > 0.0 { 0.8 } else { 0.2 };
        let efficiency_score = price_data.tea_leaves_metrics.market_efficiency;
        
        (volatility_score + trend_score + efficiency_score) / 3.0
    }
}

/// Tea-leaves market data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesMarketData {
    pub symbol: String,
    pub price: f64,
    pub volume: f64,
    pub change_24h: f64,
    pub tea_leaves_score: f64,
    pub timestamp: DateTime<Utc>,
}

/// Legacy functions for backward compatibility with tea-leaves platform
/// Fetch the current price (or price ticker data) for a given symbol from a market API.
pub fn fetch_price(symbol: &str) -> Result<f64, Box<dyn Error>> {
    // Create a simple runtime for the async call
    let rt = tokio::runtime::Runtime::new()?;
    let data_provider = TeaLeavesDataProvider::new(None);
    
    rt.block_on(async {
        let price_data = data_provider.fetch_current_price(symbol).await
            .map_err(|e| -> Box<dyn Error> { Box::new(std::io::Error::new(std::io::ErrorKind::Other, e)) })?;
        Ok(price_data.price)
    })
}

/// Fetch historical price data for a symbol, for use in tea-leaves backtesting.
pub fn fetch_historical(symbol: &str, days: u32) -> Result<Vec<PriceData>, Box<dyn Error>> {
    let rt = tokio::runtime::Runtime::new()?;
    let data_provider = TeaLeavesDataProvider::new(None);
    
    rt.block_on(async {
        data_provider.fetch_historical_data(symbol, days).await
            .map_err(|e| e.into())
    })
}

/// Fetch the latest news sentiment score for a given topic/asset using tea-leaves analysis.
pub fn fetch_news_sentiment(_topic: &str) -> Result<f64, Box<dyn Error>> {
    // Would call a news API and perform NLP sentiment analysis with tea-leaves methodology.
    println!("Analyzing tea-leaves news sentiment...");
    Ok(0.0)  // 0.0 = neutral sentiment (placeholder)
}

/// Fetch the current social media sentiment or trend score for a given topic using tea-leaves analysis.
pub fn fetch_social_sentiment(_topic: &str) -> Result<f64, Box<dyn Error>> {
    // Would call social media APIs or aggregators (Twitter, Reddit) to gauge sentiment with tea-leaves methodology.
    println!("Analyzing tea-leaves social media sentiment...");
    Ok(0.0)  // placeholder
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TeaLeavesKeywordBin {
    pub category: String,
    pub keywords: Vec<String>,
    pub sentiment_score: f64,
    pub source_count: HashMap<String, i32>,
    pub last_updated: DateTime<Utc>,
    pub tea_leaves_confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesMarketSentiment {
    pub overall_score: f64,
    pub category_scores: HashMap<String, f64>,
    pub trending_keywords: Vec<String>,
    pub source_breakdown: HashMap<String, f64>,
    pub tea_leaves_regime: String,
    pub factor_contribution: HashMap<String, f64>,
}

pub struct TeaLeavesSentimentAnalyzer {
    client: Client,
    keyword_bins: Vec<TeaLeavesKeywordBin>,
    tea_leaves_config: TeaLeavesSentimentConfig,
}

/// Tea-leaves sentiment analysis configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeaLeavesSentimentConfig {
    pub analysis_method: String,
    pub confidence_threshold: f64,
    pub regime_adaptation: bool,
    pub factor_integration: bool,
}

impl TeaLeavesSentimentAnalyzer {
    pub fn new() -> Self {
        TeaLeavesSentimentAnalyzer {
            client: Client::new(),
            keyword_bins: vec![
                TeaLeavesKeywordBin {
                    category: "Tea-Leaves Technical Analysis".to_string(),
                    keywords: vec!["RSI".to_string(), "MACD".to_string(), "Moving Average".to_string(), "Support".to_string(), "Resistance".to_string(), "Tea-Leaves Factor".to_string()],
                    sentiment_score: 0.0,
                    source_count: HashMap::new(),
                    last_updated: Utc::now(),
                    tea_leaves_confidence: 0.85,
                },
                TeaLeavesKeywordBin {
                    category: "Tea-Leaves Market News".to_string(),
                    keywords: vec!["Launch".to_string(), "Partnership".to_string(), "Regulation".to_string(), "Adoption".to_string(), "Tea-Leaves Platform".to_string()],
                    sentiment_score: 0.0,
                    source_count: HashMap::new(),
                    last_updated: Utc::now(),
                    tea_leaves_confidence: 0.80,
                },
                TeaLeavesKeywordBin {
                    category: "Tea-Leaves Social Sentiment".to_string(),
                    keywords: vec!["Bullish".to_string(), "Bearish".to_string(), "FOMO".to_string(), "HODL".to_string(), "Tea-Leaves Strategy".to_string()],
                    sentiment_score: 0.0,
                    source_count: HashMap::new(),
                    last_updated: Utc::now(),
                    tea_leaves_confidence: 0.75,
                },
            ],
            tea_leaves_config: TeaLeavesSentimentConfig {
                analysis_method: "TeaLeaves_v1.0".to_string(),
                confidence_threshold: 0.7,
                regime_adaptation: true,
                factor_integration: true,
            },
        }
    }

    pub async fn update_tea_leaves_sentiment(&mut self, asset: &str) -> TeaLeavesMarketSentiment {
        // Fetch data from various sources with tea-leaves methodology
        let news = self.fetch_tea_leaves_news_data(asset).await;
        let social = self.fetch_tea_leaves_social_data(asset).await;
        let technical = self.fetch_tea_leaves_technical_data(asset).await;
        
        for bin in &mut self.keyword_bins {
            bin.sentiment_score = TeaLeavesSentimentAnalyzer::calculate_tea_leaves_bin_sentiment(bin, &news, &social, &technical);
        }

        // Calculate overall tea-leaves sentiment
        let overall_score = self.calculate_tea_leaves_overall_sentiment();
        let category_scores = self.get_tea_leaves_category_scores();
        let trending_keywords = self.get_tea_leaves_trending_keywords();
        let source_breakdown = self.get_tea_leaves_source_breakdown();
        let tea_leaves_regime = self.identify_tea_leaves_regime(&overall_score);
        let factor_contribution = self.calculate_tea_leaves_factor_contribution();

        TeaLeavesMarketSentiment {
            overall_score,
            category_scores,
            trending_keywords,
            source_breakdown,
            tea_leaves_regime,
            factor_contribution,
        }
    }

    async fn fetch_tea_leaves_news_data(&self, asset: &str) -> Vec<String> {
        // Implement tea-leaves news API calls (e.g., CryptoCompare, CoinGecko)
        vec![format!("Tea-leaves analysis for {}", asset)]
    }

    async fn fetch_tea_leaves_social_data(&self, asset: &str) -> Vec<String> {
        // Implement tea-leaves social media API calls (e.g., Twitter, Reddit)
        vec![format!("Tea-leaves social sentiment for {}", asset)]
    }

    async fn fetch_tea_leaves_technical_data(&self, asset: &str) -> Vec<String> {
        // Implement tea-leaves technical analysis data fetching
        vec![format!("Tea-leaves technical indicators for {}", asset)]
    }

    fn calculate_tea_leaves_bin_sentiment(bin: &TeaLeavesKeywordBin, news: &[String], social: &[String], technical: &[String]) -> f64 {
        // Implement tea-leaves sentiment calculation logic
        let base_score = bin.tea_leaves_confidence;
        let keyword_matches = news.len() + social.len() + technical.len();
        
        if keyword_matches > 0 {
            base_score * 0.8 + 0.2
        } else {
            base_score * 0.5
        }
    }

    fn calculate_tea_leaves_overall_sentiment(&self) -> f64 {
        self.keyword_bins.iter()
            .map(|bin| bin.sentiment_score * bin.tea_leaves_confidence)
            .sum::<f64>() / self.keyword_bins.len() as f64
    }

    fn get_tea_leaves_category_scores(&self) -> HashMap<String, f64> {
        self.keyword_bins.iter()
            .map(|bin| (bin.category.clone(), bin.sentiment_score))
            .collect()
    }

    fn get_tea_leaves_trending_keywords(&self) -> Vec<String> {
        // Implement tea-leaves trending keywords logic
        vec!["Tea-Leaves Factor".to_string(), "Regime Adaptation".to_string(), "AI Strategy".to_string()]
    }

    fn get_tea_leaves_source_breakdown(&self) -> HashMap<String, f64> {
        // Implement tea-leaves source breakdown logic
        let mut breakdown = HashMap::new();
        breakdown.insert("Tea-Leaves Platform".to_string(), 0.4);
        breakdown.insert("External APIs".to_string(), 0.3);
        breakdown.insert("Social Media".to_string(), 0.2);
        breakdown.insert("News Sources".to_string(), 0.1);
        breakdown
    }

    fn identify_tea_leaves_regime(&self, sentiment_score: &f64) -> String {
        if *sentiment_score > 0.7 {
            "bullish_regime".to_string()
        } else if *sentiment_score < 0.3 {
            "bearish_regime".to_string()
        } else {
            "neutral_regime".to_string()
        }
    }

    fn calculate_tea_leaves_factor_contribution(&self) -> HashMap<String, f64> {
        let mut factor_contribution = HashMap::new();
        factor_contribution.insert("sentiment_factor".to_string(), 0.3);
        factor_contribution.insert("technical_factor".to_string(), 0.4);
        factor_contribution.insert("regime_factor".to_string(), 0.3);
        factor_contribution
    }
}
