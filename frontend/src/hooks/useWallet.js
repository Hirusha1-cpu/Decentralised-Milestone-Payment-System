import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }, []);
  // check if the wallet is already connected on component mount
  const connectWallet = useCallback(async () => {
     if (!isMetaMaskInstalled()) {
      setError('Please install MetaMask!');
      return;
    }
    setIsLoading(true);
    setError(null);
     try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Save to localStorage
      localStorage.setItem('walletConnected', 'true');
      
      console.log('✅ Wallet connected:', address);
    } catch (error) {
      console.error('❌ Connection error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isMetaMaskInstalled]);

    // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setChainId(null);
    localStorage.removeItem('walletConnected');
    console.log('👋 Wallet disconnected');
  }, []);

  // Check if connected on load
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled() && localStorage.getItem('walletConnected') === 'true') {
        await connectWallet();
      }
    };
    checkConnection();
  }, [isMetaMaskInstalled, connectWallet]);

  // Listen to account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        window.location.reload();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };
    // listen for account and chain changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
        // opposite of remove listeners when component unmounts
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, disconnectWallet, isMetaMaskInstalled]);

  // Switch to Sepolia network
  const switchToSepolia = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;
    // Check if already on Sepolia
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
    } catch (error) {
      // If network not added, add it
      if (error.code === 4902) {
        try {
            // Add Sepolia network to MetaMask
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          setError('Failed to add Sepolia network');
        }
      }
    }
  }, [isMetaMaskInstalled]);

  return {
    account,
    chainId,
    provider,
    signer,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    isMetaMaskInstalled
  };

  

}