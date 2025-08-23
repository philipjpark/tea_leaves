use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use tracing::{info, error};

mod blockchain;
mod asset_tokenization;
mod bartering;
mod database;
mod config;
mod gemma_proxy;

use blockchain::BNBChainService;
use asset_tokenization::AssetTokenizationService;
use bartering::BarteringService;
use database::DatabaseService;

#[derive(Clone)]
struct AppState {
    bnb_service: Arc<BNBChainService>,
    asset_tokenization_service: Arc<AssetTokenizationService>,
    bartering_service: Arc<BarteringService>,
    db: Arc<DatabaseService>,
}

#[derive(Deserialize)]
struct BarterRequest {
    from_token: String,
    to_token: String,
    amount: String,
    wallet_address: String,
}

#[derive(Serialize)]
struct BarterResponse {
    success: bool,
    transaction_hash: Option<String>,
    new_balances: Option<Balances>,
    error: Option<String>,
}

#[derive(Serialize)]
struct Balances {
    pyusd: String,
    tbnb: String,
    bnb: String,
}

#[derive(Deserialize)]
struct AssetTokenRequest {
    name: String,
    symbol: String,
    asset_class: String,
    total_supply: u64,
    metadata_uri: String,
    wallet_address: String,
}

#[derive(Serialize)]
struct AssetTokenResponse {
    success: bool,
    token_id: Option<String>,
    error: Option<String>,
}

async fn health_check() -> StatusCode {
    StatusCode::OK
}

async fn get_balances(
    State(state): State<AppState>,
    Json(request): Json<BarterRequest>,
) -> Json<Balances> {
    info!("Getting balances for wallet: {}", request.wallet_address);
    
    match state.bnb_service.get_all_balances(&request.wallet_address).await {
        Ok(balances) => Json(Balances {
            pyusd: balances.pyusd,
            tbnb: balances.tbnb,
            bnb: balances.bnb,
        }),
        Err(e) => {
            error!("Failed to get balances: {}", e);
            Json(Balances {
                pyusd: "0.00".to_string(),
                tbnb: "0.00".to_string(),
                bnb: "0.00".to_string(),
            })
        }
    }
}

async fn execute_barter(
    State(state): State<AppState>,
    Json(request): Json<BarterRequest>,
) -> Json<BarterResponse> {
    info!("Executing barter: {} {} → {}", request.amount, request.from_token, request.to_token);
    
    match state.bnb_service.execute_barter(
        &request.from_token,
        &request.to_token,
        &request.amount,
        &request.wallet_address,
    ).await {
        Ok(result) => Json(BarterResponse {
            success: true,
            transaction_hash: Some(result.transaction_hash),
            new_balances: Some(Balances {
                pyusd: result.new_balances.pyusd,
                tbnb: result.new_balances.tbnb,
                bnb: result.new_balances.bnb,
            }),
            error: None,
        }),
        Err(e) => {
            error!("Barter failed: {}", e);
            Json(BarterResponse {
                success: false,
                transaction_hash: None,
                new_balances: None,
                error: Some(e.to_string()),
            })
        }
    }
}

async fn create_asset_token(
    State(state): State<AppState>,
    Json(request): Json<AssetTokenRequest>,
) -> Json<AssetTokenResponse> {
    info!("Creating asset token: {} ({})", request.name, request.symbol);
    
    match state.asset_tokenization_service.create_asset_token(
        &request.name,
        &request.symbol,
        request.asset_class.parse().unwrap_or(crate::asset_tokenization::AssetClass::Custom),
        request.total_supply,
        &request.metadata_uri,
        &request.wallet_address,
    ).await {
        Ok(token_id) => Json(AssetTokenResponse {
            success: true,
            token_id: Some(token_id),
            error: None,
        }),
        Err(e) => {
            error!("Asset token creation failed: {}", e);
            Json(AssetTokenResponse {
                success: false,
                token_id: None,
                error: Some(e.to_string()),
            })
        }
    }
}

async fn get_bartering_statistics(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    info!("Getting bartering statistics");
    
    match state.bartering_service.get_bartering_statistics().await {
        Ok(stats) => Json(stats),
        Err(e) => {
            error!("Failed to get bartering statistics: {}", e);
            Json(serde_json::json!({
                "error": e.to_string()
            }))
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt::init();
    
    info!("🚀 Starting tea_leaves Bartering 2.0 Backend...");
    
    // Load configuration
    dotenv::dotenv().ok();
    let config = config::Config::from_env()?;
    
    // Initialize services
    let bnb_service = Arc::new(BNBChainService::new(&config).await?);
    let asset_tokenization_service = Arc::new(AssetTokenizationService::new().await?);
    let bartering_service = Arc::new(BarteringService::new().await?);
    let db = Arc::new(DatabaseService::new(&config.database.url).await?);
    
    let state = AppState {
        bnb_service,
        asset_tokenization_service,
        bartering_service,
        db,
    };
    
    // Build router
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/balances", post(get_balances))
        .route("/api/barter", post(execute_barter))
        .route("/api/asset-token", post(create_asset_token))
        .route("/api/bartering-stats", get(get_bartering_statistics))
        .route("/api/gemma", post(gemma_proxy::proxy_gemma))
        .with_state(state);
    
    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await?;
    info!("🌐 Server running on http://127.0.0.1:3001");
    
    axum::serve(listener, app).await?;
    
    Ok(())
} 