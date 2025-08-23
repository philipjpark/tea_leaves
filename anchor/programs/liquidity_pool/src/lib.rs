use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo, Burn, Transfer};

declare_id!("LiquidityPool111111111111111111111111111111111111111");

#[program]
pub mod liquidity_pool {
    use super::*;

    /// Initialize a new liquidity pool for a token pair
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        pool_name: String,
        fee_rate: u64, // Fee rate in basis points (e.g., 30 = 0.3%)
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let pool_token_mint = &mut ctx.accounts.pool_token_mint;
        
        // Set pool token mint authority to the pool
        pool_token_mint.authority = pool.key();
        pool_token_mint.supply = 0;
        pool_token_mint.decimals = 6;
        
        // Initialize pool data
        pool.pool_name = pool_name;
        pool.token_a_mint = ctx.accounts.token_a_mint.key();
        pool.token_b_mint = ctx.accounts.token_b_mint.key();
        pool.pool_token_mint = pool_token_mint.key();
        pool.fee_rate = fee_rate;
        pool.total_liquidity = 0;
        pool.is_active = true;
        pool.created_at = Clock::get()?.unix_timestamp;
        pool.bump = *ctx.bumps.get("pool").unwrap();
        
        msg!("Liquidity pool initialized: {}", pool.pool_name);
        Ok(())
    }

    /// Add liquidity to the pool
    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        token_a_amount: u64,
        token_b_amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let pool_token_mint = &mut ctx.accounts.pool_token_mint;
        let user_token_a_account = &ctx.accounts.user_token_a_account;
        let user_token_b_account = &ctx.accounts.user_token_b_account;
        let pool_token_a_account = &mut ctx.accounts.pool_token_a_account;
        let pool_token_b_account = &mut ctx.accounts.pool_token_b_account;
        let user_pool_token_account = &ctx.accounts.user_pool_token_account;
        
        require!(pool.is_active, ErrorCode::PoolInactive);
        
        // Calculate pool tokens to mint
        let pool_tokens_to_mint = if pool.total_liquidity == 0 {
            (token_a_amount * token_b_amount).sqrt()
        } else {
            let token_a_ratio = (token_a_amount * pool.total_liquidity) / pool_token_a_account.amount;
            let token_b_ratio = (token_b_amount * pool.total_liquidity) / pool_token_b_account.amount;
            token_a_ratio.min(token_b_ratio)
        };
        
        // Transfer tokens from user to pool
        let transfer_a_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: user_token_a_account.to_account_info(),
                to: pool_token_a_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_a_ctx, token_a_amount)?;
        
        let transfer_b_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: user_token_b_account.to_account_info(),
                to: pool_token_b_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_b_ctx, token_b_amount)?;
        
        // Mint pool tokens to user
        let mint_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: pool_token_mint.to_account_info(),
                to: user_pool_token_account.to_account_info(),
                authority: pool.to_account_info(),
            },
        );
        token::mint_to(mint_ctx, pool_tokens_to_mint)?;
        
        // Update pool state
        pool.total_liquidity = pool.total_liquidity.checked_add(pool_tokens_to_mint).unwrap();
        pool_token_mint.supply = pool_token_mint.supply.checked_add(pool_tokens_to_mint).unwrap();
        
        msg!("Added liquidity: {} pool tokens minted", pool_tokens_to_mint);
        Ok(())
    }

    /// Remove liquidity from the pool
    pub fn remove_liquidity(
        ctx: Context<RemoveLiquidity>,
        pool_tokens_to_burn: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let pool_token_mint = &mut ctx.accounts.pool_token_mint;
        let user_pool_token_account = &ctx.accounts.user_pool_token_account;
        let pool_token_a_account = &mut ctx.accounts.pool_token_a_account;
        let pool_token_b_account = &mut ctx.accounts.pool_token_b_account;
        let user_token_a_account = &ctx.accounts.user_token_a_account;
        let user_token_b_account = &ctx.accounts.user_token_b_account;
        
        require!(pool.is_active, ErrorCode::PoolInactive);
        
        // Calculate tokens to return
        let token_a_amount = (pool_tokens_to_burn * pool_token_a_account.amount) / pool.total_liquidity;
        let token_b_amount = (pool_tokens_to_burn * pool_token_b_account.amount) / pool.total_liquidity;
        
        // Burn pool tokens from user
        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: pool_token_mint.to_account_info(),
                from: user_pool_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::burn(burn_ctx, pool_tokens_to_burn)?;
        
        // Transfer tokens from pool to user
        let transfer_a_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: pool_token_a_account.to_account_info(),
                to: user_token_a_account.to_account_info(),
                authority: pool.to_account_info(),
            },
        );
        token::transfer(transfer_a_ctx, token_a_amount)?;
        
        let transfer_b_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: pool_token_b_account.to_account_info(),
                to: user_token_b_account.to_account_info(),
                authority: pool.to_account_info(),
            },
        );
        token::transfer(transfer_b_ctx, token_b_amount)?;
        
        // Update pool state
        pool.total_liquidity = pool.total_liquidity.checked_sub(pool_tokens_to_burn).unwrap();
        pool_token_mint.supply = pool_token_mint.supply.checked_sub(pool_tokens_to_burn).unwrap();
        
        msg!("Removed liquidity: {} token A, {} token B", token_a_amount, token_b_amount);
        Ok(())
    }

    /// Swap tokens through the pool
    pub fn swap_tokens(
        ctx: Context<SwapTokens>,
        input_amount: u64,
        minimum_output_amount: u64,
        is_token_a_to_b: bool,
    ) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let user_input_token_account = &ctx.accounts.user_input_token_account;
        let user_output_token_account = &ctx.accounts.user_output_token_account;
        let pool_input_token_account = &mut ctx.accounts.pool_input_token_account;
        let pool_output_token_account = &mut ctx.accounts.pool_output_token_account;
        
        require!(pool.is_active, ErrorCode::PoolInactive);
        
        // Calculate output amount using constant product formula
        let output_amount = if is_token_a_to_b {
            let token_a_reserve = pool_input_token_account.amount;
            let token_b_reserve = pool_output_token_account.amount;
            let fee_amount = (input_amount * pool.fee_rate) / 10000;
            let input_after_fee = input_amount - fee_amount;
            (input_after_fee * token_b_reserve) / (token_a_reserve + input_after_fee)
        } else {
            let token_b_reserve = pool_input_token_account.amount;
            let token_a_reserve = pool_output_token_account.amount;
            let fee_amount = (input_amount * pool.fee_rate) / 10000;
            let input_after_fee = input_amount - fee_amount;
            (input_after_fee * token_a_reserve) / (token_b_reserve + input_after_fee)
        };
        
        require!(output_amount >= minimum_output_amount, ErrorCode::InsufficientOutputAmount);
        
        // Transfer input tokens from user to pool
        let transfer_input_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: user_input_token_account.to_account_info(),
                to: pool_input_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_input_ctx, input_amount)?;
        
        // Transfer output tokens from pool to user
        let transfer_output_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: pool_output_token_account.to_account_info(),
                to: user_output_token_account.to_account_info(),
                authority: pool.to_account_info(),
            },
        );
        token::transfer(transfer_output_ctx, output_amount)?;
        
        msg!("Swap completed: {} input for {} output", input_amount, output_amount);
        Ok(())
    }

    /// Deactivate pool
    pub fn deactivate_pool(ctx: Context<DeactivatePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        require!(pool.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        pool.is_active = false;
        msg!("Pool deactivated: {}", pool.pool_name);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = Pool::LEN,
        seeds = [b"liquidity_pool", token_a_mint.key().as_ref(), token_b_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = pool,
    )]
    pub pool_token_mint: Account<'info, Mint>,
    
    pub token_a_mint: Account<'info, Mint>,
    pub token_b_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub pool_token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_a_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_a_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_b_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = pool.pool_token_mint,
        associated_token::authority = user,
    )]
    pub user_pool_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub pool_token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_pool_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_a_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_b_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_a_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b_account: Account<'info, TokenAccount>,
    
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SwapTokens<'info> {
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub user_input_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = pool.token_b_mint,
        associated_token::authority = user,
    )]
    pub user_output_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_input_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_output_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeactivatePool<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    pub authority: Signer<'info>,
}

#[account]
pub struct Pool {
    pub pool_name: String,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub pool_token_mint: Pubkey,
    pub fee_rate: u64,
    pub total_liquidity: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub authority: Pubkey,
    pub bump: u8,
}

impl Pool {
    pub const LEN: usize = 8 + // discriminator
        64 + // pool_name (max 64 chars)
        32 + // token_a_mint
        32 + // token_b_mint
        32 + // pool_token_mint
        8 +  // fee_rate
        8 +  // total_liquidity
        1 +  // is_active
        8 +  // created_at
        32 + // authority
        1;   // bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Pool is not active")]
    PoolInactive,
    #[msg("Insufficient output amount")]
    InsufficientOutputAmount,
    #[msg("Unauthorized access")]
    Unauthorized,
} 