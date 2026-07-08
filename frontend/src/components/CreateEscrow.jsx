import React, { useState } from "react";
import { useEscrow } from "../hooks/useEscrow";
import { useWallet } from "../hooks/useWallet";

export function CreateEscrow() {
  const { signer, chainId } = useWallet();
  const { createEscrow, isLoading, error, transactionHash } = useEscrow(
    signer,
    chainId,
  );
  const [freelancer, setFreelancer] = useState("");
  const [arbitrator, setArbitrator] = useState("");
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("7");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    // Calculate deadline
    const deadline =
      Math.floor(Date.now() / 1000) + Number(days) * 24 * 60 * 60;

    const response = await createEscrow(
      freelancer,
      arbitrator,
      deadline,
      amount,
    );

    if (response.success) {
      setResult({
        success: true,
        message: `✅ Escrow #${response.escrowId} created!`,
        tx: response.transactionHash,
      });
      // Clear form
      setFreelancer("");
      setAmount("");
    } else {
      setResult({
        success: false,
        message: `❌ Error: ${response.error}`,
      });
    }
  };

  return (
    <div className="create-escrow">
      <h2>Create Escrow</h2>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className={`alert alert-${result.success ? "success" : "error"}`}>
          {result.message}
          {result.tx && (
            <div>
              <small>
                Tx:{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${result.tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                </a>
              </small>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Freelancer Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={freelancer}
            onChange={(e) => setFreelancer(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Arbitrator Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={arbitrator}
            onChange={(e) => setArbitrator(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (ETH)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Deadline (Days)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Escrow"}
        </button>
      </form>
    </div>
  );
}
