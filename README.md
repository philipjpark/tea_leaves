# <img src="frontend/public/tea.png" width="32" height="32" alt="tea_leaves"> *Tea_leaves* - Multi-Asset Bartering Exchange (BEX)

> **"Tokenizing Every Asset, Reimagining Asset Classes"** - The Future of Global Digital Bartering

## 🚀 Vision

*Tea_leaves* is a revolutionary **Multi-Asset Bartering Exchange (BEX)** that transforms traditional finance into a global, digital, instant system using crypto rails and smart contracts. Instead of USD being the middleman, assets swap directly: 
***Ex.* Prediction tokens → ETH → ETF → Startup equity → Commodities → back to crypto**.

This turns finance into a continuous, always-on barter network where anything can be traded for anything, anywhere, anytime but yes managed by both Trad-Fi and De-Fi. 

Finally there is a happy medium in the convergence.

### 🎯 What *Tea_leaves* is About
- **Platform Identity**: *Tea_leaves* - Multi-Asset Bartering Exchange (BEX)
- **Tagline**: "Tokenizing Every Asset, Reimagining Asset Classes"
- **Enterprise Focus**: "Enterprise-grade infrastructure for RWA tokenization"
- **Asset Agnostic**: Granular deep asset trading with real-time and reliable liquidity

### 🎨 **Asset Classes Supported**
- **Prediction Markets** - Trade event outcomes like assets
- **Real Estate** - Tokenized property investments
- **Athletes / Artists** - Future contract tokenization
- **Startup Equity** - Venture capital democratization
- **Commodities** - Gold, oil, agricultural products
- **Crypto** - Digital asset trading
- **User-Gen Tokens** - Community-created assets
- **Tokenized Securities** - Traditional financial instruments
- **IP Rights** - Intellectual property tokenization

### 🐋 **Liquidity Ecosystem**
- **Whales (Institutions)**: Deep liquidity pools, stable pricing, large-scale operations
- **Minnows (Retail)**: Diverse access, market depth, innovation, community
- **Infrastructure Power**: Multi-token asset tokenization, cross-chain liquidity routing, institutional-grade security

### 🏗️ **Enterprise Infrastructure Pipeline**
1. **Tokenization Factory** - Transform any asset into standardized, tradeable tokens
2. **Collateralized Swaps** - Institutional-grade collateral backs every swap
3. **Liquidity Routing** - Automated cross-chain pathfinding for seamless swaps
4. **Global Bartering Network** - Peer-to-peer trades across all asset classes
5. **Asset Tokenization** - Convert real estate, music royalties, startup equity

### 🎯 **6 Ways to Participate**
1. **Creator** - Design custom tokens with AI-agent assisted system-prompt generator
2. **Leaderboard Warrior** - Compete for most liquid, creative, and lucrative tokens
3. **Liquidity Provider** - Provide liquidity and earn from trading fees
4. **Custodian** - Help onboard new users and custody their assets
5. **Developer** - Make pull requests and earn TEALV tokens
6. **Sub-Exchange Creator** - Create limit exposure, private networks (Coming Soon)

## 🌟 Why It Works Now

*Tea_leaves* sits at the intersection of trends that didn't exist even 5 years ago:

- **Prediction markets**: Polymarket, Kalshi → trade event outcomes like assets
- **Tokenization platforms**: Ondo Finance, Securitize → tokenized bonds, ETFs, private equity
- **Decentralized exchanges**: Uniswap, Curve → automated, permissionless swaps
- **Cross-chain settlement**: LayerZero, Axelar → instant settlement across ecosystems
- **24/7 collateralization**: Regulated liability networks → institutional players enter once risk is managed

## 🏗️ Architecture

### Phase 1: Tokenization Factory ✅
- Onboard any asset: IP rights, music royalties, future athlete contracts, real estate, commodities, prediction contracts
- Output standardized, tradeable tokens
- **Status**: Implemented with token templates

### Phase 2: Collateralized Swap Layer ✅
- Institutional-grade collateral backs every swap

### Phase 3: Liquidity Routing Engine 🚧
- Finds best paths: Prediction → ETF → Altcoin → Equity → Commodity → Back to Crypto
- Cross-chain, 24/7, automated


### Phase 4: Bartering Network 🚧
- Peer-to-peer trades across all asset classes
- Options, hedges, leverage built into smart contracts

## 🎯 Current Features

### ✅ Digital Asset Wallet
- **Multi-Asset Compartments**: Real Estate, Music Royalties, Startup Equity, Commodities, Prediction Tokens, Crypto
- **Physical Wallet Design**: Intuitive interface with that handles your assets like a physical wallet would
- **Performance Tracking**: 24h changes, item counts, and balance management
- **Quick Actions**: Asset bartering, token creation, transaction history

### ✅ Token Factory
- **Token Templates**: Prediction markets, real estate, music royalties, startup equity, commodities, crypto derivatives
- **Logical Workflow**: Step-by-step token creation process (Prompt engineering intuition flow)
- **BNB Chain Ready**: Deploy tokens directly to BSC (in production)
- **Smart Validation**: Form validation and error handling

### ✅ Barter Marketplace
- **Asset Discovery**: Browse all available tokens
- **Swap Creation**: Create swap offers between any assets
- **Real-time Pricing**: Live exchange rates and liquidity data
- **Collateral Tracking**: Monitor backing for all swaps

### ✅ BNB Chain Integration (Coming Soon)
- **Network Detection**: Automatic BSC mainnet/testnet detection
- **Wallet Connection**: MetaMask integration
- **Gas Estimation**: Smart gas cost calculations
- **Cross-chain Ready**: Foundation for LayerZero/Axelar integration

### ✅ *Tea_Leaves* AI Integration
- **Gemma 3-4B Model**: Advanced AI-powered strategy generation
- **Factor Discovery**: Automated factor analysis and optimization
- **Agentic Framework**: 3 separate agentic pods tasked to orchestrate tokenization tasks

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Material-UI + Framer Motion
- **Backend**: Rust + Actix-web + *Tea_Leaves* AI Framework
- **Blockchain**: BNB Smart Chain (BSC) + Solidity
- **AI**: Google Gemma 3-4B + *Tea-Leaves* Factor Discovery
- **Cross-chain**: LayerZero/Axelar (planned)
- **Token Standards**: ERC-20, ERC-4626
- **Deployment**: Docker + Google Cloud Run

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Rust 1.75+
- MetaMask wallet
- BNB & SOL for gas fees

### Installation

```bash
# Clone the repository
git clone https://github.com/philipjpark/tea_leaves.git
cd frontend

# Install dependencies
npm install

# Start the development environment
npm start
```

## 📱 Usage

### Development Mode
```bash
# Start all services
npm run dev

# Start individual services
npm run dev:backend    # Rust backend
npm run dev:frontend   # React frontend
npm run dev:proxy      # Gemma API proxy
```

### Production Build
```bash
# Build Rust backend
npm run build:rust

# Build frontend
npm run build

# Docker deployment
npm run docker:build
npm run docker:run
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Google Cloud API Key for Gemma
GOOGLE_CLOUD_API_KEY=your_api_key_here

# Blockchain Configuration
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tea_leaves
```

### Tea-Leaves Configuration
The platform configuration is located in `config/bartering_config.toml` and includes:

- Platform settings and versioning
- Blockchain network configurations
- AI integration parameters
- Asset tokenization rules
- Bartering engine settings

## 🧪 Testing

```bash
# Run Rust tests
npm run test:rust

# Run frontend tests
cd frontend && npm test

# Run integration tests
cargo test --features integration
```

## 📊 API Endpoints

### Tea-Leaves Platform
- `GET /health` - Health check
- `GET /api/tea-leaves/status` - Platform status

### Gemma AI Integration
- `POST /api/gemma` - AI strategy generation
- `GET /api/tea-leaves/factors` - Factor discovery
- `POST /api/tea-leaves/optimize` - Portfolio optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

Coming Soon :)

***Tea_Leaves* Platform v1.0.0** - *Tokenizing Every Asset*

