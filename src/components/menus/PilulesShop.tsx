import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Personnage,
  Pilule,
  PILULES,
  Rarete,
  getRareteColor
} from '../../models/types';
import { acheterPilule } from '../../models/pilules';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import InventoryIcon from '@mui/icons-material/Inventory';

interface PilulesShopProps {
  personnage: Personnage;
  onUpdatePersonnage: (personnage: Personnage) => void;
}

const PilulesShop: React.FC<PilulesShopProps> = ({ personnage, onUpdatePersonnage }) => {
  const [selectedPilule, setSelectedPilule] = useState<Pilule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Vérifier si le personnage appartient à une secte
  const estDansSecte = !!personnage.appartenanceSecte;
  
  // Obtenir les points de contribution si le personnage est dans une secte
  const pointsContribution = estDansSecte && personnage.appartenanceSecte ? personnage.appartenanceSecte.pointsContribution : 0;
  
  // Fonction pour ouvrir le dialogue de confirmation d'achat
  const handleOpenDialog = (pilule: Pilule) => {
    setSelectedPilule(pilule);
    setDialogOpen(true);
  };
  
  // Fonction pour fermer le dialogue
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Fonction pour acheter une pilule
  const handleAcheterPilule = () => {
    if (!selectedPilule) return;
    
    const { personnageMisAJour, succes, message } = acheterPilule(personnage, selectedPilule.id);
    
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
  
  // Fonction pour vérifier si une pilule a atteint sa limite d'achat
  const estLimiteAtteinte = (pilule: Pilule): boolean => {
    if (!pilule.limiteAchat) return false;
    
    const pilulesAchetees = personnage.pilulesAchetees || {};
    const nombreAchats = pilulesAchetees[pilule.id] || 0;
    
    return nombreAchats >= pilule.limiteAchat;
  };
  
  // Fonction pour obtenir le nombre d'achats restants pour une pilule
  const getAchatsRestants = (pilule: Pilule): string => {
    if (!pilule.limiteAchat) return "Illimité";
    
    const pilulesAchetees = personnage.pilulesAchetees || {};
    const nombreAchats = pilulesAchetees[pilule.id] || 0;
    
    return `${pilule.limiteAchat - nombreAchats}/${pilule.limiteAchat}`;
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
        
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <InfoIcon fontSize="small" sx={{ mr: 1 }} />
          Effets permanents
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* En-tête du shop */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Pavillon des Pilules
        </Typography>
        
        <Chip 
          icon={<StarIcon />} 
          label={`Points de contribution: ${pointsContribution}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>
      
      <Typography variant="body1" paragraph>
        Bienvenue au Pavillon des Pilules de la secte. Ici, vous pouvez échanger vos points de contribution contre des pilules alchimiques qui vous aideront dans votre cultivation.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Grille des pilules */}
      <Grid container spacing={2}>
        {PILULES.map((pilule) => (
          <Grid item xs={12} sm={6} md={4} key={pilule.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                border: `1px solid ${getRareteColor(pilule.rarete)}`,
                opacity: estLimiteAtteinte(pilule) ? 0.7 : 1,
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
                    label={pilule.rarete} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getRareteColor(pilule.rarete),
                      color: '#000',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {pilule.description}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                {renderEffetsPilule(pilule)}
                
                {pilule.limiteAchat && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block">
                      Achats restants: {getAchatsRestants(pilule)}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={((pilule.limiteAchat - (personnage.pilulesAchetees?.[pilule.id] || 0)) / pilule.limiteAchat) * 100} 
                      sx={{ height: 4, borderRadius: 2 }} 
                    />
                  </Box>
                )}
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                <Chip 
                  icon={<StarIcon />} 
                  label={`${pilule.coutContribution} points`} 
                  variant="outlined" 
                  size="small" 
                />
                
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleOpenDialog(pilule)}
                  disabled={!estDansSecte || pointsContribution < pilule.coutContribution || estLimiteAtteinte(pilule)}
                >
                  Acheter
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Dialogue de confirmation d'achat */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          Confirmer l'achat
        </DialogTitle>
        <DialogContent>
          {selectedPilule && (
            <>
              <DialogContentText>
                Voulez-vous acheter une <strong>{selectedPilule.nom}</strong> pour <strong>{selectedPilule.coutContribution}</strong> points de contribution ?
              </DialogContentText>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Effets:
                </Typography>
                {renderEffetsPilule(selectedPilule)}
              </Box>
              <DialogContentText sx={{ mt: 2, color: 'info.main' }}>
                <InventoryIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                La pilule sera ajoutée à votre inventaire après l'achat.
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleAcheterPilule} color="primary" variant="contained">
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

export default PilulesShop; 
