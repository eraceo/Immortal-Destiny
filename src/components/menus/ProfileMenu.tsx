import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  LinearProgress, 
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import { 
  Personnage, 
  getRaceInfo, 
  getOrigineInfo, 
  getRareteColor, 
  getNomCompletCultivation, 
  getRoyaumeColor,
  calculerEsperanceVie,
  formaterTempsJeu,
  ESPERANCE_VIE_BASE,
  Evenement,
  TypeEvenement
} from '../../models/types';

interface ProfileMenuProps {
  personnage: Personnage;
  ageActuel: number;
  esperanceVie: number;
  tempsJeuFormate: string;
  historiqueEvenements?: Evenement[];
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  personnage, 
  ageActuel, 
  esperanceVie, 
  tempsJeuFormate,
  historiqueEvenements = []
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const raceInfo = getRaceInfo(personnage.race);
  const origineInfo = getOrigineInfo(personnage.origine);
  const nomCultivation = getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee);
  const pourcentageProgression = (personnage.pointsQi / personnage.qiRequis) * 100;
  const pourcentageAge = (ageActuel / esperanceVie) * 100;

  // Fonction pour obtenir la couleur en fonction du type d'événement
  const getEvenementColor = (type: TypeEvenement): string => {
    switch (type) {
      case TypeEvenement.POSITIF:
        return '#4caf50'; // Vert
      case TypeEvenement.NEUTRE:
        return '#2196f3'; // Bleu
      case TypeEvenement.NEGATIF:
        return '#f44336'; // Rouge
      case TypeEvenement.SPECIAL:
        return '#9c27b0'; // Violet
      default:
        return '#ffffff';
    }
  };

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
              <Typography variant="body2" color="text.secondary">Âge</Typography>
              <Typography variant="body1">{ageActuel} ans</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(pourcentageAge, 100)} 
                  sx={{ 
                    flexGrow: 1, 
                    mr: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: pourcentageAge > 90 ? 'error.main' : 'primary.main',
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {esperanceVie} ans
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Temps de jeu</Typography>
              <Typography variant="body1">{tempsJeuFormate}</Typography>
            </Box>
          </Paper>
          
          {/* Historique des événements */}
          {historiqueEvenements.length > 0 && (
            <Paper elevation={3} sx={{ p: 2, mt: 3, backgroundColor: 'background.paper' }}>
              <Accordion 
                expanded={expanded} 
                onChange={() => setExpanded(!expanded)}
                sx={{ 
                  backgroundColor: 'transparent', 
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="evenements-content"
                  id="evenements-header"
                  sx={{ p: 0 }}
                >
                  <Typography variant="h6">Chronique des événements</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {historiqueEvenements.slice().reverse().map((evenement, index) => (
                      <ListItem 
                        key={`${evenement.id}-${index}`}
                        sx={{ 
                          borderLeft: `4px solid ${getEvenementColor(evenement.type)}`,
                          mb: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '0 4px 4px 0'
                        }}
                      >
                        <ListItemIcon>
                          <EventIcon sx={{ color: getEvenementColor(evenement.type) }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1">{evenement.titre}</Typography>
                              <Chip 
                                label={evenement.type} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getEvenementColor(evenement.type),
                                  color: '#000000',
                                  fontSize: '0.6rem'
                                }} 
                              />
                            </Box>
                          }
                          secondary={evenement.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          )}
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