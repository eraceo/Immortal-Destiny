import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Personnage, 
  Pilule, 
  PILULES, 
  getRareteColor,
  Rarete
} from '../../models/types';
import { utiliserPilule } from '../../models/pilules';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface InventoryMenuProps {
  personnage: Personnage;
  onUpdatePersonnage: (personnage: Personnage) => void;
}

const InventoryMenu: React.FC<InventoryMenuProps> = ({ personnage, onUpdatePersonnage }) => {
  const [selectedPilule, setSelectedPilule] = useState<Pilule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fonction pour ouvrir le dialogue de confirmation d'utilisation
  const handleOpenDialog = (pilule: Pilule) => {
    setSelectedPilule(pilule);
    setDialogOpen(true);
  };
  
  // Fonction pour fermer le dialogue
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Fonction pour utiliser une pilule
  const handleUtiliserPilule = () => {
    if (!selectedPilule) return;
    
    const { personnageMisAJour, succes, message } = utiliserPilule(personnage, selectedPilule.id);
    
    setSnackbarMessage(message);
    setSnackbarSeverity(succes ? 'success' : 'error');
    setSnackbarOpen(true);
    
    if (succes) {
      onUpdatePersonnage(personnageMisAJour);
    }
    
    handleCloseDialog();
  };
  
  // Fonction pour fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Fonction pour afficher les effets d'une pilule
  const renderEffetsPilule = (pilule: Pilule) => {
    return (
      <Box>
        {pilule.effets.gainQi && (
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <SpeedIcon fontSize="small" sx={{ mr: 1 }} />
            Gain de Qi: +{pilule.effets.gainQi}
          </Typography>
        )}
        
        {pilule.effets.bonusStats && (
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <StarIcon fontSize="small" sx={{ mr: 1 }} />
            Bonus de stats: {Object.entries(pilule.effets.bonusStats).map(([stat, value]) => (
              `${stat.charAt(0).toUpperCase() + stat.slice(1)} +${value}`
            )).join(', ')}
          </Typography>
        )}
        
        {pilule.effets.bonusPercee && (
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <AutorenewIcon fontSize="small" sx={{ mr: 1 }} />
            Bonus de percée: +{pilule.effets.bonusPercee}%
          </Typography>
        )}
        
        {pilule.effets.bonusLongevite && (
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
            Bonus de longévité: +{pilule.effets.bonusLongevite}%
          </Typography>
        )}
      
      </Box>
    );
  };

  // Obtenir les pilules dans l'inventaire
  const pilulesInventaire = personnage.inventairePilules || {};
  const hasPilules = Object.keys(pilulesInventaire).length > 0;

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Inventaire
      </Typography>
      
      {/* Section des Pierres Spirituelles */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Monnaie
          </Typography>
          <Chip 
            label={`${personnage.pierresSpirituelles} Pierres Spirituelles`} 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              p: 1,
              height: 'auto'
            }} 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Les pierres spirituelles sont la monnaie principale du monde de cultivation. Elles peuvent être utilisées pour acheter des ressources, des techniques et des équipements.
        </Typography>
      </Paper>
      
      {/* Section des Pilules */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Pilules
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Les pilules alchimiques peuvent être consommées pour obtenir divers effets bénéfiques pour votre cultivation.
        </Typography>
        
        <Grid container spacing={2}>
          {hasPilules ? (
            Object.entries(pilulesInventaire).map(([piluleId, quantite]) => {
              if (quantite <= 0) return null;
              
              const pilule = PILULES.find(p => p.id === piluleId);
              if (!pilule) return null;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={piluleId}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      border: `1px solid ${getRareteColor(pilule.rarete)}`,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 4px 8px rgba(${pilule.rarete === Rarete.MYTHIQUE ? '255, 215, 0' : '255, 255, 255'}, 0.2)`
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ color: getRareteColor(pilule.rarete) }}>
                          {pilule.nom}
                        </Typography>
                        <Chip 
                          label={`x${quantite}`} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {pilule.description}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      {renderEffetsPilule(pilule)}
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        fullWidth
                        onClick={() => handleOpenDialog(pilule)}
                      >
                        Utiliser
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="body1" align="center" color="text.secondary">
                    Vous n'avez pas de pilules dans votre inventaire.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Section des Objets */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Objets
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Votre inventaire contient les objets que vous avez collectés au cours de votre aventure.
        </Typography>
        
        <Grid container spacing={2}>
          {/* Placeholder pour les objets futurs */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body1" align="center" color="text.secondary">
                  Votre inventaire d'objets est vide pour le moment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Section de l'Équipement */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Équipement
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Les objets équipés améliorent vos statistiques et vous confèrent des capacités spéciales.
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Arme
                </Typography>
                <Typography variant="body1" align="center">
                  -
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Armure
                </Typography>
                <Typography variant="body1" align="center">
                  -
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accessoire
                </Typography>
                <Typography variant="body1" align="center">
                  -
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Dialogue de confirmation d'utilisation */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          Confirmer l'utilisation
        </DialogTitle>
        <DialogContent>
          {selectedPilule && (
            <>
              <DialogContentText>
                Voulez-vous utiliser une <strong>{selectedPilule.nom}</strong> ?
              </DialogContentText>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Effets:
                </Typography>
                {renderEffetsPilule(selectedPilule)}
              </Box>
              <DialogContentText sx={{ mt: 2, color: 'warning.main' }}>
                <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Les effets seront appliqués immédiatement après l'utilisation.
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleUtiliserPilule} color="primary" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryMenu; 
