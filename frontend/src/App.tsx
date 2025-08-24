import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WalletContextProvider } from './contexts/WalletContext';
import theme from './styles/theme';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import TokenFactory from './components/strategy/TokenFactory';
import TokenLeaderboard from './components/leaderboard/TokenLeaderboard';

import ProvideLiquidity from './components/strategy/ProvideLiquidity';
import WhatsInAName from './pages/WhatsInAName';
import TokenIncentivization from './components/incentives/TokenIncentivization';
// PYUSDSwap component removed

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div style={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/token-factory" element={<TokenFactory />} />
              <Route path="/leaderboard" element={<TokenLeaderboard />} />
      
              <Route path="/provide-liquidity" element={<ProvideLiquidity />} />
              <Route path="/token-incentivization" element={<TokenIncentivization />} />
              {/* PYUSD Swap route removed */}
              <Route path="/whats-in-a-name" element={<WhatsInAName />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </WalletContextProvider>
  );
};

export default App; 