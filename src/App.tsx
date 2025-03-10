import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CharacterCreation from './components/CharacterCreation';
import GameScreen from './components/GameScreen';
import './styles/index.css';

// Création d'un thème sombre pour Material UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e63946',
    },
    secondary: {
      main: '#a8dadc',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: "'Noto Sans SC', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Cinzel', serif",
    },
    h2: {
      fontFamily: "'Cinzel', serif",
    },
    h3: {
      fontFamily: "'Cinzel', serif",
    },
    h4: {
      fontFamily: "'Cinzel', serif",
    },
    h5: {
      fontFamily: "'Cinzel', serif",
    },
    h6: {
      fontFamily: "'Cinzel', serif",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #333333',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333333',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #333333',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<CharacterCreation />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 