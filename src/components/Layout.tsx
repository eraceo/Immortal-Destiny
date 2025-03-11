import React, { useState, ReactNode } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Snackbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import MeditationIcon from '@mui/icons-material/SelfImprovement';
import InventoryIcon from '@mui/icons-material/Inventory';
import QuestIcon from '@mui/icons-material/EmojiEvents';
import StatsIcon from '@mui/icons-material/BarChart';
import SaveIcon from '@mui/icons-material/Save';
import ResetIcon from '@mui/icons-material/RestartAlt';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

// Définition des menus disponibles
export enum MenuType {
  PROFILE = 'profile',
  CULTIVATION = 'cultivation',
  INVENTORY = 'inventory',
  QUESTS = 'quests',
  STATS = 'stats',
  SECTE = 'secte',
  TECHNIQUES = 'techniques',
  SETTINGS = 'settings'
}

// Props pour le composant Layout
interface LayoutProps {
  children: ReactNode;
  activeMenu: MenuType;
  onMenuChange: (menu: MenuType) => void;
  onSave: () => void;
  onReset: () => void;
  title?: string;
}

// Largeur du drawer
const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeMenu, 
  onMenuChange, 
  onSave, 
  onReset, 
  title = 'Wuxia Idle' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  // Gestion de l'ouverture/fermeture du drawer sur mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fonction pour afficher un message dans le snackbar
  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Fonction pour sauvegarder
  const handleSave = () => {
    onSave();
    showMessage('Personnage sauvegardé avec succès !');
  };

  // Liste des menus
  const menuItems = [
    { type: MenuType.PROFILE, text: 'Profil', icon: <PersonIcon /> },
    { type: MenuType.CULTIVATION, text: 'Cultivation', icon: <MeditationIcon /> },
    { type: MenuType.INVENTORY, text: 'Inventaire', icon: <InventoryIcon /> },
    { type: MenuType.QUESTS, text: 'Quêtes', icon: <QuestIcon /> },
    { type: MenuType.STATS, text: 'Statistiques', icon: <StatsIcon /> },
    { type: MenuType.SECTE, text: 'Secte', icon: <GroupIcon /> },
    { type: MenuType.TECHNIQUES, text: 'Techniques', icon: <SchoolIcon /> },
    { type: MenuType.SETTINGS, text: 'Paramètres', icon: <SettingsIcon /> }
  ];

  // Contenu du drawer
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontFamily: "'Cinzel', serif" }}>
          <span className="text-primary">Wuxia</span> <span className="text-accent">Idle</span>
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.type} disablePadding>
            <ListItemButton 
              selected={activeMenu === item.type}
              onClick={() => {
                onMenuChange(item.type);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={onSave}
        >
          Sauvegarder
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer pour la navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu items"
      >
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Meilleure performance sur mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Drawer permanent pour desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px' // Hauteur de l'AppBar
        }}
      >
        {children}
      </Box>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Layout; 