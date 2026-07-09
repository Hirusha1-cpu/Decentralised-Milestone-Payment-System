// frontend/src/App.js
import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { CreateEscrow } from './components/CreateEscrow';
import { EscrowList } from './components/EscrowList';
import './styles/App.css';

function App() {
  const {
    account,
    chainId, 
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia
  } = useWallet();

  const [activeTab, setActiveTab] = useState('create');

  // ✅ Force refresh function
  const handleRefresh = () => {
    window.location.reload();
  };

  // ✅ Copy account to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      alert('✅ Address copied!');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏦 Decentralized Escrow System</h1>
        <div className="wallet-info">
          {isConnected ? (
            <>
              <span className="address" onClick={copyAddress} style={{ cursor: 'pointer' }}>
                {account.slice(0, 6)}...{account.slice(-4)}
                <span style={{ fontSize: '10px', marginLeft: '5px' }}>📋</span>
              </span>
              {chainId !== 11155111 && (
                <button onClick={switchToSepolia} className="btn-warning">
                  ⚠️ Switch to Sepolia
                </button>
              )}
              <button onClick={handleRefresh} className="btn-refresh" title="Refresh wallet">
                🔄
              </button>
              <button onClick={disconnectWallet} className="btn-disconnect">
                Disconnect
              </button>
            </>
          ) : (
            <button 
              onClick={connectWallet} 
              disabled={isLoading}
              className="btn-connect"
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {!isConnected ? (
          <div className="connect-prompt">
            <p>Please connect your wallet to get started</p>
          </div>
        ) : (
          <>
            <div className="account-info">
              <p>👤 Connected: <strong>{account}</strong></p>
              <p>🌐 Network: {chainId === 11155111 ? '✅ Sepolia' : `⚠️ ${chainId}`}</p>
            </div>

            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                🆕 Create Escrow
              </button>
              <button 
                className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                📋 My Escrows
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'create' && <CreateEscrow />}
              {activeTab === 'list' && <EscrowList />}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Built with ❤️ on Sepolia Testnet</p>
        <p>
          Contract: <a href="https://sepolia.etherscan.io/address/0x8feA62EF84B02304985742A70148c4Af3aA6bf6f#code" target="_blank">
            0x8feA62EF...
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;