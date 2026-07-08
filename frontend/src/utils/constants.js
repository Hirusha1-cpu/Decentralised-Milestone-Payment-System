// ✅ Sepolia Testnet (Replace with your deployed address)
export const CONTRACT_ADDRESS = "0x8feA62EF84B02304985742A70148c4Af3aA6bf6f";

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
  0: "yellow",    // Pending
  1: "blue",     // Completed
  2: "green",    // Released
  3: "red",      // Disputed
  4: "purple",   // Resolved
  5: "gray"      // Refunded
};