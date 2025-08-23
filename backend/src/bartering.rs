use anyhow::Result;
use serde::{Deserialize, Serialize};
use tracing::info;
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Clone, Serialize, Deserialize)]
pub struct BarterOffer {
    pub id: String,
    pub offer_maker: String,
    pub offer_token_id: String,
    pub offer_amount: u64,
    pub request_token_id: String,
    pub request_amount: u64,
    pub expiry_timestamp: DateTime<Utc>,
    pub status: BarterStatus,
    pub created_at: DateTime<Utc>,
    pub accepted_at: Option<DateTime<Utc>>,
    pub cancelled_at: Option<DateTime<Utc>>,
    pub acceptor: Option<String>,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum BarterStatus {
    Open,
    Completed,
    Cancelled,
    Expired,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct BarterTransaction {
    pub id: String,
    pub offer_id: String,
    pub from_token: String,
    pub to_token: String,
    pub from_amount: u64,
    pub to_amount: u64,
    pub from_address: String,
    pub to_address: String,
    pub transaction_hash: Option<String>,
    pub status: TransactionStatus,
    pub created_at: DateTime<Utc>,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct DirectSwapRequest {
    pub from_token_id: String,
    pub to_token_id: String,
    pub from_amount: u64,
    pub to_amount: u64,
    pub from_address: String,
    pub to_address: String,
}

pub struct BarteringService {
    offers: Vec<BarterOffer>,
    transactions: Vec<BarterTransaction>,
}

impl BarteringService {
    pub async fn new() -> Result<Self> {
        Ok(Self {
            offers: Vec::new(),
            transactions: Vec::new(),
        })
    }
    
    pub async fn create_barter_offer(
        &mut self,
        offer_maker: &str,
        offer_token_id: &str,
        offer_amount: u64,
        request_token_id: &str,
        request_amount: u64,
        expiry_hours: u32,
    ) -> Result<String> {
        info!("Creating barter offer: {} tokens for {} tokens", offer_amount, request_amount);
        
        let offer = BarterOffer {
            id: Uuid::new_v4().to_string(),
            offer_maker: offer_maker.to_string(),
            offer_token_id: offer_token_id.to_string(),
            offer_amount,
            request_token_id: request_token_id.to_string(),
            request_amount,
            expiry_timestamp: Utc::now() + chrono::Duration::hours(expiry_hours as i64),
            status: BarterStatus::Open,
            created_at: Utc::now(),
            accepted_at: None,
            cancelled_at: None,
            acceptor: None,
        };
        
        self.offers.push(offer.clone());
        info!("Barter offer created with ID: {}", offer.id);
        
        Ok(offer.id)
    }
    
    pub async fn accept_barter_offer(
        &mut self,
        offer_id: &str,
        acceptor: &str,
    ) -> Result<String> {
        if let Some(offer) = self.offers.iter_mut().find(|o| o.id == offer_id) {
            if offer.status != BarterStatus::Open {
                return Err(anyhow::anyhow!("Offer is not open"));
            }
            
            if Utc::now() > offer.expiry_timestamp {
                offer.status = BarterStatus::Expired;
                return Err(anyhow::anyhow!("Offer has expired"));
            }
            
            offer.status = BarterStatus::Completed;
            offer.accepted_at = Some(Utc::now());
            offer.acceptor = Some(acceptor.to_string());
            
            // Create transaction record
            let transaction = BarterTransaction {
                id: Uuid::new_v4().to_string(),
                offer_id: offer_id.to_string(),
                from_token: offer.offer_token_id.clone(),
                to_token: offer.request_token_id.clone(),
                from_amount: offer.offer_amount,
                to_amount: offer.request_amount,
                from_address: offer.offer_maker.clone(),
                to_address: acceptor.to_string(),
                transaction_hash: None,
                status: TransactionStatus::Completed,
                created_at: Utc::now(),
            };
            
            self.transactions.push(transaction.clone());
            info!("Barter offer accepted: {}", offer_id);
            
            Ok(transaction.id)
        } else {
            Err(anyhow::anyhow!("Offer not found"))
        }
    }
    
    pub async fn cancel_barter_offer(
        &mut self,
        offer_id: &str,
        offer_maker: &str,
    ) -> Result<()> {
        if let Some(offer) = self.offers.iter_mut().find(|o| o.id == offer_id) {
            if offer.offer_maker != offer_maker {
                return Err(anyhow::anyhow!("Only offer maker can cancel"));
            }
            
            if offer.status != BarterStatus::Open {
                return Err(anyhow::anyhow!("Offer is not open"));
            }
            
            offer.status = BarterStatus::Cancelled;
            offer.cancelled_at = Some(Utc::now());
            
            info!("Barter offer cancelled: {}", offer_id);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Offer not found"))
        }
    }
    
    pub async fn execute_direct_swap(
        &mut self,
        request: DirectSwapRequest,
    ) -> Result<String> {
        info!("Executing direct swap: {} for {}", request.from_amount, request.to_amount);
        
        let transaction = BarterTransaction {
            id: Uuid::new_v4().to_string(),
            offer_id: "direct".to_string(),
            from_token: request.from_token_id,
            to_token: request.to_token_id,
            from_amount: request.from_amount,
            to_amount: request.to_amount,
            from_address: request.from_address,
            to_address: request.to_address,
            transaction_hash: None,
            status: TransactionStatus::Completed,
            created_at: Utc::now(),
        };
        
        self.transactions.push(transaction.clone());
        info!("Direct swap completed: {}", transaction.id);
        
        Ok(transaction.id)
    }
    
    pub async fn get_open_offers(&self) -> Result<Vec<BarterOffer>> {
        let open_offers: Vec<BarterOffer> = self.offers
            .iter()
            .filter(|o| o.status == BarterStatus::Open && Utc::now() <= o.expiry_timestamp)
            .cloned()
            .collect();
        
        Ok(open_offers)
    }
    
    pub async fn get_user_offers(&self, wallet_address: &str) -> Result<Vec<BarterOffer>> {
        let user_offers: Vec<BarterOffer> = self.offers
            .iter()
            .filter(|o| o.offer_maker == wallet_address || o.acceptor.as_ref().map_or(false, |a| a == wallet_address))
            .cloned()
            .collect();
        
        Ok(user_offers)
    }
    
    pub async fn get_user_transactions(&self, wallet_address: &str) -> Result<Vec<BarterTransaction>> {
        let user_transactions: Vec<BarterTransaction> = self.transactions
            .iter()
            .filter(|t| t.from_address == wallet_address || t.to_address == wallet_address)
            .cloned()
            .collect();
        
        Ok(user_transactions)
    }
    
    pub async fn get_bartering_statistics(&self) -> Result<serde_json::Value> {
        let total_offers = self.offers.len();
        let open_offers = self.offers.iter().filter(|o| o.status == BarterStatus::Open).count();
        let completed_offers = self.offers.iter().filter(|o| o.status == BarterStatus::Completed).count();
        let cancelled_offers = self.offers.iter().filter(|o| o.status == BarterStatus::Cancelled).count();
        
        let total_transactions = self.transactions.len();
        let completed_transactions = self.transactions.iter().filter(|t| t.status == TransactionStatus::Completed).count();
        
        let stats = serde_json::json!({
            "offers": {
                "total": total_offers,
                "open": open_offers,
                "completed": completed_offers,
                "cancelled": cancelled_offers
            },
            "transactions": {
                "total": total_transactions,
                "completed": completed_transactions
            },
            "last_updated": Utc::now()
        });
        
        Ok(stats)
    }
} 