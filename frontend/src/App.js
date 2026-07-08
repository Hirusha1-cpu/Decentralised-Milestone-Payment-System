// src/App.jsx
import React from 'react';
import { useWallet } from './hooks/useWallet';
import { CreateEscrow } from './components/CreateEscrow';
import './styles/App.css';

function App() {
  const {
    account,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia
  } = useWallet();

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
          <div className="content">
            <CreateEscrow />
          </div>
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