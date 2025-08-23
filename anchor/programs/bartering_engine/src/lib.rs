use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("BarteringEngine111111111111111111111111111111111111");

#[program]
pub mod bartering_engine {
    use super::*;

    /// Create a new barter offer
    pub fn create_barter_offer(
        ctx: Context<CreateBarterOffer>,
        offer_amount: u64,
        request_amount: u64,
        request_token_mint: Pubkey,
        expiry_timestamp: i64,
    ) -> Result<()> {
        let barter_offer = &mut ctx.accounts.barter_offer;
        let offer_token_account = &ctx.accounts.offer_token_account;
        
        // Verify the offer token account has sufficient balance
        require!(
            offer_token_account.amount >= offer_amount,
            ErrorCode::InsufficientOfferBalance
        );
        
        // Verify expiry is in the future
        let current_time = Clock::get()?.unix_timestamp;
        require!(expiry_timestamp > current_time, ErrorCode::InvalidExpiryTime);
        
        // Initialize barter offer
        barter_offer.offer_maker = ctx.accounts.offer_maker.key();
        barter_offer.offer_token_mint = offer_token_account.mint;
        barter_offer.offer_amount = offer_amount;
        barter_offer.request_token_mint = request_token_mint;
        barter_offer.request_amount = request_amount;
        barter_offer.expiry_timestamp = expiry_timestamp;
        barter_offer.status = BarterStatus::Open;
        barter_offer.created_at = current_time;
        barter_offer.bump = *ctx.bumps.get("barter_offer").unwrap();
        
        msg!("Barter offer created: {} tokens for {} tokens", offer_amount, request_amount);
        Ok(())
    }

    /// Accept a barter offer
    pub fn accept_barter_offer(
        ctx: Context<AcceptBarterOffer>,
    ) -> Result<()> {
        let barter_offer = &mut ctx.accounts.barter_offer;
        let offer_maker_token_account = &ctx.accounts.offer_maker_token_account;
        let acceptor_token_account = &ctx.accounts.acceptor_token_account;
        let acceptor_offer_token_account = &ctx.accounts.acceptor_offer_token_account;
        
        // Verify offer is still open and not expired
        require!(barter_offer.status == BarterStatus::Open, ErrorCode::OfferNotOpen);
        let current_time = Clock::get()?.unix_timestamp;
        require!(barter_offer.expiry_timestamp > current_time, ErrorCode::OfferExpired);
        
        // Verify sufficient balances
        require!(
            offer_maker_token_account.amount >= barter_offer.offer_amount,
            ErrorCode::InsufficientOfferBalance
        );
        require!(
            acceptor_token_account.amount >= barter_offer.request_amount,
            ErrorCode::InsufficientRequestBalance
        );
        
        // Execute the barter swap
        // 1. Transfer offer tokens from offer maker to acceptor
        let transfer_offer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: offer_maker_token_account.to_account_info(),
                to: acceptor_offer_token_account.to_account_info(),
                authority: ctx.accounts.offer_maker.to_account_info(),
            },
        );
        token::transfer(transfer_offer_ctx, barter_offer.offer_amount)?;
        
        // 2. Transfer request tokens from acceptor to offer maker
        let transfer_request_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: acceptor_token_account.to_account_info(),
                to: ctx.accounts.offer_maker_request_token_account.to_account_info(),
                authority: ctx.accounts.acceptor.to_account_info(),
            },
        );
        token::transfer(transfer_request_ctx, barter_offer.request_amount)?;
        
        // Update offer status
        barter_offer.status = BarterStatus::Completed;
        barter_offer.accepted_at = current_time;
        barter_offer.acceptor = ctx.accounts.acceptor.key();
        
        msg!("Barter offer accepted and completed successfully!");
        Ok(())
    }

    /// Cancel a barter offer
    pub fn cancel_barter_offer(ctx: Context<CancelBarterOffer>) -> Result<()> {
        let barter_offer = &mut ctx.accounts.barter_offer;
        
        // Only the offer maker can cancel
        require!(
            barter_offer.offer_maker == ctx.accounts.offer_maker.key(),
            ErrorCode::Unauthorized
        );
        require!(barter_offer.status == BarterStatus::Open, ErrorCode::OfferNotOpen);
        
        barter_offer.status = BarterStatus::Cancelled;
        barter_offer.cancelled_at = Clock::get()?.unix_timestamp;
        
        msg!("Barter offer cancelled");
        Ok(())
    }

    /// Create a direct barter swap (no offer needed)
    pub fn direct_barter_swap(
        ctx: Context<DirectBarterSwap>,
        offer_amount: u64,
        request_amount: u64,
    ) -> Result<()> {
        let offer_token_account = &ctx.accounts.offer_token_account;
        let request_token_account = &ctx.accounts.request_token_account;
        let recipient_offer_token_account = &ctx.accounts.recipient_offer_token_account;
        let recipient_request_token_account = &ctx.accounts.recipient_request_token_account;
        
        // Verify sufficient balances
        require!(
            offer_token_account.amount >= offer_amount,
            ErrorCode::InsufficientOfferBalance
        );
        require!(
            request_token_account.amount >= request_amount,
            ErrorCode::InsufficientRequestBalance
        );
        
        // Execute direct swap
        // 1. Transfer offer tokens from offer maker to request maker
        let transfer_offer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: offer_token_account.to_account_info(),
                to: recipient_offer_token_account.to_account_info(),
                authority: ctx.accounts.offer_maker.to_account_info(),
            },
        );
        token::transfer(transfer_offer_ctx, offer_amount)?;
        
        // 2. Transfer request tokens from request maker to offer maker
        let transfer_request_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: request_token_account.to_account_info(),
                to: recipient_request_token_account.to_account_info(),
                authority: ctx.accounts.request_maker.to_account_info(),
            },
        );
        token::transfer(transfer_request_ctx, request_amount)?;
        
        msg!("Direct barter swap completed: {} for {}", offer_amount, request_amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateBarterOffer<'info> {
    #[account(
        init,
        payer = offer_maker,
        space = BarterOffer::LEN,
        seeds = [b"barter_offer", offer_maker.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub barter_offer: Account<'info, BarterOffer>,
    
    #[account(mut)]
    pub offer_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub offer_maker: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptBarterOffer<'info> {
    #[account(mut)]
    pub barter_offer: Account<'info, BarterOffer>,
    
    #[account(mut)]
    pub offer_maker_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub acceptor_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = acceptor,
        associated_token::mint = barter_offer.offer_token_mint,
        associated_token::authority = acceptor,
    )]
    pub acceptor_offer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = offer_maker,
        associated_token::mint = barter_offer.request_token_mint,
        associated_token::authority = offer_maker,
    )]
    pub offer_maker_request_token_account: Account<'info, TokenAccount>,
    
    pub offer_maker: SystemAccount<'info>,
    #[account(mut)]
    pub acceptor: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelBarterOffer<'info> {
    #[account(mut)]
    pub barter_offer: Account<'info, BarterOffer>,
    
    pub offer_maker: Signer<'info>,
}

#[derive(Accounts)]
pub struct DirectBarterSwap<'info> {
    #[account(mut)]
    pub offer_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub request_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = request_maker,
        associated_token::mint = offer_token_account.mint,
        associated_token::authority = request_maker,
    )]
    pub recipient_offer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = offer_maker,
        associated_token::mint = request_token_account.mint,
        associated_token::authority = offer_maker,
    )]
    pub recipient_request_token_account: Account<'info, TokenAccount>,
    
    pub offer_maker: Signer<'info>,
    pub request_maker: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BarterOffer {
    pub offer_maker: Pubkey,
    pub offer_token_mint: Pubkey,
    pub offer_amount: u64,
    pub request_token_mint: Pubkey,
    pub request_amount: u64,
    pub expiry_timestamp: i64,
    pub status: BarterStatus,
    pub created_at: i64,
    pub accepted_at: Option<i64>,
    pub cancelled_at: Option<i64>,
    pub acceptor: Option<Pubkey>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BarterStatus {
    Open,
    Completed,
    Cancelled,
    Expired,
}

impl BarterOffer {
    pub const LEN: usize = 8 + // discriminator
        32 + // offer_maker
        32 + // offer_token_mint
        8 +  // offer_amount
        32 + // request_token_mint
        8 +  // request_amount
        8 +  // expiry_timestamp
        1 +  // status
        8 +  // created_at
        9 +  // accepted_at (Option<i64>)
        9 +  // cancelled_at (Option<i64>)
        33 + // acceptor (Option<Pubkey>)
        1;   // bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance in offer token account")]
    InsufficientOfferBalance,
    #[msg("Insufficient balance in request token account")]
    InsufficientRequestBalance,
    #[msg("Invalid expiry timestamp")]
    InvalidExpiryTime,
    #[msg("Offer is not open")]
    OfferNotOpen,
    #[msg("Offer has expired")]
    OfferExpired,
    #[msg("Unauthorized access")]
    Unauthorized,
} 