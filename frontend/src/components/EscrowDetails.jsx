import React, { useState, useEffect } from "react";
import { useEscrow } from "../hooks/useEscrow";
import { useWallet } from "../hooks/useWallet";
import { ESCROW_STATES, ESCROW_STATE_COLORS } from "../utils/constants";

export function EscrowDetails({ escrowId, onActionComplete }) {
  const { signer, chainId, provider } = useWallet();
  const {
    getEscrowDetails,
    completeMilestone,
    approveAndRelease,
    raiseDispute,
    resolveDispute,
    refund,
    isLoading,
  } = useEscrow(signer, chainId);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [winnerAddress, setWinnerAddress] = useState("");

  // Load escrow details
  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEscrowDetails(escrowId, provider);
      if (data) {
        setDetails(data);
      } else {
        setError("Failed to load escrow details");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (escrowId && provider) {
      loadDetails();
    }
  }, [escrowId, provider]);

  // Handle actions
  const handleCompleteMilestone = async () => {
    setActionResult(null);
    const result = await completeMilestone(escrowId);
    if (result.success) {
      setActionResult({ success: true, message: "✅ Milestone completed!" });
      await loadDetails();
      if (onActionComplete) onActionComplete();
    } else {
      setActionResult({ success: false, message: `❌ Error: ${result.error}` });
    }
  };

  const handleApproveAndRelease = async () => {
    setActionResult(null);
    const result = await approveAndRelease(escrowId);
    if (result.success) {
      setActionResult({ success: true, message: "✅ Funds released!" });
      await loadDetails();
      if (onActionComplete) onActionComplete();
    } else {
      setActionResult({ success: false, message: `❌ Error: ${result.error}` });
    }
  };

  const handleRaiseDispute = async () => {
    setActionResult(null);
    const result = await raiseDispute(escrowId);
    if (result.success) {
      setActionResult({ success: true, message: "⚖️ Dispute raised!" });
      await loadDetails();
      if (onActionComplete) onActionComplete();
    } else {
      setActionResult({ success: false, message: `❌ Error: ${result.error}` });
    }
  };

  const handleResolveDispute = async () => {
    if (!winnerAddress) {
      setActionResult({
        success: false,
        message: "❌ Please enter winner address",
      });
      return;
    }
    setActionResult(null);
    const result = await resolveDispute(escrowId, winnerAddress);
    if (result.success) {
      setActionResult({ success: true, message: "✅ Dispute resolved!" });
      await loadDetails();
      if (onActionComplete) onActionComplete();
      setWinnerAddress("");
    } else {
      setActionResult({ success: false, message: `❌ Error: ${result.error}` });
    }
  };

  const handleRefund = async () => {
    setActionResult(null);
    const result = await refund(escrowId);
    if (result.success) {
      setActionResult({ success: true, message: "✅ Refunded!" });
      await loadDetails();
      if (onActionComplete) onActionComplete();
    } else {
      setActionResult({ success: false, message: `❌ Error: ${result.error}` });
    }
  };

  if (loading)
    return <div className="loading">Loading escrow #{escrowId}...</div>;
  if (error) return <div className="alert alert-error">Error: {error}</div>;
  if (!details)
    return (
      <div className="alert alert-error">Escrow #{escrowId} not found</div>
    );

  const stateName = details.state || "Unknown";
  const stateColor = ESCROW_STATE_COLORS[details.stateId] || "gray";

  return (
    <div className="escrow-details">
      <h3>📋 Escrow #{escrowId}</h3>

      {actionResult && (
        <div
          className={`alert alert-${
            actionResult.success ? "success" : "error"
          }`}
        >
          {actionResult.message}
        </div>
      )}

      <div className="details-grid">
        <div className="detail-item">
          <label>Client</label>
          <span className="address">{details.client}</span>
        </div>
        <div className="detail-item">
          <label>Freelancer</label>
          <span className="address">{details.freelancer}</span>
        </div>
        <div className="detail-item">
          <label>Arbitrator</label>
          <span className="address">{details.arbitrator}</span>
        </div>
        <div className="detail-item">
          <label>Amount</label>
          <span>{details.amount} ETH</span>
        </div>
        <div className="detail-item">
          <label>Deadline</label>
          <span>{details.deadline}</span>
        </div>
        <div className="detail-item">
          <label>Created</label>
          <span>{details.createdAt}</span>
        </div>
        <div className="detail-item">
          <label>Status</label>
          <span className={`status-badge ${stateColor}`}>{stateName}</span>
        </div>
        <div className="detail-item">
          <label>Milestone</label>
          <span>
            {details.milestoneCompleted ? "✅ Completed" : "⏳ Pending"}
          </span>
        </div>
      </div>

      <div className="action-buttons">
        {/* 1. Complete Milestone - Only freelancer */}
        {details.stateId === 0 && (
          <button
            onClick={handleCompleteMilestone}
            disabled={isLoading}
            className="btn-action btn-complete"
          >
            {isLoading ? "Processing..." : "✅ Complete Milestone"}
          </button>
        )}

        {/* 2. Approve & Release - Only client */}
        {details.stateId === 1 && details.milestoneCompleted && (
          <button
            onClick={handleApproveAndRelease}
            disabled={isLoading}
            className="btn-action btn-release"
          >
            {isLoading ? "Processing..." : "💰 Approve & Release"}
          </button>
        )}

        {/* 3. Raise Dispute - Client or Freelancer */}
        {details.stateId === 1 && (
          <button
            onClick={handleRaiseDispute}
            disabled={isLoading}
            className="btn-action btn-dispute"
          >
            {isLoading ? "Processing..." : "⚖️ Raise Dispute"}
          </button>
        )}

        {/* 4. Resolve Dispute - Only Arbitrator */}
        {details.stateId === 3 && (
          <div className="resolve-section">
            <input
              type="text"
              placeholder="Winner address (0x...)"
              value={winnerAddress}
              onChange={(e) => setWinnerAddress(e.target.value)}
              className="winner-input"
            />
            <button
              onClick={handleResolveDispute}
              disabled={isLoading || !winnerAddress}
              className="btn-action btn-resolve"
            >
              {isLoading ? "Processing..." : "⚖️ Resolve Dispute"}
            </button>
          </div>
        )}

        {/* 5. Refund - Only client when pending and deadline passed */}
        {details.stateId === 0 && (
          <button
            onClick={handleRefund}
            disabled={isLoading}
            className="btn-action btn-refund"
          >
            {isLoading ? "Processing..." : "↩️ Refund"}
          </button>
        )}
      </div>
    </div>
  );
}
