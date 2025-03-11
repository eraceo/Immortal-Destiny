import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Tooltip,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Personnage, 
  TechniqueCultivation, 
  Rarete, 
  getRareteColor,
  ElementCultivation,
  RangSecte
} from '../../models/types';
import { 
  getTechniquesSecte, 
  peutApprendreTechnique, 
  calculerCoutApprentissage 
} from '../../models/techniques';
import SearchIcon from '@mui/icons-material/Search';

interface TechniquesMenuProps {
  personnage: Personnage;
  onUpdatePersonnage: (personnage: Personnage) => void;
}

const TechniquesMenu: React.FC<TechniquesMenuProps> = ({ personnage, onUpdatePersonnage }) => {
  const [techniquesApprises, setTechniquesApprises] = useState<TechniqueCultivation[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueCultivation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreElement, setFiltreElement] = useState<string>("tous");
  const [filtreUtilite, setFiltreUtilite] = useState<string>("");

  useEffect(() => {
    try {
      setTechniquesApprises(personnage.techniquesApprises);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des techniques:", err);
      setError("Impossible de charger les techniques. Veuillez réessayer.");
      setLoading(false);
    }
  }, [personnage]);

  const handleTechniqueClick = (technique: TechniqueCultivation) => {
    setSelectedTechnique(technique);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTechnique(null);
  };

  const getElementColor = (element: ElementCultivation): string => {
    switch (element) {
      case ElementCultivation.FEU:
        return '#f44336'; // Rouge
      case ElementCultivation.EAU:
        return '#2196f3'; // Bleu
      case ElementCultivation.BOIS:
        return '#4caf50'; // Vert
      case ElementCultivation.METAL:
        return '#9e9e9e'; // Gris
      case ElementCultivation.TERRE:
        return '#795548'; // Marron
      case ElementCultivation.FOUDRE:
        return '#ffeb3b'; // Jaune
      case ElementCultivation.LUMIERE:
        return '#ffc107'; // Ambre
      case ElementCultivation.OBSCURITE:
        return '#673ab7'; // Violet
      default:
        return '#000000'; // Noir
    }
  };

  const getRangColor = (rang: RangSecte): string => {
    switch (rang) {
      case RangSecte.DISCIPLE_EXTERNE:
        return '#a1a1a1'; // Gris
      case RangSecte.DISCIPLE_INTERNE:
        return '#64b5f6'; // Bleu clair
      case RangSecte.DISCIPLE_PRINCIPAL:
        return '#4caf50'; // Vert
      case RangSecte.DOYEN:
        return '#ff9800'; // Orange
      case RangSecte.ANCIEN:
        return '#f44336'; // Rouge
      case RangSecte.GRAND_ANCIEN:
        return '#9c27b0'; // Violet
      case RangSecte.PATRIARCHE:
        return '#ffd700'; // Or
      default:
        return '#ffffff'; // Blanc
    }
  };

  const handleFiltreElementChange = (event: SelectChangeEvent) => {
    setFiltreElement(event.target.value);
  };

  const handleFiltreUtiliteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltreUtilite(event.target.value);
  };

  const filtrerTechniques = (techniques: TechniqueCultivation[]): TechniqueCultivation[] => {
    return techniques.filter(technique => {
      // Filtre par élément
      if (filtreElement !== "tous" && technique.element !== filtreElement) {
        return false;
      }
      
      // Filtre par utilité
      if (filtreUtilite.trim() !== "") {
        const termeRecherche = filtreUtilite.toLowerCase();
        const utiliteMatch = technique.utilite.some(util => 
          util.toLowerCase().includes(termeRecherche)
        );
        const nomMatch = technique.nom.toLowerCase().includes(termeRecherche);
        const descriptionMatch = technique.description.toLowerCase().includes(termeRecherche);
        
        if (!utiliteMatch && !nomMatch && !descriptionMatch) {
          return false;
        }
      }
      
      return true;
    });
  };

  const techniquesFiltrees = filtrerTechniques(techniquesApprises);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Techniques de Cultivation
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtres
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="filtre-element-label">Élément</InputLabel>
              <Select
                labelId="filtre-element-label"
                value={filtreElement}
                label="Élément"
                onChange={handleFiltreElementChange}
              >
                <MenuItem value="tous">Tous les éléments</MenuItem>
                {Object.values(ElementCultivation).map(element => (
                  <MenuItem key={element} value={element}>{element}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rechercher par utilité"
              variant="outlined"
              value={filtreUtilite}
              onChange={handleFiltreUtiliteChange}
              placeholder="Ex: guérison, combat, méditation..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Techniques Apprises ({techniquesFiltrees.length})
      </Typography>
      
      {techniquesFiltrees.length === 0 ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="body1">
            Vous n'avez pas encore appris de techniques de cultivation.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {techniquesFiltrees.map((technique) => (
            <Grid item xs={12} sm={6} md={4} key={technique.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: `4px solid ${getElementColor(technique.element)}`,
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleTechniqueClick(technique)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 1
                  }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {technique.nom}
                    </Typography>
                    <Chip 
                      label={technique.rarete} 
                      size="small"
                      sx={{ 
                        bgcolor: getRareteColor(technique.rarete),
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {technique.description}
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Utilisations principales:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {technique.utilite.slice(0, 2).map((util, index) => (
                        <Chip 
                          key={index}
                          label={util.length > 20 ? util.substring(0, 20) + '...' : util} 
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {technique.utilite.length > 2 && (
                        <Chip 
                          label={`+${technique.utilite.length - 2}`} 
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mt: 'auto',
                    pt: 1
                  }}>
                    <Chip 
                      label={technique.element} 
                      size="small"
                      sx={{ 
                        bgcolor: getElementColor(technique.element),
                        color: 'white'
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      {technique.niveauRequis}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Dialogue de détail de la technique */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedTechnique && (
          <>
            <DialogTitle sx={{ 
              bgcolor: getRareteColor(selectedTechnique.rarete),
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {selectedTechnique.nom}
              <Chip 
                label={selectedTechnique.rarete} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedTechnique.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ mb: 1, color: getElementColor(selectedTechnique.element) }}>
                  Élément: {selectedTechnique.element}
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Niveau requis: {selectedTechnique.niveauRequis}
                </Typography>
                
                {selectedTechnique.rangRequis && (
                  <Typography variant="h6" sx={{ mb: 1, color: getRangColor(selectedTechnique.rangRequis) }}>
                    Rang requis: {selectedTechnique.rangRequis}
                  </Typography>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Utilisations pratiques:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {selectedTechnique.utilite.map((util, index) => (
                    <Typography component="li" key={index} variant="body1" sx={{ mb: 0.5 }}>
                      {util}
                    </Typography>
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Effets:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {selectedTechnique.effets.multiplicateurQi && (
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      Multiplicateur de Qi: <strong>×{selectedTechnique.effets.multiplicateurQi.toFixed(2)}</strong>
                    </Typography>
                  )}
                  
                  {selectedTechnique.effets.reductionTemps && (
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      Réduction du temps de cultivation: <strong>{selectedTechnique.effets.reductionTemps}%</strong>
                    </Typography>
                  )}
                  
                  {selectedTechnique.effets.bonusLongevite && (
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      Bonus de longévité: <strong>+{selectedTechnique.effets.bonusLongevite}%</strong>
                    </Typography>
                  )}
                  
                  {selectedTechnique.effets.bonusStats && (
                    <Box sx={{ mb: 0.5 }}>
                      <Typography variant="body1">
                        Bonus aux statistiques:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                        {Object.entries(selectedTechnique.effets.bonusStats).map(([stat, value]) => (
                          <Typography component="li" key={stat} variant="body2">
                            {stat.charAt(0).toUpperCase() + stat.slice(1)}: <strong>+{value}</strong>
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {selectedTechnique.effets.resistanceElement && selectedTechnique.effets.resistanceElement.length > 0 && (
                    <Box sx={{ mb: 0.5 }}>
                      <Typography variant="body1">
                        Résistance aux éléments:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                        {selectedTechnique.effets.resistanceElement.map(element => (
                          <Chip 
                            key={element}
                            label={element} 
                            size="small"
                            sx={{ bgcolor: getElementColor(element), color: 'white' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TechniquesMenu; 