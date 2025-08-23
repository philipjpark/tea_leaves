use serde::Deserialize;
use std::env;

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub blockchain: BlockchainConfig,
    pub bartering: BarteringConfig,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct BlockchainConfig {
    pub rpc_url: String,
    pub chain_id: u64,
    pub pyusd_contract: String,
    pub tbnb_contract: String,
    pub private_key: Option<String>,
    // Additional fields needed by blockchain service
    pub bnb_rpc_url: String,
    pub pyusd_address: String,
    pub asset_tokenization_address: String,
    pub network: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct BarteringConfig {
    pub max_offer_expiry_hours: u32,
    pub min_barter_amount: u64,
    pub max_barter_amount: u64,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        dotenv::dotenv().ok();
        
        let config = Config {
            server: ServerConfig {
                host: env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string()),
                port: env::var("SERVER_PORT")
                    .unwrap_or_else(|_| "3001".to_string())
                    .parse()
                    .expect("SERVER_PORT must be a valid port number"),
            },
            database: DatabaseConfig {
                url: env::var("DATABASE_URL")
                    .unwrap_or_else(|_| "postgresql://localhost/tea_leaves".to_string()),
            },
            blockchain: BlockchainConfig {
                rpc_url: env::var("BSC_RPC_URL")
                    .unwrap_or_else(|_| "https://data-seed-prebsc-1-s1.binance.org:8545".to_string()),
                chain_id: env::var("BSC_CHAIN_ID")
                    .unwrap_or_else(|_| "97".to_string())
                    .parse()
                    .expect("BSC_CHAIN_ID must be a valid number"),
                pyusd_contract: env::var("PYUSD_CONTRACT_ADDRESS")
                    .unwrap_or_else(|_| "0x0000000000000000000000000000000000000000".to_string()),
                tbnb_contract: env::var("TBNB_CONTRACT_ADDRESS")
                    .unwrap_or_else(|_| "0x0000000000000000000000000000000000000000".to_string()),
                private_key: env::var("PRIVATE_KEY").ok(),
                // Additional fields with placeholder values
                bnb_rpc_url: env::var("BSC_RPC_URL")
                    .unwrap_or_else(|_| "https://data-seed-prebsc-1-s1.binance.org:8545".to_string()),
                pyusd_address: env::var("PYUSD_CONTRACT_ADDRESS")
                    .unwrap_or_else(|_| "0x0000000000000000000000000000000000000000".to_string()),
                asset_tokenization_address: env::var("ASSET_TOKENIZATION_ADDRESS")
                    .unwrap_or_else(|_| "0x0000000000000000000000000000000000000000".to_string()),
                network: env::var("BSC_NETWORK").unwrap_or_else(|_| "testnet".to_string()),
            },
            bartering: BarteringConfig {
                max_offer_expiry_hours: env::var("MAX_OFFER_EXPIRY_HOURS")
                    .unwrap_or_else(|_| "168".to_string()) // 7 days default
                    .parse()
                    .expect("MAX_OFFER_EXPIRY_HOURS must be a valid number"),
                min_barter_amount: env::var("MIN_BARTER_AMOUNT")
                    .unwrap_or_else(|_| "1".to_string())
                    .parse()
                    .expect("MIN_BARTER_AMOUNT must be a valid number"),
                max_barter_amount: env::var("MAX_BARTER_AMOUNT")
                    .unwrap_or_else(|_| "1000000".to_string())
                    .parse()
                    .expect("MAX_BARTER_AMOUNT must be a valid number"),
            },
        };
        
        Ok(config)
    }
    
    pub fn validate(&self) -> Result<(), String> {
        // Validate server config
        if self.server.port == 0 {
            return Err("Server port cannot be 0".to_string());
        }
        
        // Validate database config
        if self.database.url.is_empty() {
            return Err("Database URL cannot be empty".to_string());
        }
        
        // Validate blockchain config
        if self.blockchain.rpc_url.is_empty() {
            return Err("BSC RPC URL cannot be empty".to_string());
        }
        
        if self.blockchain.chain_id == 0 {
            return Err("Chain ID cannot be 0".to_string());
        }
        
        // Validate bartering config
        if self.bartering.max_offer_expiry_hours == 0 {
            return Err("Max offer expiry hours cannot be 0".to_string());
        }
        
        if self.bartering.min_barter_amount >= self.bartering.max_barter_amount {
            return Err("Min barter amount must be less than max barter amount".to_string());
        }
        
        Ok(())
    }
    
    pub fn is_development(&self) -> bool {
        env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string()) == "development"
    }
    
    pub fn is_production(&self) -> bool {
        env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string()) == "production"
    }
} 