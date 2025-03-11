import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CharacterCreation from './components/CharacterCreation';
import GameScreen from './components/GameScreen';
import './styles/index.css';
import { defaultSettings } from './components/menus/Settings';

// Création d'un thème sombre pour Material UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5252', // Rouge plus vif pour le mode sombre
      dark: '#c62828',
      light: '#ff7b7b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64b5f6', // Bleu plus clair pour le mode sombre
      dark: '#1976d2',
      light: '#90caf9',
      contrastText: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    divider: '#424242',
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffab40',
    },
    info: {
      main: '#64b5f6',
    },
    success: {
      main: '#69f0ae',
    },
  },
  typography: {
    fontFamily: "'Noto Sans SC', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Cinzel', serif",
      color: '#ffffff',
    },
    h2: {
      fontFamily: "'Cinzel', serif",
      color: '#ffffff',
    },
    h3: {
      fontFamily: "'Cinzel', serif",
      color: '#ffffff',
    },
    h4: {
      fontFamily: "'Cinzel', serif",
      color: '#ffffff',
    },
    h5: {
      fontFamily: "'Cinzel', serif",
      color: '#ffffff',
    },
    h6: {
      fontFamily: "'Cinzel', serif",
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
    },
    body2: {
      color: '#b0bec5',
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
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
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
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#616161',
          '&.Mui-checked': {
            color: '#ff5252',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#ff7b7b',
          },
        },
        track: {
          backgroundColor: '#757575',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          color: '#ff5252',
        },
        track: {
          color: '#ff7b7b',
        },
        rail: {
          color: '#424242',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          color: '#ffffff',
          border: '1px solid #424242',
        },
      },
    },
  },
});

// Création d'un thème clair pour Material UI
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d32f2f',
      dark: '#b71c1c',
      light: '#ef5350',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1976d2',
      dark: '#0d47a1',
      light: '#42a5f5',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#424242',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    divider: '#e0e0e0',
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#f57c00',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#388e3c',
    },
  },
  typography: {
    fontFamily: "'Noto Sans SC', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Cinzel', serif",
      color: '#212121',
    },
    h2: {
      fontFamily: "'Cinzel', serif",
      color: '#212121',
    },
    h3: {
      fontFamily: "'Cinzel', serif",
      color: '#212121',
    },
    h4: {
      fontFamily: "'Cinzel', serif",
      color: '#212121',
    },
    h5: {
      fontFamily: "'Cinzel', serif",
      color: '#212121',
    },
    h6: {
      fontFamily: "'Cinzel', serif",
      color: '#212121',
    },
    body1: {
      color: '#212121',
    },
    body2: {
      color: '#424242',
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
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          color: '#212121',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#9e9e9e',
          '&.Mui-checked': {
            color: '#d32f2f',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#ef5350',
          },
        },
        track: {
          backgroundColor: '#bdbdbd',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          color: '#d32f2f',
        },
        track: {
          color: '#ef5350',
        },
        rail: {
          color: '#e0e0e0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          color: '#212121',
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    // Récupérer les paramètres du localStorage
    const storedSettings = localStorage.getItem('gameSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setIsDarkMode(settings.darkMode);
    } else {
      // Utiliser les paramètres par défaut
      setIsDarkMode(defaultSettings.darkMode);
    }

    // Écouter les changements de paramètres
    const handleStorageChange = () => {
      const updatedSettings = localStorage.getItem('gameSettings');
      if (updatedSettings) {
        const settings = JSON.parse(updatedSettings);
        setIsDarkMode(settings.darkMode);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Créer un événement personnalisé pour les changements de thème
    window.addEventListener('themeChange', (e: any) => {
      if (e.detail && e.detail.darkMode !== undefined) {
        setIsDarkMode(e.detail.darkMode);
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleStorageChange as any);
    };
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
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