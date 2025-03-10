import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  Personnage, 
  getDescriptionRoyaume, 
  getRoyaumeColor, 
  getNomCompletCultivation
} from '../../models/types';

interface CultivationMenuProps {
  personnage: Personnage;
  meditationActive: boolean;
  gainQiParSeconde: number;
  tempsTotalMeditation: number;
  toggleMeditation: () => void;
}

const CultivationMenu: React.FC<CultivationMenuProps> = ({ 
  personnage, 
  meditationActive, 
  gainQiParSeconde, 
  tempsTotalMeditation, 
  toggleMeditation 
}) => {
  const descriptionRoyaume = getDescriptionRoyaume(personnage.royaumeCultivation);
  const nomCultivation = getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee);
  const pourcentageProgression = (personnage.pointsQi / personnage.qiRequis) * 100;

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Cultivation
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          backgroundColor: 'background.paper', 
          mb: 3,
          border: meditationActive ? `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}` : 'none',
          boxShadow: meditationActive ? `0 0 15px ${getRoyaumeColor(personnage.royaumeCultivation)}` : 'none',
          transition: 'all 0.5s ease'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {personnage.royaumeCultivation} - {nomCultivation}
          </Typography>
          <Chip 
            label={`+${gainQiParSeconde} Qi/s`} 
            color="primary" 
            size="small"
            sx={{ 
              animation: meditationActive ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 }
              }
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {descriptionRoyaume}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Progression vers la prochaine percée</Typography>
            <Typography variant="body2">
              {personnage.pointsQi.toLocaleString()} / {personnage.qiRequis.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={pourcentageProgression} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              '& .MuiLinearProgress-bar': {
                backgroundColor: getRoyaumeColor(personnage.royaumeCultivation),
              }
            }} 
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative'
        }}>
          {meditationActive && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -30, 
                left: '50%', 
                transform: 'translateX(-50%)',
                color: getRoyaumeColor(personnage.royaumeCultivation),
                fontWeight: 'bold',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%': { transform: 'translateX(-50%) translateY(0px)' },
                  '50%': { transform: 'translateX(-50%) translateY(-10px)' },
                  '100%': { transform: 'translateX(-50%) translateY(0px)' }
                }
              }}
            >
              +{gainQiParSeconde} Qi
            </Box>
          )}
          
          <Button 
            variant="contained" 
            color={meditationActive ? "secondary" : "primary"}
            size="large"
            onClick={toggleMeditation}
            sx={{ 
              minWidth: 200,
              py: 1.5,
              boxShadow: meditationActive 
                ? `0 4px 20px ${getRoyaumeColor(personnage.royaumeCultivation)}` 
                : '0 4px 20px rgba(230, 57, 70, 0.4)',
              '&:hover': {
                boxShadow: meditationActive 
                  ? `0 6px 25px ${getRoyaumeColor(personnage.royaumeCultivation)}` 
                  : '0 6px 25px rgba(230, 57, 70, 0.6)',
              },
              animation: meditationActive ? 'pulse 2s infinite' : 'none'
            }}
          >
            {meditationActive ? "Arrêter la Méditation" : "Commencer à Méditer"}
            {meditationActive && (
              <Box component="span" sx={{ ml: 1, display: 'flex', alignItems: 'center', fontSize: '0.85em' }}>
                <span style={{ color: '#4caf50' }}>+{gainQiParSeconde}</span>
                <span style={{ marginLeft: '2px' }}>Qi/s</span>
              </Box>
            )}
          </Button>
          
          {meditationActive && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>Méditation en cours: </span>
              <Box component="span" sx={{ 
                ml: 1, 
                fontFamily: 'monospace', 
                fontWeight: 'bold',
                color: getRoyaumeColor(personnage.royaumeCultivation),
                backgroundColor: 'rgba(0,0,0,0.1)',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}>
                {Math.floor(tempsTotalMeditation / 60)}:{(tempsTotalMeditation % 60).toString().padStart(2, '0')}
              </Box>
            </Typography>
          )}
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Progression de Cultivation
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Points de Qi Total Accumulés: <strong>{personnage.pointsQiTotal.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Taux de Gain Actuel: <strong>{gainQiParSeconde} Qi/seconde</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prochain Palier: <strong>{personnage.qiRequis.toLocaleString()} points</strong>
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          La méditation est la clé pour accumuler du Qi et progresser dans votre chemin de cultivation. 
          Plus votre intelligence et votre perception sont élevées, plus vous gagnez de Qi rapidement.
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: 1,
          border: `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}`
        }}>
          <Typography variant="body2" gutterBottom>
            <strong>Conseil:</strong> Méditez régulièrement pour accumuler du Qi et atteindre des percées qui prolongeront votre espérance de vie.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CultivationMenu; 