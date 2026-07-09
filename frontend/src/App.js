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

  return (
    <div className="app">
      <header className="header">
        <h1>🏦 Decentralized Escrow System</h1>
        <div className="wallet-info">
          {isConnected ? (
            <>
              <span className="address">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              {chainId !== 11155111 && (
                <button onClick={switchToSepolia} className="btn-warning">
                  ⚠️ Switch to Sepolia
                </button>
              )}
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
          Contract: <a href="https://sepolia.etherscan.io/address/0x238D25C84b72A6D2D90918262165661ccEB9B268#code" target="_blank">
            0x238D25C84b72A6D2D90918262165661ccEB9B268
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;