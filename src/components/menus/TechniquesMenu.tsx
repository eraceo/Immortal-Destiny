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
  SelectChangeEvent
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

interface TechniquesMenuProps {
  personnage: Personnage;
  onUpdatePersonnage: (personnage: Personnage) => void;
}

const TechniquesMenu: React.FC<TechniquesMenuProps> = ({ personnage, onUpdatePersonnage }) => {
  const [techniquesDisponibles, setTechniquesDisponibles] = useState<TechniqueCultivation[]>([]);
  const [techniquesApprises, setTechniquesApprises] = useState<TechniqueCultivation[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueCultivation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreRang, setFiltreRang] = useState<string>("tous");
  const [filtreElement, setFiltreElement] = useState<string>("tous");

  useEffect(() => {
    // Charger les techniques disponibles en fonction de l'appartenance à une secte
    try {
      const secteId = personnage.appartenanceSecte?.secteId;
      let techniques: TechniqueCultivation[] = [];
      
      if (secteId) {
        techniques = getTechniquesSecte(secteId);
      } else {
        // Si le personnage n'appartient à aucune secte, montrer uniquement les techniques génériques
        techniques = getTechniquesSecte('');
      }
      
      // Filtrer les techniques déjà apprises
      const techniquesNonApprises = techniques.filter(
        technique => !personnage.techniquesApprises.some(t => t.id === technique.id)
      );
      
      setTechniquesDisponibles(techniquesNonApprises);
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

  const handleApprendreTechnique = () => {
    if (!selectedTechnique) return;
    
    const resultat = peutApprendreTechnique(personnage, selectedTechnique);
    
    if (resultat.peut) {
      // Calculer le coût réel en tenant compte des bonus
      const coutReel = calculerCoutApprentissage(
        personnage, 
        selectedTechnique, 
        personnage.appartenanceSecte?.secteId
      );
      
      // Mettre à jour le personnage
      const personnageUpdated = {
        ...personnage,
        pierresSpirituelles: personnage.pierresSpirituelles - coutReel,
        techniquesApprises: [...personnage.techniquesApprises, selectedTechnique]
      };
      
      onUpdatePersonnage(personnageUpdated);
      setDialogOpen(false);
      setSelectedTechnique(null);
    } else {
      setError(resultat.raison || "Vous ne pouvez pas apprendre cette technique.");
    }
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
        return '#ffeb3b'; // Jaune clair
      case ElementCultivation.OBSCURITE:
        return '#673ab7'; // Violet
      default:
        return '#9e9e9e'; // Gris par défaut
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

  const handleFiltreRangChange = (event: SelectChangeEvent) => {
    setFiltreRang(event.target.value);
  };

  const handleFiltreElementChange = (event: SelectChangeEvent) => {
    setFiltreElement(event.target.value);
  };

  // Filtrer les techniques disponibles en fonction des filtres
  const filtrerTechniques = (techniques: TechniqueCultivation[]): TechniqueCultivation[] => {
    return techniques.filter(technique => {
      // Filtre par rang
      if (filtreRang !== "tous" && technique.rangRequis) {
        if (filtreRang === "accessibles") {
          // Montrer seulement les techniques accessibles avec le rang actuel
          if (!personnage.appartenanceSecte || technique.rangRequis > personnage.appartenanceSecte.rang) {
            return false;
          }
        } else if (filtreRang !== technique.rangRequis) {
          return false;
        }
      }
      
      // Filtre par élément
      if (filtreElement !== "tous" && technique.element !== filtreElement) {
        return false;
      }
      
      return true;
    });
  };

  const techniquesFiltrees = filtrerTechniques(techniquesDisponibles);

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
      
      <Typography variant="h5" gutterBottom>
        Techniques Apprises ({techniquesApprises.length})
      </Typography>
      
      {techniquesApprises.length === 0 ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="body1">
            Vous n'avez pas encore appris de techniques de cultivation.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {techniquesApprises.map((technique) => (
            <Grid item xs={12} sm={6} md={4} key={technique.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: `4px solid ${getElementColor(technique.element)}`,
                  boxShadow: 3
                }}
                onClick={() => handleTechniqueClick(technique)}
              >
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {technique.nom}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip 
                      label={technique.element} 
                      size="small" 
                      sx={{ 
                        bgcolor: getElementColor(technique.element),
                        color: 'white'
                      }} 
                    />
                    <Chip 
                      label={technique.rarete} 
                      size="small" 
                      sx={{ 
                        bgcolor: getRareteColor(technique.rarete),
                        color: 'white'
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {technique.description.length > 100 
                      ? `${technique.description.substring(0, 100)}...` 
                      : technique.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Techniques Disponibles ({techniquesFiltrees.length})
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filtre-rang-label">Rang requis</InputLabel>
            <Select
              labelId="filtre-rang-label"
              value={filtreRang}
              label="Rang requis"
              onChange={handleFiltreRangChange}
            >
              <MenuItem value="tous">Tous les rangs</MenuItem>
              <MenuItem value="accessibles">Accessibles</MenuItem>
              <MenuItem value={RangSecte.DISCIPLE_EXTERNE}>Disciple Externe</MenuItem>
              <MenuItem value={RangSecte.DISCIPLE_INTERNE}>Disciple Interne</MenuItem>
              <MenuItem value={RangSecte.DISCIPLE_PRINCIPAL}>Disciple Principal</MenuItem>
              <MenuItem value={RangSecte.DOYEN}>Doyen</MenuItem>
              <MenuItem value={RangSecte.ANCIEN}>Ancien</MenuItem>
              <MenuItem value={RangSecte.GRAND_ANCIEN}>Grand Ancien</MenuItem>
              <MenuItem value={RangSecte.PATRIARCHE}>Patriarche</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filtre-element-label">Élément</InputLabel>
            <Select
              labelId="filtre-element-label"
              value={filtreElement}
              label="Élément"
              onChange={handleFiltreElementChange}
            >
              <MenuItem value="tous">Tous les éléments</MenuItem>
              <MenuItem value={ElementCultivation.FEU}>Feu</MenuItem>
              <MenuItem value={ElementCultivation.EAU}>Eau</MenuItem>
              <MenuItem value={ElementCultivation.BOIS}>Bois</MenuItem>
              <MenuItem value={ElementCultivation.METAL}>Métal</MenuItem>
              <MenuItem value={ElementCultivation.TERRE}>Terre</MenuItem>
              <MenuItem value={ElementCultivation.FOUDRE}>Foudre</MenuItem>
              <MenuItem value={ElementCultivation.LUMIERE}>Lumière</MenuItem>
              <MenuItem value={ElementCultivation.OBSCURITE}>Obscurité</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {techniquesFiltrees.length === 0 ? (
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body1">
            Aucune technique ne correspond à vos critères de recherche. Essayez de modifier les filtres ou progressez dans votre cultivation pour débloquer plus de techniques.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {techniquesFiltrees.map((technique) => {
            const resultat = peutApprendreTechnique(personnage, technique);
            const coutReel = calculerCoutApprentissage(
              personnage, 
              technique, 
              personnage.appartenanceSecte?.secteId
            );
            
            return (
              <Grid item xs={12} sm={6} md={4} key={technique.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderLeft: `4px solid ${getElementColor(technique.element)}`,
                    opacity: resultat.peut ? 1 : 0.7,
                    boxShadow: 3
                  }}
                  onClick={() => handleTechniqueClick(technique)}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {technique.nom}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      <Chip 
                        label={technique.element} 
                        size="small" 
                        sx={{ 
                          bgcolor: getElementColor(technique.element),
                          color: 'white'
                        }} 
                      />
                      <Chip 
                        label={technique.rarete} 
                        size="small" 
                        sx={{ 
                          bgcolor: getRareteColor(technique.rarete),
                          color: 'white'
                        }} 
                      />
                      <Chip 
                        label={`${coutReel} PS`} 
                        size="small" 
                        variant="outlined"
                      />
                      {technique.rangRequis && (
                        <Tooltip title="Rang requis dans la secte">
                          <Chip 
                            label={technique.rangRequis} 
                            size="small" 
                            sx={{ 
                              bgcolor: getRangColor(technique.rangRequis),
                              color: 'white'
                            }} 
                          />
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {technique.description.length > 100 
                        ? `${technique.description.substring(0, 100)}...` 
                        : technique.description}
                    </Typography>
                    
                    {!resultat.peut && (
                      <Typography variant="caption" color="error">
                        {resultat.raison}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {/* Dialogue de détail de technique */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedTechnique && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `4px solid ${getElementColor(selectedTechnique.element)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h5">{selectedTechnique.nom}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={selectedTechnique.element} 
                  sx={{ 
                    bgcolor: getElementColor(selectedTechnique.element),
                    color: 'white'
                  }} 
                />
                <Chip 
                  label={selectedTechnique.rarete} 
                  sx={{ 
                    bgcolor: getRareteColor(selectedTechnique.rarete),
                    color: 'white'
                  }} 
                />
                {selectedTechnique.rangRequis && (
                  <Chip 
                    label={selectedTechnique.rangRequis} 
                    sx={{ 
                      bgcolor: getRangColor(selectedTechnique.rangRequis),
                      color: 'white'
                    }} 
                  />
                )}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" paragraph>
                {selectedTechnique.description}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Niveau requis: {selectedTechnique.niveauRequis}
              </Typography>
              
              {selectedTechnique.rangRequis && (
                <Typography variant="subtitle1" gutterBottom>
                  Rang requis dans la secte: {selectedTechnique.rangRequis}
                </Typography>
              )}
              
              <Typography variant="subtitle1" gutterBottom>
                Coût d'apprentissage: {
                  personnage.techniquesApprises.some(t => t.id === selectedTechnique.id)
                    ? "Déjà apprise"
                    : `${calculerCoutApprentissage(personnage, selectedTechnique, personnage.appartenanceSecte?.secteId)} Pierres Spirituelles`
                }
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Effets
              </Typography>
              
              <Grid container spacing={2}>
                {selectedTechnique.effets.multiplicateurQi && (
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Multiplicateur de Qi:</strong> x{selectedTechnique.effets.multiplicateurQi}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {selectedTechnique.effets.reductionTemps && (
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Réduction du temps de cultivation:</strong> {selectedTechnique.effets.reductionTemps}%
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {selectedTechnique.effets.bonusLongevite && (
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Bonus de longévité:</strong> +{selectedTechnique.effets.bonusLongevite}%
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {selectedTechnique.effets.bonusStats && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Bonus de statistiques:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {Object.entries(selectedTechnique.effets.bonusStats).map(([stat, value]) => (
                          <Chip 
                            key={stat} 
                            label={`${stat}: +${value}`} 
                            size="small" 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
                
                {selectedTechnique.effets.resistanceElement && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Résistance aux éléments:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {selectedTechnique.effets.resistanceElement.map((element) => (
                          <Chip 
                            key={element} 
                            label={element} 
                            size="small" 
                            sx={{ 
                              bgcolor: getElementColor(element),
                              color: 'white'
                            }} 
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
              {!personnage.techniquesApprises.some(t => t.id === selectedTechnique.id) && (
                <Button 
                  onClick={handleApprendreTechnique}
                  variant="contained" 
                  color="primary"
                  disabled={!peutApprendreTechnique(personnage, selectedTechnique).peut}
                >
                  Apprendre ({calculerCoutApprentissage(personnage, selectedTechnique, personnage.appartenanceSecte?.secteId)} PS)
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TechniquesMenu; 