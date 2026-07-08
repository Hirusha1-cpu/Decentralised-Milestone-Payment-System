// ✅ Contract addresses per network
const CONTRACT_ADDRESSES = {
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat Localhost
  11155111: "0x8feA62EF84B02304985742A70148c4Af3aA6bf6f", // Sepolia
};

// ✅ Get address based on connected chainId (fallback: Sepolia)
export function getContractAddress(chainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[11155111];
}

// ✅ Network Configuration
export const NETWORK = {
  name: "Sepolia",
  chainId: 11155111,
  rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/ENttXZqLJR3blg79nQcJ0"
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
  0: "yellow",
  1: "blue",
  2: "green",
  3: "red",
  4: "purple",
  5: "gray"
};