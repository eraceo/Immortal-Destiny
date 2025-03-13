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
  TypeEvenement,
  getSecteById,
  calculerBonusSecte,
  ElementCultivation,
  RangSecte,
  TypeSecte
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
                label={getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee)} 
                sx={{ 
                  backgroundColor: getRoyaumeColor(personnage.royaumeCultivation),
                  color: '#fff',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Race: <strong>{personnage.race}</strong>
                <Chip 
                  size="small" 
                  label={raceInfo.rarete} 
                  sx={{ 
                    ml: 1, 
                    backgroundColor: getRareteColor(raceInfo.rarete),
                    color: '#fff',
                    fontSize: '0.7rem'
                  }} 
                />
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Origine: <strong>{personnage.origine}</strong>
                <Chip 
                  size="small" 
                  label={origineInfo.rarete} 
                  sx={{ 
                    ml: 1, 
                    backgroundColor: getRareteColor(origineInfo.rarete),
                    color: '#fff',
                    fontSize: '0.7rem'
                  }} 
                />
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Genre: <strong>{personnage.genre}</strong>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Âge: <strong>{ageActuel} ans</strong> (Espérance de vie: {esperanceVie} ans)
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Pierres Spirituelles: <strong>{personnage.pierresSpirituelles}</strong>
              </Typography>
              
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progression de l'âge:
                </Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Rareté:</Typography>
              <Chip 
                size="small" 
                label={raceInfo.rarete} 
                sx={{ 
                  ml: 1, 
                  backgroundColor: getRareteColor(raceInfo.rarete),
                  color: '#fff',
                  fontSize: '0.7rem'
                }} 
              />
            </Box>
            
            <Typography variant="h6" gutterBottom>Origine: {personnage.origine}</Typography>
            <Typography variant="body2" paragraph>
              {origineInfo.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Rareté:</Typography>
              <Chip 
                size="small" 
                label={origineInfo.rarete} 
                sx={{ 
                  ml: 1, 
                  backgroundColor: getRareteColor(origineInfo.rarete),
                  color: '#fff',
                  fontSize: '0.7rem'
                }} 
              />
            </Box>
          </Paper>
          
          {/* Informations sur la secte */}
          <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Affiliation</Typography>
            
            {personnage.appartenanceSecte ? (
              <>
                {(() => {
                  const secte = getSecteById(personnage.appartenanceSecte.secteId);
                  if (!secte) return <Typography>Aucune information disponible</Typography>;
                  
                  // Calculer les bonus de la secte
                  const bonusSecte = calculerBonusSecte(personnage);
                  
                  // Fonction pour obtenir la couleur associée à un élément
                  const getElementColor = (element: ElementCultivation): string => {
                    switch (element) {
                      case ElementCultivation.FEU: return '#e74c3c'; // Rouge
                      case ElementCultivation.EAU: return '#3498db'; // Bleu
                      case ElementCultivation.BOIS: return '#2ecc71'; // Vert
                      case ElementCultivation.METAL: return '#95a5a6'; // Gris
                      case ElementCultivation.TERRE: return '#d35400'; // Marron
                      case ElementCultivation.FOUDRE: return '#9b59b6'; // Violet
                      case ElementCultivation.LUMIERE: return '#f1c40f'; // Jaune
                      case ElementCultivation.OBSCURITE: return '#34495e'; // Bleu foncé
                      default: return '#bdc3c7'; // Gris clair
                    }
                  };
                  
                  return (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: getElementColor(secte.elementPrincipal) }}>
                          {secte.nom}
                        </Typography>
                        <Chip 
                          label={secte.rarete} 
                          size="small" 
                          sx={{ 
                            backgroundColor: getRareteColor(secte.rarete),
                            color: 'white',
                            fontWeight: 'bold'
                          }} 
                        />
                      </Box>
                      
                      <Typography variant="body2" paragraph>
                        {secte.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Type: <strong>{secte.type}</strong>
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Rang: <strong>{personnage.appartenanceSecte.rang}</strong>
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Points de Contribution: <strong>{personnage.appartenanceSecte.pointsContribution}</strong>
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Relation avec les Anciens: <strong>{personnage.appartenanceSecte.relationAnciens}/100</strong>
                        </Typography>
                        
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Éléments:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          label={secte.elementPrincipal} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${getElementColor(secte.elementPrincipal)}44`,
                            color: getElementColor(secte.elementPrincipal),
                            border: `1px solid ${getElementColor(secte.elementPrincipal)}`
                          }} 
                        />
                        {secte.elementsSecondaires.map(element => (
                          <Chip 
                            key={element}
                            label={element} 
                            size="small" 
                            sx={{ 
                              backgroundColor: `${getElementColor(element)}22`,
                              color: getElementColor(element),
                              border: `1px solid ${getElementColor(element)}`
                            }} 
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Bonus actuels (basés sur votre rang):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label={`Qi ×${bonusSecte.multiplicateurQi.toFixed(2)}`} 
                          size="small" 
                          sx={{ backgroundColor: '#1e1e1e' }} 
                        />
                        {Object.entries(bonusSecte.bonusStats).map(([stat, valeur]) => (
                          <Chip 
                            key={stat}
                            label={`${stat} +${valeur.toFixed(1)}`} 
                            size="small" 
                            sx={{ backgroundColor: '#1e1e1e' }} 
                          />
                        ))}
                        <Chip 
                          label={`Percée -${bonusSecte.reductionCoutPercee.toFixed(1)}%`} 
                          size="small" 
                          sx={{ backgroundColor: '#1e1e1e' }} 
                        />
                        <Chip 
                          label={`Longévité ${bonusSecte.bonusLongevite > 0 ? '+' : ''}${bonusSecte.bonusLongevite.toFixed(1)}%`} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#1e1e1e',
                            color: bonusSecte.bonusLongevite > 0 ? '#2ecc71' : '#e74c3c'
                          }} 
                        />
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Techniques apprises: {personnage.appartenanceSecte.techniquesApprises.length}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Missions complétées: {personnage.appartenanceSecte.missionsCompletees.length}
                      </Typography>
                    </>
                  );
                })()}
              </>
            ) : (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Cultivateur Indépendant
                </Typography>
                <Typography variant="body2" paragraph>
                  Vous avez choisi de suivre votre propre voie sans les contraintes d'une secte. Vous êtes libre de vos choix, mais vous ne bénéficiez pas des avantages qu'offre l'appartenance à une secte.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Liberté totale" 
                    size="small" 
                    sx={{ backgroundColor: '#1e1e1e' }} 
                  />
                  <Chip 
                    label="Pas de missions obligatoires" 
                    size="small" 
                    sx={{ backgroundColor: '#1e1e1e' }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Vous pouvez toujours tenter de rejoindre une secte plus tard dans votre parcours, si votre talent et vos compétences le permettent.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileMenu; 