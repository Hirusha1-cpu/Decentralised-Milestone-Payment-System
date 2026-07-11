# 🏦 Decentralized Milestone Payment System

> A decentralized escrow platform for secure milestone-based freelance payments with built-in dispute resolution on the Ethereum Sepolia Testnet.

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.26-yellow)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Ethereum](https://img.shields.io/badge/Network-Sepolia-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Live Demo

🌐 **Live Application**

👉 **[Decentralised Milestone Payment System](https://decentralised-milestone-payment-system-m3c9qugid.vercel.app/)**

---

## 📖 Overview

The **Decentralized Milestone Payment System** is a blockchain-powered escrow application that enables secure milestone-based payments between clients and freelancers.

Unlike traditional freelance platforms, payments remain locked inside a smart contract until predefined conditions are met, eliminating the need for a trusted third party.

The platform supports:

- Secure escrow creation
- Milestone tracking
- Automated payment release
- Dispute resolution
- Deadline-based refunds
- Wallet integration using MetaMask

---

## ✨ Features

- ✅ Create escrow agreements
- ✅ Lock ETH securely in smart contracts
- ✅ Freelancer milestone completion
- ✅ Client approval & payment release
- ✅ Built-in dispute resolution
- ✅ Automatic refunds after deadline
- ✅ MetaMask wallet connection
- ✅ Responsive React UI
- ✅ Real-time blockchain transactions

---

## 🏗 Architecture

```
Client
      │
      ▼
React Frontend
      │
MetaMask Wallet
      │
      ▼
Ethereum Sepolia Network
      │
      ▼
Escrow Smart Contract
      │
 ┌───────────────┐
 │ Escrow Funds  │
 └───────────────┘
```

---

## ⚙️ Tech Stack

### Smart Contracts

- Solidity 0.8.20
- Hardhat
- OpenZeppelin

### Frontend

- React
- Ethers.js
- JavaScript
- CSS

### Blockchain

- Ethereum Sepolia Testnet
- MetaMask
- Alchemy RPC

### Deployment

- Vercel
- Etherscan

---

## 📜 Smart Contract

### Network

Ethereum Sepolia

### Contract Address

```
0x8feA62EF84B02304985742A70148c4Af3aA6bf6f
```

### View on Etherscan

https://sepolia.etherscan.io/address/0x8feA62EF84B02304985742A70148c4Af3aA6bf6f#code

---

## 🔄 Workflow

1. Client creates an escrow.
2. Funds are deposited into the smart contract.
3. Freelancer completes the milestone.
4. Client approves the work.
5. Smart contract automatically releases payment.

If a disagreement occurs:

- Client or freelancer raises a dispute.
- Arbitrator resolves the dispute.
- Funds are transferred to the winning party.

---

## 📂 Project Structure

```
Decentralised-Milestone-Payment-System
│
├── contracts/
├── scripts/
├── test/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── hardhat.config.ts
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Hirusha1-cpu/Decentralised-Milestone-Payment-System.git
```

Move into the project

```bash
cd Decentralised-Milestone-Payment-System
```

Install dependencies

```bash
npm install
```

Compile contracts

```bash
npx hardhat compile
```

Run tests

```bash
npx hardhat test
```

Start local blockchain

```bash
npx hardhat node
```

Run frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔒 Security

- ReentrancyGuard protection
- Access Control
- State Machine validation
- Input validation
- Deadline-based refunds
- Event logging

---

## 🧪 Testing

Run all tests

```bash
npx hardhat test
```

Coverage

```bash
npx hardhat coverage
```

---


## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Hirusha Fernando**

GitHub:
https://github.com/Hirusha1-cpu

Project Repository:
https://github.com/Hirusha1-cpu/Decentralised-Milestone-Payment-System

Live Demo:
https://decentralised-milestone-payment-system-m3c9qugid.vercel.app/

---

⭐ If you found this project useful, consider giving it a star on GitHub!