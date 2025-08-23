-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    username VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    from_token VARCHAR(42) NOT NULL,
    to_token VARCHAR(42) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create asset_tokens table
CREATE TABLE IF NOT EXISTS asset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    symbol VARCHAR(16) NOT NULL,
    asset_class VARCHAR(50) NOT NULL,
    total_supply BIGINT NOT NULL,
    metadata_uri TEXT,
    creator_address VARCHAR(42) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (creator_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create barter_offers table
CREATE TABLE IF NOT EXISTS barter_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_maker VARCHAR(42) NOT NULL,
    offer_token_id UUID NOT NULL,
    offer_amount BIGINT NOT NULL,
    request_token_id UUID NOT NULL,
    request_amount BIGINT NOT NULL,
    expiry_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    acceptor VARCHAR(42),
    FOREIGN KEY (offer_maker) REFERENCES users(wallet_address) ON DELETE CASCADE,
    FOREIGN KEY (offer_token_id) REFERENCES asset_tokens(id) ON DELETE CASCADE,
    FOREIGN KEY (request_token_id) REFERENCES asset_tokens(id) ON DELETE CASCADE
);

-- Create portfolio_snapshots table
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) NOT NULL,
    total_value DECIMAL(20, 8) NOT NULL,
    bnb_balance DECIMAL(20, 8) NOT NULL,
    pyusd_balance DECIMAL(20, 8) NOT NULL,
    snapshot_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_asset_tokens_creator_address ON asset_tokens(creator_address);
CREATE INDEX IF NOT EXISTS idx_asset_tokens_is_active ON asset_tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_barter_offers_offer_maker ON barter_offers(offer_maker);
CREATE INDEX IF NOT EXISTS idx_barter_offers_status ON barter_offers(status);
CREATE INDEX IF NOT EXISTS idx_barter_offers_expiry_timestamp ON barter_offers(expiry_timestamp);
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_wallet_address ON portfolio_snapshots(wallet_address);
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_snapshot_date ON portfolio_snapshots(snapshot_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_tokens_updated_at BEFORE UPDATE ON asset_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 