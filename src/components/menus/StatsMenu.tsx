import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress
} from '@mui/material';
import { Personnage } from '../../models/types';

interface StatsMenuProps {
  personnage: Personnage;
}

// Fonction pour obtenir la couleur en fonction de la valeur de la statistique
const getStatColor = (value: number): string => {
  if (value <= 3) return '#e74c3c'; // Faible - rouge
  if (value <= 6) return '#f1c40f'; // Moyen - jaune
  if (value <= 8) return '#2ecc71'; // Bon - vert
  return '#9b59b6'; // Excellent - violet
};

// Composant pour afficher une statistique avec une barre de progression
const StatDisplay = ({ nom, valeur, description }: { nom: string, valeur: number, description: string }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body1">{nom}</Typography>
        <Typography variant="body1" fontWeight="bold">{valeur}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={valeur * 10} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getStatColor(valeur),
          }
        }} 
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
};

const StatsMenu: React.FC<StatsMenuProps> = ({ personnage }) => {
  // Calcul du total des statistiques
  const totalStats = Object.values(personnage.stats).reduce((a, b) => a + b, 0);
  const moyenneStats = totalStats / 8;

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Statistiques
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Aperçu des Statistiques</Typography>
          <Box sx={{ 
            px: 1.5, 
            py: 0.5, 
            borderRadius: 1, 
            backgroundColor: getStatColor(moyenneStats),
            color: 'white',
            fontWeight: 'bold'
          }}>
            Moyenne: {moyenneStats.toFixed(1)}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Les statistiques déterminent vos capacités et influencent votre progression dans le monde de la cultivation.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatDisplay 
              nom="Force" 
              valeur={personnage.stats.force} 
              description="Détermine votre puissance physique et vos dégâts au combat."
            />
            <StatDisplay 
              nom="Agilité" 
              valeur={personnage.stats.agilite} 
              description="Affecte votre vitesse, votre esquive et votre précision."
            />
            <StatDisplay 
              nom="Constitution" 
              valeur={personnage.stats.constitution} 
              description="Influence votre santé, votre endurance et votre résistance."
            />
            <StatDisplay 
              nom="Intelligence" 
              valeur={personnage.stats.intelligence} 
              description="Améliore votre capacité à apprendre des techniques et augmente votre gain de Qi."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatDisplay 
              nom="Perception" 
              valeur={personnage.stats.perception} 
              description="Affecte votre capacité à détecter les dangers et les opportunités."
            />
            <StatDisplay 
              nom="Charisme" 
              valeur={personnage.stats.charisme} 
              description="Influence vos interactions sociales et votre capacité à diriger."
            />
            <StatDisplay 
              nom="Chance" 
              valeur={personnage.stats.chance} 
              description="Augmente vos chances de trouver des objets rares et d'éviter les dangers."
            />
            <StatDisplay 
              nom="Qi" 
              valeur={personnage.stats.qi} 
              description="Détermine votre puissance spirituelle et votre taux de gain de Qi pendant la méditation."
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>Effets des Statistiques</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Gain de Qi par seconde:</strong> {personnage.stats.qi} (base) + {(personnage.stats.intelligence * 0.08).toFixed(2)} (intelligence) + {(personnage.stats.perception * 0.04).toFixed(2)} (perception)
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Espérance de vie:</strong> Influencée par votre race et votre niveau de cultivation.
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Combat:</strong> Force, Agilité et Constitution déterminent vos capacités au combat.
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Cultivation:</strong> Intelligence, Perception et Qi influencent votre progression spirituelle.
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Social:</strong> Charisme et Chance affectent vos interactions et découvertes.
          </Typography>
        </Box>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: 1,
          border: '1px solid #a8dadc'
        }}>
          <Typography variant="body2" gutterBottom>
            <strong>Conseil:</strong> Pour maximiser votre gain de Qi, concentrez-vous sur l'amélioration de votre Intelligence, Perception et Qi.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default StatsMenu; 