import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Personnage,
  Secte,
  RangSecte,
  getSecteById,
  getRareteColor,
  TechniqueCultivation,
  MissionSecte,
  RessourceSecte
} from '../../models/types';
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
  
  // Récupérer les informations de la secte si le personnage appartient à une secte
  const secte = personnage.appartenanceSecte 
    ? getSecteById(personnage.appartenanceSecte.secteId) 
    : undefined;
  
  // Gérer le changement d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        {secte.techniques.length > 0 ? (
          <Grid container spacing={2}>
            {secte.techniques.map((technique) => (
              <Grid item xs={12} md={6} key={technique.id}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {technique.nom}
                      <Chip 
                        label={technique.rarete} 
                        size="small" 
                        sx={{ ml: 1, backgroundColor: getRareteColor(technique.rarete), color: '#fff' }} 
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {technique.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Élément : {technique.element}
                    </Typography>
                    <Typography variant="body2">
                      Niveau requis : {technique.niveauRequis}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {personnage.appartenanceSecte?.techniquesApprises.includes(technique.id) ? (
                        <Chip label="Apprise" color="success" size="small" />
                      ) : (
                        <Button 
                          variant="outlined" 
                          size="small"
                          disabled={personnage.royaumeCultivation < technique.niveauRequis || personnage.pierresSpirituelles < technique.coutApprentissage}
                        >
                          Apprendre ({technique.coutApprentissage} PS)
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
            Aucune technique disponible actuellement. Augmentez votre rang dans la secte pour débloquer des techniques.
          </Alert>
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
    </Box>
  );
};

export default SecteMenu; 