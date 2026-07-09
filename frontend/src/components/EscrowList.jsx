import React, { useState, useEffect } from 'react';
import { useEscrow } from '../hooks/useEscrow';
import { useWallet } from '../hooks/useWallet';
import { EscrowDetails } from './EscrowDetails';
import { ESCROW_STATES } from '../utils/constants';

export function EscrowList() {
  const { signer, chainId, provider, account } = useWallet();
  const { getEscrowCounter, getEscrowDetails } = useEscrow(signer, chainId);
  
  const [escrowIds, setEscrowIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEscrows = async () => {
    setLoading(true);
    setError(null);
    try {
      const counter = await getEscrowCounter(provider);
      const ids = [];
      for (let i = 1; i <= counter; i++) {
        const details = await getEscrowDetails(i, provider);
        if (details && (details.client === account || details.freelancer === account || details.arbitrator === account)) {
          ids.push(i);
        }
      }
      setEscrowIds(ids);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (provider && account) {
      loadEscrows();
    }
  }, [provider, account]);

  if (loading) return <div className="loading">Loading your escrows...</div>;
  if (error) return <div className="alert alert-error">Error: {error}</div>;

  return (
    <div className="escrow-list">
      <h2>📋 My Escrows</h2>
      
      {escrowIds.length === 0 ? (
        <p className="no-escrows">No escrows found. Create one!</p>
      ) : (
        <div className="escrow-items">
          {escrowIds.map(id => (
            <div key={id} className="escrow-item">
              <button 
                onClick={() => setSelectedId(selectedId === id ? null : id)}
                className="escrow-toggle"
              >
                📄 Escrow #{id} {selectedId === id ? '▲' : '▼'}
              </button>
              {selectedId === id && (
                <EscrowDetails 
                  escrowId={id} 
                  onActionComplete={loadEscrows}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}