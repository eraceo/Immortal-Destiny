import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Personnage,
  Secte,
  RangSecte,
  getSecteById,
  getRareteColor,
  TechniqueCultivation,
  MissionSecte,
  RessourceSecte,
  ElementCultivation
} from '../../models/types';
import { getTechniquesSecte, peutApprendreTechnique, calculerCoutApprentissage } from '../../models/techniques';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

interface SecteMenuProps {
  personnage: Personnage;
  onUpdatePersonnage: (personnage: Personnage) => void;
}

// Interface pour les onglets
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Composant pour les onglets
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`secte-tabpanel-${index}`}
      aria-labelledby={`secte-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const SecteMenu: React.FC<SecteMenuProps> = ({ personnage, onUpdatePersonnage }) => {
  const [tabValue, setTabValue] = useState(0);
  const [techniquesSecte, setTechniquesSecte] = useState<TechniqueCultivation[]>([]);
  const [loadingTechniques, setLoadingTechniques] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueCultivation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [coutReel, setCoutReel] = useState(0);
  
  // Récupérer les informations de la secte si le personnage appartient à une secte
  const secte = personnage.appartenanceSecte 
    ? getSecteById(personnage.appartenanceSecte.secteId) 
    : undefined;
  
  // Charger les techniques de la secte
  useEffect(() => {
    if (secte) {
      try {
        const techniques = getTechniquesSecte(secte.id);
        setTechniquesSecte(techniques);
      } catch (error) {
        console.error("Erreur lors du chargement des techniques:", error);
      } finally {
        setLoadingTechniques(false);
      }
    }
  }, [secte]);
  
  // Gérer le changement d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Fonction pour ouvrir le dialogue de détail d'une technique
  const handleTechniqueClick = (technique: TechniqueCultivation) => {
    setSelectedTechnique(technique);
    setDialogOpen(true);
  };
  
  // Fonction pour fermer le dialogue
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTechnique(null);
  };
  
  const handleOpenConfirmation = (technique: TechniqueCultivation) => {
    // Calculer le coût réel en tenant compte des bonus
    const cout = calculerCoutApprentissage(
      personnage, 
      technique,
      personnage.appartenanceSecte?.secteId
    );
    setSelectedTechnique(technique);
    setCoutReel(cout);
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationDialogOpen(false);
  };

  const handleApprendreTechnique = () => {
    // Vérifier à nouveau les conditions avant d'apprendre
    if (!selectedTechnique) return;
    
    const verificationFinale = peutApprendreTechnique(personnage, selectedTechnique);
    if (!verificationFinale.peut) {
      return; // Ne pas continuer si les conditions ne sont plus remplies
    }
    
    // Mettre à jour le personnage
    const personnageUpdated = {
      ...personnage,
      techniquesApprises: [...personnage.techniquesApprises, selectedTechnique],
      pierresSpirituelles: personnage.pierresSpirituelles - coutReel
    };
    
    onUpdatePersonnage(personnageUpdated);
    handleCloseConfirmation();
    handleCloseDialog();
  };
  
  // Fonction pour obtenir la couleur du rang
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
  
  // Fonction pour obtenir la couleur d'un élément
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
  
  // Si le personnage n'appartient à aucune secte
  if (!secte || !personnage.appartenanceSecte) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Vous n'appartenez à aucune secte actuellement. Rejoignez une secte pour accéder à des techniques exclusives, des ressources et des missions.
        </Alert>
        <Typography variant="h6" gutterBottom>
          Avantages de rejoindre une secte :
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Accès à des techniques de cultivation exclusives" />
          </ListItem>
          <ListItem>
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Ressources rares pour accélérer votre progression" />
          </ListItem>
          <ListItem>
            <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
            <ListItemText primary="Missions spéciales avec des récompenses importantes" />
          </ListItem>
          <ListItem>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="Protection et soutien de la secte" />
          </ListItem>
        </List>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {/* Fonction pour ouvrir la liste des sectes disponibles */}}
          >
            Rechercher une secte
          </Button>
        </Box>
      </Box>
    );
  }
  
  // Afficher les informations de la secte si le personnage appartient à une secte
  return (
    <Box sx={{ width: '100%' }}>
      {/* En-tête avec les informations de base de la secte */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" gutterBottom>
              {secte.nom}
              <Chip 
                label={secte.type} 
                size="small" 
                sx={{ ml: 1, backgroundColor: getRareteColor(secte.rarete), color: '#fff' }} 
              />
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {secte.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Votre rang : 
                  <Chip 
                    label={personnage.appartenanceSecte.rang} 
                    size="small" 
                    sx={{ ml: 1, backgroundColor: getRangColor(personnage.appartenanceSecte.rang), color: '#fff' }} 
                  />
                </Typography>
                <Typography variant="body2">
                  <StarIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 'small' }} />
                  Points de contribution : {personnage.appartenanceSecte.pointsContribution}
                </Typography>
                <Typography variant="body2">
                  <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 'small' }} />
                  Relation avec les anciens : {personnage.appartenanceSecte.relationAnciens}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(personnage.appartenanceSecte.relationAnciens + 100) / 2} 
                  sx={{ mt: 1, height: 8, borderRadius: 4 }} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Onglets pour les différentes sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="secte tabs">
          <Tab label="Avantages" />
          <Tab label="Techniques" />
          <Tab label="Missions" />
          <Tab label="Ressources" />
        </Tabs>
      </Box>
      
      {/* Contenu des onglets */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Avantages de la secte</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Bonus de cultivation</Typography>
                <Typography variant="body2">
                  Multiplicateur de Qi : <strong>+{((secte.avantages.multiplicateurQi - 1) * 100).toFixed(0)}%</strong>
                </Typography>
                <Typography variant="body2">
                  Réduction du temps de percée : <strong>{secte.avantages.reductionTempsPercee}%</strong>
                </Typography>
                <Typography variant="body2">
                  Bonus de longévité : <strong>{secte.avantages.bonusLongevite > 0 ? '+' : ''}{secte.avantages.bonusLongevite}%</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Bonus de statistiques</Typography>
                {Object.entries(secte.avantages.bonusStats).map(([stat, value]) => (
                  <Typography key={stat} variant="body2">
                    {stat.charAt(0).toUpperCase() + stat.slice(1)} : <strong>+{value}</strong>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Affinités élémentaires</Typography>
        <Grid container spacing={1}>
          <Grid item>
            <Tooltip title="Élément principal">
              <Chip 
                label={secte.elementPrincipal} 
                color="primary" 
                sx={{ fontWeight: 'bold' }} 
              />
            </Tooltip>
          </Grid>
          {secte.elementsSecondaires.map((element) => (
            <Grid item key={element}>
              <Tooltip title="Élément secondaire">
                <Chip 
                  label={element} 
                  variant="outlined" 
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Techniques de cultivation</Typography>
        
        {loadingTechniques ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : techniquesSecte.length === 0 ? (
          <Alert severity="info">
            Aucune technique n'est disponible dans cette secte pour le moment.
          </Alert>
        ) : (
          <>
            
            <Grid container spacing={2}>
              {techniquesSecte.map((technique) => {
                const estApprise = personnage.techniquesApprises.some(t => t.id === technique.id);
                const resultat = peutApprendreTechnique(personnage, technique);
                const coutReel = calculerCoutApprentissage(
                  personnage, 
                  technique, 
                  personnage.appartenanceSecte?.secteId
                );
                
                // Vérifier si la technique est verrouillée en raison du rang
                const rangInsuffisant = technique.rangRequis && personnage.appartenanceSecte && 
                                       technique.rangRequis > personnage.appartenanceSecte.rang;
                
                // Vérifier si le niveau de cultivation est insuffisant
                const niveauInsuffisant = personnage.royaumeCultivation < technique.niveauRequis;
                
                // Technique verrouillée si rang ou niveau insuffisant
                const techniqueVerrouillee = rangInsuffisant || niveauInsuffisant;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={technique.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderLeft: `4px solid ${getElementColor(technique.element)}`,
                        opacity: techniqueVerrouillee ? 0.5 : (estApprise ? 0.7 : 1),
                        boxShadow: 3,
                        position: 'relative'
                      }}
                    >
                      {techniqueVerrouillee && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1,
                            flexDirection: 'column',
                            gap: 1
                          }}
                        >
                          {rangInsuffisant && (
                            <Chip 
                              label={`Rang ${technique.rangRequis} requis`} 
                              color="error" 
                              sx={{ fontWeight: 'bold' }}
                            />
                          )}
                          {niveauInsuffisant && (
                            <Chip 
                              label={`Niveau ${technique.niveauRequis} requis`} 
                              color="error" 
                              sx={{ fontWeight: 'bold' }}
                            />
                          )}
                        </Box>
                      )}
                      <CardContent 
                        sx={{ 
                          flexGrow: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.03)'
                          }
                        }}
                        onClick={() => handleTechniqueClick(technique)}
                      >
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
                          {estApprise ? (
                            <Chip 
                              label="Apprise" 
                              size="small" 
                              color="success"
                              variant="outlined"
                            />
                          ) : (
                            <Chip 
                              label={`${coutReel} PS`} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
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
                        
                        {!estApprise && !techniqueVerrouillee && (
                          <Box sx={{ mt: 'auto', pt: 1 }}>
                            {!resultat.peut ? (
                              <Typography variant="caption" color="error">
                                {resultat.raison}
                              </Typography>
                            ) : (
                              <Button 
                                variant="outlined" 
                                size="small" 
                                fullWidth
                                onClick={(e) => {
                                  e.stopPropagation(); // Empêcher l'ouverture du détail de la technique
                                  handleOpenConfirmation(technique);
                                }}
                              >
                                Apprendre
                              </Button>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Missions de la secte</Typography>
        {secte.missions.length > 0 ? (
          <Grid container spacing={2}>
            {secte.missions.map((mission) => (
              <Grid item xs={12} key={mission.id}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {mission.titre}
                      <Chip 
                        label={mission.difficulte} 
                        size="small" 
                        sx={{ ml: 1, backgroundColor: getRareteColor(mission.difficulte), color: '#fff' }} 
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {mission.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2">
                          Durée : {mission.duree} années
                        </Typography>
                        <Typography variant="body2">
                          Royaume minimum : {mission.conditionsRequises.royaumeMinimum || "Aucun"}
                        </Typography>
                        <Typography variant="body2">
                          Rang minimum : {mission.conditionsRequises.rangMinimum || "Aucun"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom>Récompenses :</Typography>
                        <Box>
                          {mission.recompenses.pierresSpirituelles && (
                            <Chip label={`${mission.recompenses.pierresSpirituelles} PS`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          )}
                          {mission.recompenses.pointsContribution && (
                            <Chip label={`${mission.recompenses.pointsContribution} PC`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          )}
                          {mission.recompenses.experience && (
                            <Chip label={`${mission.recompenses.experience} XP`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 1 }}>
                      {personnage.appartenanceSecte?.missionsCompletees.includes(mission.id) ? (
                        <Chip label="Complétée" color="success" size="small" />
                      ) : (
                        <Button 
                          variant="contained" 
                          size="small"
                          disabled={
                            (mission.conditionsRequises.royaumeMinimum && personnage.royaumeCultivation < mission.conditionsRequises.royaumeMinimum) ||
                            (mission.conditionsRequises.rangMinimum && personnage.appartenanceSecte?.rang && personnage.appartenanceSecte.rang < mission.conditionsRequises.rangMinimum)
                          }
                        >
                          Accepter la mission
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            Aucune mission disponible actuellement. Revenez plus tard ou augmentez votre rang dans la secte.
          </Alert>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Ressources de la secte</Typography>
        {secte.ressources.length > 0 ? (
          <Grid container spacing={2}>
            {secte.ressources.map((ressource) => (
              <Grid item xs={12} md={6} key={ressource.id}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {ressource.nom}
                      <Chip 
                        label={ressource.rarete} 
                        size="small" 
                        sx={{ ml: 1, backgroundColor: getRareteColor(ressource.rarete), color: '#fff' }} 
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {ressource.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" gutterBottom>Effets :</Typography>
                    <Box>
                      {ressource.effets.gainQi && (
                        <Typography variant="body2">
                          Gain de Qi : +{ressource.effets.gainQi}
                        </Typography>
                      )}
                      {ressource.effets.bonusTemporaire && Object.entries(ressource.effets.bonusTemporaire).map(([stat, value]) => (
                        <Typography key={stat} variant="body2">
                          {stat.charAt(0).toUpperCase() + stat.slice(1)} : +{value} (pendant {ressource.effets.dureeBonus} années)
                        </Typography>
                      ))}
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        Disponible : {personnage.appartenanceSecte?.ressourcesObtenues[ressource.id] || 0}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        disabled={!personnage.appartenanceSecte?.ressourcesObtenues[ressource.id] || (personnage.appartenanceSecte?.ressourcesObtenues[ressource.id] || 0) <= 0}
                      >
                        Utiliser
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            Aucune ressource disponible actuellement. Complétez des missions pour obtenir des ressources de la secte.
          </Alert>
        )}
      </TabPanel>
      
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
                  {personnage.royaumeCultivation < selectedTechnique.niveauRequis && (
                    <Chip 
                      label="Insuffisant" 
                      color="error" 
                      size="small" 
                      sx={{ ml: 1, fontWeight: 'bold' }}
                    />
                  )}
                </Typography>
                
                {selectedTechnique.rangRequis && (
                  <Typography variant="h6" sx={{ mb: 1, color: getRangColor(selectedTechnique.rangRequis) }}>
                    Rang requis: {selectedTechnique.rangRequis}
                    {personnage.appartenanceSecte && personnage.appartenanceSecte.rang < selectedTechnique.rangRequis && (
                      <Chip 
                        label="Insuffisant" 
                        color="error" 
                        size="small" 
                        sx={{ ml: 1, fontWeight: 'bold' }}
                      />
                    )}
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
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Coût d'apprentissage: 
                    <Tooltip title="Coût en pierres spirituelles pour apprendre cette technique">
                      <span> {calculerCoutApprentissage(personnage, selectedTechnique, personnage.appartenanceSecte?.secteId)} </span>
                    </Tooltip>
                    pierres spirituelles
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    (Coût de base: {selectedTechnique.coutApprentissage})
                  </Typography>
                </Box>
                
                {(() => {
                  const estApprise = personnage.techniquesApprises.some(t => t.id === selectedTechnique.id);
                  const resultat = peutApprendreTechnique(personnage, selectedTechnique);
                  
                  if (estApprise) {
                    return (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        Vous avez déjà appris cette technique.
                      </Alert>
                    );
                  } else if (!resultat.peut && resultat.raison) {
                    return (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        {resultat.raison}
                      </Alert>
                    );
                  }
                  return null;
                })()}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Fermer
              </Button>
              {(() => {
                const estApprise = personnage.techniquesApprises.some(t => t.id === selectedTechnique.id);
                const resultat = peutApprendreTechnique(personnage, selectedTechnique);
                
                // Double vérification des conditions
                const rangInsuffisant = selectedTechnique.rangRequis && personnage.appartenanceSecte && 
                                       selectedTechnique.rangRequis > personnage.appartenanceSecte.rang;
                const niveauInsuffisant = personnage.royaumeCultivation < selectedTechnique.niveauRequis;
                const peutApprendre = !estApprise && resultat.peut && !rangInsuffisant && !niveauInsuffisant;
                
                if (peutApprendre) {
                  return (
                    <Button 
                      onClick={() => handleOpenConfirmation(selectedTechnique)} 
                      color="primary" 
                      variant="contained"
                    >
                      Apprendre ({calculerCoutApprentissage(personnage, selectedTechnique, personnage.appartenanceSecte?.secteId)} pierres)
                    </Button>
                  );
                }
                return null;
              })()}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialogue de confirmation */}
      <Dialog open={confirmationDialogOpen} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirmation d'apprentissage</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir apprendre la technique <strong>{selectedTechnique?.nom}</strong> ?
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Coût: <strong>{coutReel} pierres spirituelles</strong>
          </Typography>
          <Typography variant="body2">
            Pierres disponibles: <strong>{personnage.pierresSpirituelles}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={handleApprendreTechnique} 
            color="primary" 
            variant="contained"
            disabled={personnage.pierresSpirituelles < coutReel}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecteMenu; 