use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo, Burn};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("AssetTokenization111111111111111111111111111111111");

#[program]
pub mod asset_tokenization {
    use super::*;

    /// Initialize a new asset token
    pub fn initialize_asset_token(
        ctx: Context<InitializeAssetToken>,
        asset_name: String,
        asset_symbol: String,
        asset_class: AssetClass,
        total_supply: u64,
        metadata_uri: String,
    ) -> Result<()> {
        let asset_token = &mut ctx.accounts.asset_token;
        let mint = &mut ctx.accounts.mint;
        
        // Set mint authority to the asset token program
        mint.authority = asset_token.key();
        mint.supply = 0;
        mint.decimals = 6; // Standard 6 decimal places
        
        // Initialize asset token data
        asset_token.mint = mint.key();
        asset_token.authority = ctx.accounts.authority.key();
        asset_token.asset_name = asset_name;
        asset_token.asset_symbol = asset_symbol;
        asset_token.asset_class = asset_class;
        asset_token.total_supply = total_supply;
        asset_token.metadata_uri = metadata_uri;
        asset_token.is_active = true;
        asset_token.created_at = Clock::get()?.unix_timestamp;
        asset_token.bump = *ctx.bumps.get("asset_token").unwrap();
        
        msg!("Asset token initialized: {} ({})", asset_token.asset_name, asset_token.asset_symbol);
        Ok(())
    }

    /// Mint asset tokens to a recipient
    pub fn mint_asset_tokens(
        ctx: Context<MintAssetTokens>,
        amount: u64,
    ) -> Result<()> {
        let asset_token = &ctx.accounts.asset_token;
        let mint = &mut ctx.accounts.mint;
        let recipient_token_account = &ctx.accounts.recipient_token_account;
        
        // Verify authority
        require!(asset_token.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        require!(asset_token.is_active, ErrorCode::AssetTokenInactive);
        
        // Check supply limits
        require!(
            mint.supply.checked_add(amount).unwrap() <= asset_token.total_supply,
            ErrorCode::ExceedsTotalSupply
        );
        
        // Mint tokens to recipient
        let mint_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: mint.to_account_info(),
                to: recipient_token_account.to_account_info(),
                authority: asset_token.to_account_info(),
            },
        );
        
        token::mint_to(mint_ctx, amount)?;
        mint.supply = mint.supply.checked_add(amount).unwrap();
        
        msg!("Minted {} {} tokens to recipient", amount, asset_token.asset_symbol);
        Ok(())
    }

    /// Burn asset tokens
    pub fn burn_asset_tokens(
        ctx: Context<BurnAssetTokens>,
        amount: u64,
    ) -> Result<()> {
        let asset_token = &ctx.accounts.asset_token;
        let mint = &mut ctx.accounts.mint;
        let user_token_account = &ctx.accounts.user_token_account;
        
        // Verify authority
        require!(asset_token.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        // Burn tokens from user
        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: mint.to_account_info(),
                from: user_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        
        token::burn(burn_ctx, amount)?;
        mint.supply = mint.supply.checked_sub(amount).unwrap();
        
        msg!("Burned {} {} tokens", amount, asset_token.asset_symbol);
        Ok(())
    }

    /// Update asset token metadata
    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        new_metadata_uri: String,
    ) -> Result<()> {
        let asset_token = &mut ctx.accounts.asset_token;
        
        // Verify authority
        require!(asset_token.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        asset_token.metadata_uri = new_metadata_uri;
        msg!("Metadata updated for {}", asset_token.asset_name);
        Ok(())
    }

    /// Deactivate asset token
    pub fn deactivate_asset_token(ctx: Context<DeactivateAssetToken>) -> Result<()> {
        let asset_token = &mut ctx.accounts.asset_token;
        
        // Verify authority
        require!(asset_token.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        asset_token.is_active = false;
        msg!("Asset token deactivated: {}", asset_token.asset_name);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAssetToken<'info> {
    #[account(
        init,
        payer = authority,
        space = AssetToken::LEN,
        seeds = [b"asset_token", mint.key().as_ref()],
        bump
    )]
    pub asset_token: Account<'info, AssetToken>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = asset_token,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintAssetTokens<'info> {
    #[account(mut)]
    pub asset_token: Account<'info, AssetToken>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = recipient,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    pub recipient: SystemAccount<'info>,
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BurnAssetTokens<'info> {
    #[account(mut)]
    pub asset_token: Account<'info, AssetToken>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(mut)]
    pub asset_token: Account<'info, AssetToken>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeactivateAssetToken<'info> {
    #[account(mut)]
    pub asset_token: Account<'info, AssetToken>,
    
    pub authority: Signer<'info>,
}

#[account]
pub struct AssetToken {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub asset_name: String,
    pub asset_symbol: String,
    pub asset_class: AssetClass,
    pub total_supply: u64,
    pub metadata_uri: String,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
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

impl AssetToken {
    pub const LEN: usize = 8 + // discriminator
        32 + // mint
        32 + // authority
        64 + // asset_name (max 64 chars)
        16 + // asset_symbol (max 16 chars)
        1 +  // asset_class
        8 +  // total_supply
        200 + // metadata_uri (max 200 chars)
        1 +  // is_active
        8 +  // created_at
        1;   // bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Asset token is not active")]
    AssetTokenInactive,
    #[msg("Amount exceeds total supply")]
    ExceedsTotalSupply,
} 