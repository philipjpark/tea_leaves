use anyhow::Result;
use serde::{Deserialize, Serialize};
use tracing::info;
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Clone, Serialize, Deserialize)]
pub struct AssetToken {
    pub id: String,
    pub name: String,
    pub symbol: String,
    pub asset_class: AssetClass,
    pub total_supply: u64,
    pub metadata_uri: String,
    pub creator_address: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum AssetClass {
    IPRights,
    MusicRoyalties,
    RealEstate,
    Commodities,
    PredictionMarkets,
    StartupEquity,
    CryptoTokens,
    TokenizedSecurities,
    Custom,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TokenMetadata {
    pub token_id: String,
    pub description: String,
    pub image_url: Option<String>,
    pub external_url: Option<String>,
    pub attributes: Vec<TokenAttribute>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TokenAttribute {
    pub trait_type: String,
    pub value: String,
}

pub struct AssetTokenizationService {
    tokens: Vec<AssetToken>,
}

impl AssetTokenizationService {
    pub async fn new() -> Result<Self> {
        Ok(Self {
            tokens: Vec::new(),
        })
    }
    
    pub async fn create_asset_token(
        &mut self,
        name: &str,
        symbol: &str,
        asset_class: AssetClass,
        total_supply: u64,
        metadata_uri: &str,
        creator_address: &str,
    ) -> Result<String> {
        info!("Creating asset token: {} ({})", name, symbol);
        
        let token = AssetToken {
            id: Uuid::new_v4().to_string(),
            name: name.to_string(),
            symbol: symbol.to_string(),
            asset_class,
            total_supply,
            metadata_uri: metadata_uri.to_string(),
            creator_address: creator_address.to_string(),
            is_active: true,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        
        self.tokens.push(token.clone());
        info!("Asset token created with ID: {}", token.id);
        
        Ok(token.id)
    }
    
    pub async fn get_asset_token(&self, token_id: &str) -> Result<Option<AssetToken>> {
        let token = self.tokens.iter().find(|t| t.id == token_id).cloned();
        Ok(token)
    }
    
    pub async fn get_tokens_by_creator(&self, creator_address: &str) -> Result<Vec<AssetToken>> {
        let creator_tokens: Vec<AssetToken> = self.tokens
            .iter()
            .filter(|t| t.creator_address == creator_address)
            .cloned()
            .collect();
        
        Ok(creator_tokens)
    }
    
    pub async fn get_tokens_by_asset_class(&self, asset_class: &AssetClass) -> Result<Vec<AssetToken>> {
        let class_tokens: Vec<AssetToken> = self.tokens
            .iter()
            .filter(|t| std::mem::discriminant(&t.asset_class) == std::mem::discriminant(asset_class))
            .cloned()
            .collect();
        
        Ok(class_tokens)
    }
    
    pub async fn update_token_metadata(
        &mut self,
        token_id: &str,
        new_metadata_uri: &str,
    ) -> Result<()> {
        if let Some(token) = self.tokens.iter_mut().find(|t| t.id == token_id) {
            token.metadata_uri = new_metadata_uri.to_string();
            token.updated_at = Utc::now();
            info!("Metadata updated for token: {}", token_id);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Token not found"))
        }
    }
    
    pub async fn deactivate_token(&mut self, token_id: &str) -> Result<()> {
        if let Some(token) = self.tokens.iter_mut().find(|t| t.id == token_id) {
            token.is_active = false;
            token.updated_at = Utc::now();
            info!("Token deactivated: {}", token_id);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Token not found"))
        }
    }
    
    pub async fn get_token_statistics(&self) -> Result<serde_json::Value> {
        let total_tokens = self.tokens.len();
        let active_tokens = self.tokens.iter().filter(|t| t.is_active).count();
        
        let asset_class_counts = {
            let mut counts = std::collections::HashMap::new();
            for token in &self.tokens {
                let class_name = match &token.asset_class {
                    AssetClass::IPRights => "IP Rights",
                    AssetClass::MusicRoyalties => "Music Royalties",
                    AssetClass::RealEstate => "Real Estate",
                    AssetClass::Commodities => "Commodities",
                    AssetClass::PredictionMarkets => "Prediction Markets",
                    AssetClass::StartupEquity => "Startup Equity",
                    AssetClass::CryptoTokens => "Crypto Tokens",
                    AssetClass::TokenizedSecurities => "Tokenized Securities",
                    AssetClass::Custom => "Custom",
                };
                *counts.entry(class_name).or_insert(0) += 1;
            }
            counts
        };
        
        let stats = serde_json::json!({
            "total_tokens": total_tokens,
            "active_tokens": active_tokens,
            "asset_class_distribution": asset_class_counts,
            "last_updated": Utc::now()
        });
        
        Ok(stats)
    }
} 