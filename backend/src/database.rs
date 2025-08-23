use anyhow::Result;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::collections::HashMap;
use std::sync::Mutex;
use std::sync::Arc;

#[derive(Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub wallet_address: String,
    pub username: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub wallet_address: String,
    pub transaction_hash: String,
    pub from_token: String,
    pub to_token: String,
    pub amount: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

pub struct DatabaseService {
    // Mock database using in-memory storage
    users: Arc<Mutex<HashMap<String, User>>>,
    transactions: Arc<Mutex<HashMap<String, Transaction>>>,
    asset_tokens: Arc<Mutex<HashMap<String, crate::asset_tokenization::AssetToken>>>,
}

impl DatabaseService {
    pub async fn new(_database_url: &str) -> Result<Self> {
        // Mock database - no real connection needed
        Ok(Self {
            users: Arc::new(Mutex::new(HashMap::new())),
            transactions: Arc::new(Mutex::new(HashMap::new())),
            asset_tokens: Arc::new(Mutex::new(HashMap::new())),
        })
    }
    
    pub async fn create_user(&self, wallet_address: &str) -> Result<User> {
        let user = User {
            id: uuid::Uuid::new_v4().to_string(),
            wallet_address: wallet_address.to_string(),
            username: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        
        let mut users = self.users.lock().unwrap();
        users.insert(user.id.clone(), user.clone());
        
        Ok(user)
    }
    
    pub async fn get_user(&self, wallet_address: &str) -> Result<Option<User>> {
        let users = self.users.lock().unwrap();
        let user = users.values().find(|u| u.wallet_address == wallet_address).cloned();
        
        Ok(user)
    }
    
    pub async fn save_transaction(&self, transaction: &Transaction) -> Result<()> {
        let mut transactions = self.transactions.lock().unwrap();
        transactions.insert(transaction.id.clone(), transaction.clone());
        
        Ok(())
    }
    
    pub async fn get_user_transactions(&self, wallet_address: &str) -> Result<Vec<Transaction>> {
        let transactions = self.transactions.lock().unwrap();
        let user_transactions: Vec<Transaction> = transactions
            .values()
            .filter(|t| t.wallet_address == wallet_address)
            .cloned()
            .collect();
        
        Ok(user_transactions)
    }
    
    pub async fn save_asset_token(&self, token: &crate::asset_tokenization::AssetToken) -> Result<()> {
        let mut asset_tokens = self.asset_tokens.lock().unwrap();
        asset_tokens.insert(token.id.clone(), token.clone());
        
        Ok(())
    }
    
    pub async fn get_user_asset_tokens(&self, wallet_address: &str) -> Result<Vec<crate::asset_tokenization::AssetToken>> {
        let asset_tokens = self.asset_tokens.lock().unwrap();
        let user_tokens: Vec<crate::asset_tokenization::AssetToken> = asset_tokens
            .values()
            .filter(|t| t.creator_address == wallet_address)
            .cloned()
            .collect();
        
        Ok(user_tokens)
    }
    
    pub async fn update_token_metadata(&self, token_id: &str, metadata_uri: &str) -> Result<()> {
        let mut asset_tokens = self.asset_tokens.lock().unwrap();
        if let Some(token) = asset_tokens.get_mut(token_id) {
            token.metadata_uri = metadata_uri.to_string();
            token.updated_at = Utc::now();
        }
        
        Ok(())
    }
    
    pub async fn get_portfolio_stats(&self, wallet_address: &str) -> Result<serde_json::Value> {
        let transactions = self.transactions.lock().unwrap();
        let strategies = self.strategies.lock().unwrap();
        
        // Get total transactions
        let total_transactions = transactions
            .values()
            .filter(|t| t.wallet_address == wallet_address)
            .count() as i64;
        
        // Get total asset tokens
        let total_asset_tokens = asset_tokens
            .values()
            .filter(|t| t.creator_address == wallet_address)
            .count() as i64;
        
        // Get recent activity (mock data for now)
        let recent_activity = vec![
            serde_json::json!({
                "from_token": "BNB",
                "to_token": "PYUSD",
                "amount": "0.1",
                "created_at": Utc::now()
            })
        ];
        
        let stats = serde_json::json!({
            "total_transactions": total_transactions,
            "total_asset_tokens": total_asset_tokens,
            "recent_activity": recent_activity,
            "last_updated": Utc::now()
        });
        
        Ok(stats)
    }
} 