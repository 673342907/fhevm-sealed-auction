# 🗳️ Privacy-Preserving Voting Platform

> A decentralized governance voting platform built on FHEVM (Fully Homomorphic Encryption Virtual Machine) that enables encrypted voting while maintaining complete privacy until results are revealed.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-lightgrey.svg)](https://soliditylang.org/)

## ✨ Features

### 🔐 Core Features
- **Encrypted Voting**: All votes are encrypted on-chain using FHEVM, ensuring complete privacy during the voting period
- **Weighted Voting**: Support for token-based weighted voting, giving more influence to larger stakeholders
- **Decentralized Governance**: Full DAO governance capabilities with proposal creation, voting, and result finalization
- **Real-time Statistics**: View encrypted vote counts and statistics in real-time without revealing individual votes
- **Automatic Result Disclosure**: Results are automatically decrypted and revealed after voting ends

### 🎨 User Experience
- **Bilingual Interface**: Full support for Chinese (中文) and English
- **One-Click Operations**: Simplified proposal creation and voting process
- **Template System**: Pre-built proposal templates for quick setup
- **Responsive Design**: Modern, clean UI with Zama brand colors (yellow, black, white)
- **Onboarding Guide**: Step-by-step guide for new users

### 🛠️ Technical Highlights
- **FHEVM Integration**: Leverages Zama's FHEVM for homomorphic encryption operations
- **EIP-712 Signatures**: Secure signature-based decryption with caching to minimize wallet prompts
- **Batch Operations**: Optimized batch decryption for efficient gas usage
- **Event-Driven Architecture**: Real-time updates based on blockchain events
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🏗️ Architecture

```
fhevm-sealed-auction/
├── packages/
│   ├── contracts/          # Smart contracts (Solidity + Hardhat)
│   │   ├── contracts/
│   │   │   └── PrivacyVoting.sol
│   │   ├── scripts/
│   │   │   ├── deployVoting.js
│   │   │   └── createDemoProposals.js
│   │   └── test/
│   │       └── Voting.test.js
│   └── frontend/           # Next.js frontend application
│       ├── src/
│       │   ├── app/        # Next.js app router
│       │   ├── components/ # React components
│       │   ├── contexts/   # React contexts (Language)
│       │   ├── hooks/      # Custom React hooks
│       │   ├── locales/    # i18n translations
│       │   └── utils/      # Utility functions
│       └── public/
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask wallet extension
- Sepolia testnet ETH (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fhevm-sealed-auction.git
cd fhevm-sealed-auction

# Install dependencies
npm install

# Install contract dependencies
cd packages/contracts && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Development

```bash
# Start frontend development server
npm run dev

# Compile contracts
npm run compile

# Run tests
npm run test
```

### Deployment

```bash
# Deploy to Sepolia testnet
cd packages/contracts
npm run deploy:sepolia

# Create demo proposals (optional)
npm run create-proposals
```

## 📖 Usage

### 1. Connect Wallet
Click the "Connect Wallet" button in the top right corner and approve the connection in MetaMask.

### 2. Set Contract Address
- Use the preset Sepolia testnet address, or
- Enter a custom deployed contract address

### 3. Create Proposal
- Click "+ Create Proposal"
- Fill in the proposal title and description
- Select voting duration (1 hour, 1 day, or 1 week)
- Optionally enable weighted voting
- Click "Create Proposal"

### 4. Vote
- Select "✅ Support" or "❌ Against"
- Your vote will be encrypted and submitted to the blockchain
- Vote remains private until the voting period ends

### 5. View Results
- After voting ends, click "View Results (Signature Required)"
- Results are automatically decrypted and displayed
- View vote counts, percentages, and visualizations

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Web3**: ethers.js v6
- **i18n**: Custom language context

### Smart Contracts
- **Language**: Solidity ^0.8.0
- **Framework**: Hardhat
- **Testing**: Chai + Mocha
- **Network**: Sepolia Testnet

### Encryption
- **FHEVM**: @fhenixprotocol/fhevmjs
- **Encryption**: Homomorphic encryption for vote privacy
- **Decryption**: EIP-712 signature-based re-encryption

## 📊 Smart Contract Functions

### Proposal Management
- `createProposal()` - Create a new governance proposal
- `endProposal()` - End a proposal after voting period
- `endProposalEarly()` - Allow creator to end proposal early
- `finalizeProposal()` - Finalize and reveal results

### Voting
- `submitVote()` - Submit an encrypted vote
- `hasVoted()` - Check if an address has voted
- `getVotesBatch()` - Batch retrieve votes for efficiency

### Data Retrieval
- `getProposal()` - Get proposal details
- `proposalCounter()` - Get total number of proposals
- `getVoteOption()` - Get vote option statistics

## 🌐 Internationalization

The platform supports multiple languages:
- 🇨🇳 Chinese (中文) - Default
- 🇺🇸 English

Language preference is saved in localStorage and persists across sessions.

## 🎨 Design

The UI follows Zama's brand guidelines:
- **Primary Color**: Yellow (#f59e0b)
- **Background**: Black (#000000)
- **Text**: White with high contrast
- **Theme**: Dark mode optimized

## 🔒 Security Features

- **Encrypted Storage**: All votes encrypted on-chain
- **Signature Caching**: Reduces wallet prompts while maintaining security
- **Access Control**: Only proposal creators can end proposals early
- **Emergency Pause**: Contract includes emergency pause functionality
- **Input Validation**: Comprehensive validation on both frontend and contract

## 📝 Project Structure

```
packages/
├── contracts/
│   ├── contracts/PrivacyVoting.sol    # Main voting contract
│   ├── scripts/                       # Deployment scripts
│   └── test/                          # Contract tests
└── frontend/
    ├── src/
    │   ├── app/                       # Next.js pages
    │   ├── components/                # React components
    │   │   ├── VotingPlatform.tsx    # Main voting component
    │   │   ├── WalletConnect.tsx     # Wallet connection
    │   │   ├── ContractAddressSelector.tsx
    │   │   └── LanguageSwitcher.tsx
    │   ├── contexts/                 # React contexts
    │   ├── hooks/                    # Custom hooks
    │   ├── locales/                  # Translations
    │   └── utils/                    # Utilities
    │       ├── fhevm.ts              # FHEVM integration
    │       ├── votingContract.ts     # Contract utilities
    │       └── walletUtils.ts       # Wallet utilities
    └── public/                       # Static assets
```

## 🧪 Testing

```bash
# Run contract tests
cd packages/contracts
npm run test

# Run with coverage
npx hardhat coverage
```

## 📦 Deployment

### Deploy to Sepolia

1. Set up environment variables:
```bash
cp .env.example .env
# Add your PRIVATE_KEY and SEPOLIA_RPC_URL
```

2. Deploy the contract:
```bash
cd packages/contracts
npm run deploy:sepolia
```

3. Update the contract address in the frontend:
   - Update `packages/frontend/src/app/page.tsx` with the deployed address, or
   - Use the contract address selector in the UI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Zama](https://www.zama.ai/) for FHEVM technology
- [Fhenix](https://fhenix.io/) for the FHEVM SDK
- [Hardhat](https://hardhat.org/) for the development environment
- [Next.js](https://nextjs.org/) for the frontend framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🔗 Links

- **Live Demo**: [Add your demo URL here]
- **Contract Address (Sepolia)**: `0x532d2B3325BA52e7F9FE7De61830A2F120d1082b`
- **Documentation**: See `/docs` folder for detailed documentation

---

⭐ If you find this project useful, please consider giving it a star!
