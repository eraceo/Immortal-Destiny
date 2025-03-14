import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  FormControl,
  FormControlLabel,
  Switch,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Grid,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

// Interface pour les paramètres du jeu
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  language: string;
  notificationsEnabled: boolean;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  darkMode: boolean;
  textSize: number;
}

// Props pour le composant Settings
interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (newSettings: GameSettings) => void;
  onReset: () => void;
}

// Valeurs par défaut des paramètres
export const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 70,
  musicVolume: 50,
  language: 'fr',
  notificationsEnabled: true,
  autoSaveEnabled: true,
  autoSaveInterval: 5,
  darkMode: true,
  textSize: 16
};

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onReset }) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [patchNotesOpen, setPatchNotesOpen] = useState(false);

  // Fonction pour mettre à jour un paramètre
  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    // Émettre un événement personnalisé si le mode sombre change
    if (key === 'darkMode') {
      const themeChangeEvent = new CustomEvent('themeChange', {
        detail: { darkMode: value }
      });
      window.dispatchEvent(themeChangeEvent);
    }
  };

  // Fonction pour réinitialiser les paramètres
  const handleReset = () => {
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    onReset();
    setSnackbarMessage('Paramètres réinitialisés avec succès !');
    setSnackbarOpen(true);
    
    // Émettre un événement personnalisé pour le changement de thème
    const themeChangeEvent = new CustomEvent('themeChange', {
      detail: { darkMode: defaultSettings.darkMode }
    });
    window.dispatchEvent(themeChangeEvent);
  };

  // Fonction pour ouvrir la boîte de dialogue de réinitialisation de sauvegarde
  const handleOpenResetSaveDialog = () => {
    setOpenResetDialog(true);
  };

  // Fonction pour confirmer la réinitialisation de sauvegarde
  const confirmerReinitialisation = () => {
    localStorage.removeItem('wuxiaWorldSauvegarde');
    setOpenResetDialog(false);
    setSnackbarMessage('Sauvegarde réinitialisée avec succès ! La page va se recharger...');
    setSnackbarOpen(true);
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  // Fonction pour ouvrir la boîte de dialogue des patch notes
  const handleOpenPatchNotes = () => {
    setPatchNotesOpen(true);
  };

  // Fonction pour fermer la boîte de dialogue des patch notes
  const handleClosePatchNotes = () => {
    setPatchNotesOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Paramètres
      </Typography>

      <Paper sx={{ p: 3, mb: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff' }}>
          Audio
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Effets sonores"
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff',
                  fontWeight: 500
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom sx={{ color: (theme) => theme.palette.mode === 'light' ? '#424242' : '#b0bec5', fontWeight: 500 }}>
              Volume des effets sonores
            </Typography>
            <Slider
              value={localSettings.soundVolume}
              onChange={(_, value) => updateSetting('soundVolume', value as number)}
              disabled={!localSettings.soundEnabled}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.musicEnabled}
                  onChange={(e) => updateSetting('musicEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Musique"
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff',
                  fontWeight: 500
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom sx={{ color: (theme) => theme.palette.mode === 'light' ? '#424242' : '#b0bec5', fontWeight: 500 }}>
              Volume de la musique
            </Typography>
            <Slider
              value={localSettings.musicVolume}
              onChange={(_, value) => updateSetting('musicVolume', value as number)}
              disabled={!localSettings.musicEnabled}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff' }}>
          Interface
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="language-select-label" sx={{ color: (theme) => theme.palette.mode === 'light' ? '#424242' : '#b0bec5' }}>
                Langue
              </InputLabel>
              <Select
                labelId="language-select-label"
                value={localSettings.language}
                label="Langue"
                onChange={(e) => updateSetting('language', e.target.value)}
                sx={{ 
                  '& .MuiSelect-select': { 
                    color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff',
                  }
                }}
              >
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="zh">中文</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.darkMode}
                  onChange={(e) => updateSetting('darkMode', e.target.checked)}
                  color="primary"
                />
              }
              label="Mode sombre"
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff',
                  fontWeight: 500
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom sx={{ color: (theme) => theme.palette.mode === 'light' ? '#424242' : '#b0bec5', fontWeight: 500 }}>
              Taille du texte
            </Typography>
            <Slider
              value={localSettings.textSize}
              onChange={(_, value) => updateSetting('textSize', value as number)}
              valueLabelDisplay="auto"
              min={12}
              max={24}
              marks={[
                { value: 12, label: '12px' },
                { value: 16, label: '16px' },
                { value: 20, label: '20px' },
                { value: 24, label: '24px' },
              ]}
              sx={{
                '& .MuiSlider-markLabel': {
                  color: (theme) => theme.palette.mode === 'light' ? '#616161' : '#b0bec5',
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sauvegarde
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.autoSaveEnabled}
                  onChange={(e) => updateSetting('autoSaveEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Sauvegarde automatique"
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff',
                  fontWeight: 500
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom sx={{ color: (theme) => theme.palette.mode === 'light' ? '#424242' : '#b0bec5', fontWeight: 500 }}>
              Intervalle de sauvegarde (minutes)
            </Typography>
            <Slider
              value={localSettings.autoSaveInterval}
              onChange={(_, value) => updateSetting('autoSaveInterval', value as number)}
              disabled={!localSettings.autoSaveEnabled}
              valueLabelDisplay="auto"
              min={1}
              max={30}
              marks={[
                { value: 1, label: '1' },
                { value: 5, label: '5' },
                { value: 15, label: '15' },
                { value: 30, label: '30' },
              ]}
              sx={{
                '& .MuiSlider-markLabel': {
                  color: (theme) => theme.palette.mode === 'light' ? '#616161' : '#b0bec5',
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.notificationsEnabled}
                  onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Notifications"
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff',
                  fontWeight: 500
                } 
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleOpenResetSaveDialog}
              sx={{ 
                mt: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(211, 47, 47, 0.04)' : 'rgba(255, 82, 82, 0.08)'
                }
              }}
            >
              Réinitialiser la sauvegarde
            </Button>
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ 
                mt: 1, 
                color: (theme) => theme.palette.mode === 'light' ? 'rgba(211, 47, 47, 0.8)' : 'rgba(255, 82, 82, 0.8)',
                fontWeight: 500
              }}
            >
              Attention : Cette action supprimera définitivement votre personnage et toutes vos données de jeu.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#ffffff' }}>
          Patch Note
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleOpenPatchNotes}
              sx={{ 
                mt: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(33, 150, 243, 0.08)'
                }
              }}
            >
              Voir les notes de mise à jour
            </Button>
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ 
                mt: 1, 
                color: (theme) => theme.palette.mode === 'light' ? '#616161' : '#b0bec5',
                fontWeight: 500
              }}
            >
              Consultez les dernières mises à jour et améliorations du jeu.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleReset}
          sx={{
            fontWeight: 'bold',
            boxShadow: (theme) => theme.palette.mode === 'light' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              boxShadow: (theme) => theme.palette.mode === 'light' ? '0 4px 8px rgba(0, 0, 0, 0.15)' : '0 4px 8px rgba(0, 0, 0, 0.4)'
            }
          }}
        >
          Réinitialiser les paramètres
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Boîte de dialogue de confirmation pour la réinitialisation de sauvegarde */}
      <Dialog
        open={openResetDialog}
        onClose={() => setOpenResetDialog(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.palette.mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.4)'
          }
        }}
      >
        <DialogTitle id="reset-dialog-title" sx={{ 
          color: (theme) => theme.palette.mode === 'light' ? '#d32f2f' : '#ff5252',
          fontWeight: 'bold'
        }}>
          Confirmer la réinitialisation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description" sx={{ 
            color: (theme) => theme.palette.mode === 'light' ? '#424242' : '#b0bec5'
          }}>
            Êtes-vous sûr de vouloir réinitialiser votre sauvegarde ? Cette action est irréversible et supprimera définitivement votre personnage et toutes vos données de jeu.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenResetDialog(false)} 
            color="primary"
            variant="outlined"
            sx={{ 
              fontWeight: 'bold',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmerReinitialisation} 
            color="error" 
            variant="contained"
            sx={{ 
              fontWeight: 'bold',
              boxShadow: (theme) => theme.palette.mode === 'light' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                boxShadow: (theme) => theme.palette.mode === 'light' ? '0 4px 8px rgba(0, 0, 0, 0.15)' : '0 4px 8px rgba(0, 0, 0, 0.4)'
              }
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue des patch notes */}
      <Dialog
        open={patchNotesOpen}
        onClose={handleClosePatchNotes}
        aria-labelledby="patch-notes-dialog-title"
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.palette.mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.4)'
          }
        }}
      >
        <DialogTitle id="patch-notes-dialog-title" sx={{ 
          fontWeight: 'bold',
          bgcolor: (theme) => theme.palette.primary.main,
          color: 'white'
        }}>
          Notes de mise à jour
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
              Version 1.1.0 (Actuelle)
            </Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              Date: 15 Mars 2025
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Nouvelle fonctionnalité:</strong> Affichage des conditions de passage de rang dans l'interface de combat de secte.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Interface:</strong> Ajout d'un panneau détaillé montrant les prérequis exacts pour défier le rang supérieur (royaume de cultivation requis et points de contribution nécessaires).
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Amélioration visuelle:</strong> Indicateurs visuels (✅/❌) pour montrer clairement quelles conditions sont déjà remplies.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Expérience utilisateur:</strong> Meilleure transparence sur la progression dans la secte, permettant aux joueurs de planifier leur stratégie de cultivation.
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
              Version 1.0.2
            </Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              Date: 14 Mars 2025
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Amélioration majeure:</strong> Ajout d'une limite au système de cultivation - il n'est plus possible de méditer lorsque le niveau maximum est atteint (Royaume du Divin Suprême - Niveau Avancé).
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Interface:</strong> Le bouton de méditation est désactivé et affiche "Niveau Maximum Atteint" lorsque le cultivateur a atteint le sommet.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Notification:</strong> Ajout d'une alerte informative dans le menu de cultivation pour indiquer que le niveau maximum a été atteint.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Feedback:</strong> Message de félicitations spécial lorsqu'un joueur atteint le niveau maximum de cultivation.
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
              Version 1.0.1
            </Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              Date: 13 Mars 2025
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Nouvelle fonctionnalité majeure:</strong> Ajout d'un multiplicateur sur les statistiques de combat selon le royaume de cultivation, rendant les cultivateurs des royaumes supérieurs significativement plus puissants.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Interface:</strong> Affichage détaillé des multiplicateurs de combat par royaume dans le menu des statistiques.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Amélioration:</strong> Recalcul automatique des statistiques de combat lors des percées entre royaumes avec notification des changements.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Changement conceptuel:</strong> Modification du système de percée pour passer d'une "réduction du temps de percée" à une "réduction du coût de percée", reflétant plus précisément le mécanisme réel (réduction du Qi requis).
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Amélioration:</strong> Ajout d'une confirmation lors de l'apprentissage d'une technique, à la fois depuis la liste des techniques et depuis la vue détaillée.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Interface:</strong> Suppression de l'affichage du temps total de cultivation dans le menu cultivation pour une interface plus épurée.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Nouvelle fonctionnalité:</strong> Ajout d'un récapitulatif détaillé des bonus de cultivation dans le menu cultivation, montrant tous les multiplicateurs appliqués (secte, techniques, origine, etc.).
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Correction:</strong> Résolution d'une incohérence entre le gain de Qi affiché dans le récapitulatif et le gain réel utilisé dans le jeu.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Correction:</strong> Résolution de divers bugs mineurs et améliorations de performance.
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
              Version 1.0.0
            </Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              Date: 11 Mars 2025
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Lancement initial:</strong> Première version publique du jeu.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Fonctionnalités:</strong> Système de cultivation, création de personnage, et exploration de base.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePatchNotes} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 