import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  LinearProgress, 
  Chip,
  Grid
} from '@mui/material';
import { 
  Personnage, 
  getRaceInfo, 
  getOrigineInfo, 
  getRareteColor, 
  getNomCompletCultivation, 
  getRoyaumeColor,
  calculerEsperanceVie,
  formaterTempsJeu,
  ESPERANCE_VIE_BASE
} from '../../models/types';

interface ProfileMenuProps {
  personnage: Personnage;
  ageActuel: number;
  esperanceVie: number;
  tempsJeuFormate: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  personnage, 
  ageActuel, 
  esperanceVie, 
  tempsJeuFormate 
}) => {
  const raceInfo = getRaceInfo(personnage.race);
  const origineInfo = getOrigineInfo(personnage.origine);
  const nomCultivation = getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee);
  const pourcentageProgression = (personnage.pointsQi / personnage.qiRequis) * 100;
  const pourcentageAge = (ageActuel / esperanceVie) * 100;

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Profil du Personnage
      </Typography>
      
      {ageActuel >= esperanceVie * 0.9 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'rgba(211, 47, 47, 0.1)', 
            border: '1px solid #d32f2f' 
          }}
        >
          <Typography variant="body1" color="error">
            Votre personnage approche de la fin de sa vie ! Atteignez un royaume de cultivation supérieur pour prolonger votre espérance de vie.
          </Typography>
        </Paper>
      )}
      
      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{personnage.nom}</Typography>
              <Chip 
                label={nomCultivation}
                size="small"
                sx={{ 
                  backgroundColor: getRoyaumeColor(personnage.royaumeCultivation),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Race</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">{personnage.race}</Typography>
                <Chip 
                  label={raceInfo.rarete} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getRareteColor(raceInfo.rarete),
                    color: 'white',
                    fontSize: '0.6rem'
                  }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Origine</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">{personnage.origine}</Typography>
                <Chip 
                  label={origineInfo.rarete} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getRareteColor(origineInfo.rarete),
                    color: 'white',
                    fontSize: '0.6rem'
                  }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Genre</Typography>
              <Typography variant="body1">{personnage.genre}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Âge</Typography>
                <Typography variant="body2">
                  {ageActuel} / {esperanceVie} ans
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={pourcentageAge} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: pourcentageAge > 90 ? '#e74c3c' : pourcentageAge > 75 ? '#f39c12' : '#2ecc71',
                  }
                }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Temps de jeu: <strong>{tempsJeuFormate}</strong>
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Progression</Typography>
                <Typography variant="body2">
                  {personnage.pointsQi.toLocaleString()} / {personnage.qiRequis.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={pourcentageProgression} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getRoyaumeColor(personnage.royaumeCultivation),
                  }
                }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Points de Qi Total: <strong>{personnage.pointsQiTotal.toLocaleString()}</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Description de la race et de l'origine */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.paper', mb: 3 }}>
            <Typography variant="h6" gutterBottom>Race: {personnage.race}</Typography>
            <Typography variant="body2" paragraph>
              {raceInfo.description}
            </Typography>
            <Box sx={{ 
              p: 1, 
              backgroundColor: 'rgba(0,0,0,0.1)', 
              borderRadius: 1,
              border: `1px solid ${getRareteColor(raceInfo.rarete)}`,
              mb: 2
            }}>
              <Typography variant="body2">
                <strong>Rareté:</strong> {raceInfo.rarete}
              </Typography>
              <Typography variant="body2">
                <strong>Espérance de vie de base:</strong> {ESPERANCE_VIE_BASE[personnage.race]} ans
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>Origine: {personnage.origine}</Typography>
            <Typography variant="body2" paragraph>
              {origineInfo.description}
            </Typography>
            <Box sx={{ 
              p: 1, 
              backgroundColor: 'rgba(0,0,0,0.1)', 
              borderRadius: 1,
              border: `1px solid ${getRareteColor(origineInfo.rarete)}`
            }}>
              <Typography variant="body2">
                <strong>Rareté:</strong> {origineInfo.rarete}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileMenu; 