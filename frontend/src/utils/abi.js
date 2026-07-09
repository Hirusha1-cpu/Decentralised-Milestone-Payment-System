// ✅ Contract Address (Replace with your deployed address)
// export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ✅ Contract ABI (Copy from artifacts/contracts/Escrow.sol/Escrow.json)
export const CONTRACT_ABI = [
  { "inputs": [], "name": "DeadlineNotPassed", "type": "error" },
  { "inputs": [], "name": "InsufficientFunds", "type": "error" },
  { "inputs": [], "name": "InvalidAddress", "type": "error" },
  { "inputs": [], "name": "InvalidDeadline", "type": "error" },
  { "inputs": [], "name": "InvalidState", "type": "error" },
  { "inputs": [], "name": "InvalidWinner", "type": "error" },
  { "inputs": [], "name": "MilestoneNotComplete", "type": "error" },
  { "inputs": [], "name": "NotArbitrator", "type": "error" },
  { "inputs": [], "name": "NotClient", "type": "error" },
  { "inputs": [], "name": "NotClientOrFreelancer", "type": "error" },
  { "inputs": [], "name": "NotFreelancer", "type": "error" },
  { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" },
  { "inputs": [], "name": "TransferFailed", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "raiser", "type": "address" }
    ],
    "name": "DisputeRaised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "DisputeResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "freelancer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "EscrowCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "FundsReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "freelancer", "type": "address" }
    ],
    "name": "MilestoneCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Refunded",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "escrowId", "type": "uint256" }],
    "name": "approveAndRelease",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "escrowId", "type": "uint256" }],
    "name": "completeMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "freelancer", "type": "address" },
      { "internalType": "address", "name": "arbitrator", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "createEscrow",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "escrowCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "escrows",
    "outputs": [
      { "internalType": "address", "name": "client", "type": "address" },
      { "internalType": "address", "name": "freelancer", "type": "address" },
      { "internalType": "address", "name": "arbitrator", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "enum EscrowLibrary.State", "name": "currentState", "type": "uint8" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
      { "internalType": "bool", "name": "milestoneCompleted", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEscrowCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "escrowId", "type": "uint256" }],
    "name": "getEscrowDetails",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "client", "type": "address" },
          { "internalType": "address", "name": "freelancer", "type": "address" },
          { "internalType": "address", "name": "arbitrator", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "enum EscrowLibrary.State", "name": "currentState", "type": "uint8" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "bool", "name": "milestoneCompleted", "type": "bool" }
        ],
        "internalType": "struct EscrowLibrary.EscrowData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "escrowId", "type": "uint256" }],
    "name": "getState",
    "outputs": [{ "internalType": "enum EscrowLibrary.State", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "escrowId", "type": "uint256" }],
    "name": "raiseDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "escrowId", "type": "uint256" }],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "escrowId", "type": "uint256" },
      { "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
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