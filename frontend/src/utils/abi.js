
// ✅ Contract Address (Replace with your deployed address)
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ✅ Contract ABI (Copy from artifacts/)
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "name": "freelancer", "type": "address" },
      { "name": "arbitrator", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "name": "createEscrow",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "name": "completeMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "name": "approveAndRelease",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "name": "raiseDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "escrowId", "type": "uint256" },
      { "name": "winner", "type": "address" }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "name": "getEscrowDetails",
    "outputs": [
      {
        "components": [
          { "name": "client", "type": "address" },
          { "name": "freelancer", "type": "address" },
          { "name": "arbitrator", "type": "address" },
          { "name": "amount", "type": "uint256" },
          { "name": "deadline", "type": "uint256" },
          { "name": "currentState", "type": "uint8" },
          { "name": "createdAt", "type": "uint256" },
          { "name": "milestoneCompleted", "type": "bool" }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "name": "getState",
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "escrowCounter",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ✅ Network Configuration
export const NETWORK = {
  name: "Sepolia",
  chainId: 11155111,
  rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/vuJGQcxHxSBJCvGslV2Ps"
};

// ✅ Transaction Status
export const TRANSACTION_STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed"
};

// ✅ Escrow States (Matches Solidity enum)
export const ESCROW_STATES = {
  0: "Pending",
  1: "Completed", 
  2: "Released",
  3: "Disputed",
  4: "Resolved",
  5: "Refunded"
};

export const ESCROW_STATE_COLORS = {
  0: "yellow",    // Pending
  1: "blue",     // Completed
  2: "green",    // Released
  3: "red",      // Disputed
  4: "purple",   // Resolved
  5: "gray"      // Refunded
};