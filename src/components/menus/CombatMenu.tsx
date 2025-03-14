import React, { useState, useEffect, useRef } from 'react';
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
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Personnage,
  RangSecte,
  getRareteColor,
  getRoyaumeColor,
  getNomCompletCultivation,
  NiveauPercee,
  RoyaumeCultivation
} from '../../models/types';
import {
  Ennemi,
  ResultatCombat,
  LogCombat,
  genererEnnemi,
  simulerCombat,
  appliquerRecompensesCombat,
  peutDefierRangSuperieur,
  getProchainRang,
  promouvoirPersonnage
} from '../../models/combat';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ShieldIcon from '@mui/icons-material/Shield';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface CombatMenuProps {
  personnage: Personnage;
  onUpdatePersonnage: (personnage: Personnage) => void;
}

const CombatMenu: React.FC<CombatMenuProps> = ({ personnage, onUpdatePersonnage }) => {
  // États pour gérer le combat
  const [ennemi, setEnnemi] = useState<Ennemi | null>(null);
  const [resultatCombat, setResultatCombat] = useState<ResultatCombat | null>(null);
  const [combatEnCours, setCombatEnCours] = useState(false);
  const [afficherResultat, setAfficherResultat] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [defierRangSuperieur, setDefierRangSuperieur] = useState(false);
  const [promotion, setPromotion] = useState(false);
  
  // Référence pour la boîte de logs de combat
  const logsBoxRef = useRef<HTMLDivElement>(null);

  // Fonction d'aide pour vérifier si un royaume est supérieur ou égal à un autre
  const estRoyaumeSuperieureOuEgal = (royaumeJoueur: RoyaumeCultivation, royaumeRequis: RoyaumeCultivation): boolean => {
    // Ordre des royaumes de cultivation (du plus bas au plus élevé)
    const ordreRoyaumes = [
      RoyaumeCultivation.MORTEL,
      RoyaumeCultivation.INITIATION,
      RoyaumeCultivation.QI_CONDENSE,
      RoyaumeCultivation.FONDATION,
      RoyaumeCultivation.CORE_OR,
      RoyaumeCultivation.NASCENT_SOUL,
      RoyaumeCultivation.TRANSCENDANCE,
      RoyaumeCultivation.SAINT_MARTIAL,
      RoyaumeCultivation.DEMI_DIEU,
      RoyaumeCultivation.DIVIN_SUPREME
    ];
    
    // Obtenir les indices des royaumes dans l'ordre
    const indexJoueur = ordreRoyaumes.indexOf(royaumeJoueur);
    const indexRequis = ordreRoyaumes.indexOf(royaumeRequis);
    
    // Vérifier si le royaume du joueur est supérieur ou égal au royaume requis
    return indexJoueur >= indexRequis;
  };

  // Vérifier si le personnage appartient à une secte
  const estDansSecte = !!personnage.appartenanceSecte;
  
  // Obtenir le rang actuel et le prochain rang
  const rangActuel = estDansSecte && personnage.appartenanceSecte ? personnage.appartenanceSecte.rang : null;
  const prochainRang = rangActuel ? getProchainRang(rangActuel) : null;
  
  // Vérifier si le personnage peut défier un rang supérieur
  const peutDefier = estDansSecte && peutDefierRangSuperieur(personnage);

  // Nettoyer l'intervalle lors du démontage du composant
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Effet pour faire défiler automatiquement vers le bas lorsque de nouveaux logs sont ajoutés
  useEffect(() => {
    if (logsBoxRef.current) {
      logsBoxRef.current.scrollTop = logsBoxRef.current.scrollHeight;
    }
  }, [logIndex]);

  // Fonction pour commencer un combat normal
  const commencerCombat = () => {
    if (!estDansSecte || !personnage.appartenanceSecte) return;
    
    // Générer un ennemi du même rang que le joueur
    const nouvelEnnemi = genererEnnemi(personnage.appartenanceSecte.rang, personnage.appartenanceSecte.secteId);
    setEnnemi(nouvelEnnemi);
    setCombatEnCours(true);
    setDefierRangSuperieur(false);
    
    // Simuler le combat
    const resultat = simulerCombat(personnage, nouvelEnnemi);
    setResultatCombat(resultat);
    
    // Réinitialiser l'index des logs
    setLogIndex(0);
    
    // Démarrer l'animation des logs
    const id = setInterval(() => {
      setLogIndex(prevIndex => {
        if (prevIndex < resultat.logs.length - 1) {
          return prevIndex + 1;
        } else {
          // Arrêter l'intervalle lorsque tous les logs ont été affichés
          if (intervalId) {
            clearInterval(intervalId);
          }
          // Afficher le résultat final
          setAfficherResultat(true);
          return prevIndex;
        }
      });
    }, 500); // Vitesse de l'animation
    
    setIntervalId(id);
  };

  // Fonction pour commencer un défi de rang supérieur
  const commencerDefiRangSuperieur = () => {
    if (!estDansSecte || !prochainRang || !personnage.appartenanceSecte) return;
    
    // Générer un ennemi du rang supérieur
    const nouvelEnnemi = genererEnnemi(prochainRang, personnage.appartenanceSecte.secteId);
    setEnnemi(nouvelEnnemi);
    setCombatEnCours(true);
    setDefierRangSuperieur(true);
    
    // Simuler le combat
    const resultat = simulerCombat(personnage, nouvelEnnemi);
    setResultatCombat(resultat);
    
    // Réinitialiser l'index des logs
    setLogIndex(0);
    
    // Démarrer l'animation des logs
    const id = setInterval(() => {
      setLogIndex(prevIndex => {
        if (prevIndex < resultat.logs.length - 1) {
          return prevIndex + 1;
        } else {
          // Arrêter l'intervalle lorsque tous les logs ont été affichés
          if (intervalId) {
            clearInterval(intervalId);
          }
          // Afficher le résultat final
          setAfficherResultat(true);
          return prevIndex;
        }
      });
    }, 500); // Vitesse de l'animation
    
    setIntervalId(id);
  };

  // Fonction pour terminer le combat et appliquer les récompenses
  const terminerCombat = () => {
    if (!resultatCombat) return;
    
    // Appliquer les récompenses si le joueur a gagné
    if (resultatCombat.victoire && resultatCombat.recompenses) {
      const personnageModifie = appliquerRecompensesCombat(personnage, resultatCombat.recompenses);
      
      // Promouvoir le personnage s'il a gagné un défi de rang supérieur
      if (defierRangSuperieur) {
        const personnagePromu = promouvoirPersonnage(personnageModifie);
        onUpdatePersonnage(personnagePromu);
        setPromotion(true);
      } else {
        onUpdatePersonnage(personnageModifie);
      }
    }
    
    // Réinitialiser les états
    setCombatEnCours(false);
    setAfficherResultat(false);
    setEnnemi(null);
    setResultatCombat(null);
    setLogIndex(0);
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Fonction pour fermer la boîte de dialogue de promotion
  const fermerPromotion = () => {
    setPromotion(false);
  };

  // Fonction pour obtenir la couleur en fonction du type d'action
  const getActionColor = (type: string): string => {
    switch (type) {
      case 'attaque':
        return '#ff5252'; // Rouge
      case 'technique':
        return '#64b5f6'; // Bleu
      case 'esquive':
        return '#69f0ae'; // Vert
      case 'defense':
        return '#ffab40'; // Orange
      default:
        return '#ffffff'; // Blanc
    }
  };

  // Fonction pour obtenir l'icône en fonction du type d'action
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'attaque':
        return <LocalFireDepartmentIcon />;
      case 'technique':
        return <SportsKabaddiIcon />;
      case 'esquive':
        return <DirectionsRunIcon />;
      case 'defense':
        return <ShieldIcon />;
      default:
        return null;
    }
  };

  // Rendu des logs de combat
  const renderLogsCombat = () => {
    if (!resultatCombat || !ennemi) return null;
    
    const logsAffichables = resultatCombat.logs.slice(0, logIndex + 1);
    
    return (
      <Box 
        ref={logsBoxRef}
        sx={{ 
          mt: 2, 
          maxHeight: 300, 
          overflowY: 'auto', 
          p: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 82, 82, 0.6)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 82, 82, 0.8)',
            },
          },
        }}
      >
        <List>
          {logsAffichables.map((log, index) => (
            <ListItem 
              key={index}
              sx={{ 
                bgcolor: index === logIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderRadius: 1,
                mb: 1,
                transition: 'background-color 0.3s ease',
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      size="small" 
                      label={`Tour ${log.tour}`} 
                      sx={{ mr: 1, bgcolor: 'background.paper' }} 
                    />
                    <Box 
                      component="span" 
                      sx={{ 
                        color: getActionColor(log.action.type),
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {getActionIcon(log.action.type)}
                      <Box component="span" sx={{ ml: 0.5 }}>
                        {log.action.nom}
                      </Box>
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2">{log.action.description}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Tooltip title="Points de vie du joueur">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HealthAndSafetyIcon fontSize="small" color="success" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {log.hpJoueur} / {personnage.stats.hp}
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Tooltip title="Points de vie de l'ennemi">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HealthAndSafetyIcon fontSize="small" color="error" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {log.hpEnnemi} / {ennemi.stats.hp}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                    {log.action.effets && log.action.effets.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {log.action.effets.map((effet, i) => (
                          <Chip 
                            key={i} 
                            label={effet} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  // Rendu du résultat final du combat
  const renderResultatFinal = () => {
    if (!resultatCombat || !ennemi || !afficherResultat) return null;
    
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2, color: resultatCombat.victoire ? '#69f0ae' : '#ff5252' }}>
          {resultatCombat.victoire ? 'Victoire !' : 'Défaite !'}
        </Typography>
        
        {resultatCombat.victoire && resultatCombat.recompenses && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Récompenses :</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Chip 
                  label={`${resultatCombat.recompenses.pierresSpirituelles} Pierres Spirituelles`} 
                  color="primary" 
                  sx={{ width: '100%' }} 
                />
              </Grid>
              <Grid item xs={4}>
                <Chip 
                  label={`${resultatCombat.recompenses.pointsContribution} Points de Contribution`} 
                  color="secondary" 
                  sx={{ width: '100%' }} 
                />
              </Grid>
              <Grid item xs={4}>
                <Chip 
                  label={`${resultatCombat.recompenses.experience} Qi`} 
                  color="success" 
                  sx={{ width: '100%' }} 
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Button 
          variant="contained" 
          color={resultatCombat.victoire ? "success" : "primary"} 
          onClick={terminerCombat}
          sx={{ mt: 2 }}
        >
          Continuer
        </Button>
      </Box>
    );
  };

  // Rendu de l'interface de combat
  const renderCombatInterface = () => {
    if (!ennemi) return null;
    
    return (
      <Box>
        <Grid container spacing={2}>
          {/* Informations sur le joueur */}
          <Grid item xs={5}>
            <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {personnage.nom}
                </Typography>
                <Typography variant="body2" sx={{ color: getRoyaumeColor(personnage.royaumeCultivation) }}>
                  {getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee)}
                </Typography>
                {estDansSecte && personnage.appartenanceSecte && (
                  <Chip 
                    label={personnage.appartenanceSecte.rang} 
                    size="small" 
                    sx={{ 
                      mt: 1, 
                      bgcolor: 'background.default',
                      color: 'text.primary'
                    }} 
                  />
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Tooltip title="Points de vie">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HealthAndSafetyIcon fontSize="small" color="success" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {personnage.stats.hp}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Dégâts">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalFireDepartmentIcon fontSize="small" color="error" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {personnage.stats.degat}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Esquive">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DirectionsRunIcon fontSize="small" color="info" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {personnage.stats.esquive}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Résistance">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ShieldIcon fontSize="small" color="warning" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {personnage.stats.resistance}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Précision">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon fontSize="small" color="primary" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {personnage.stats.precision}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Indicateur de combat */}
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <SportsKabaddiIcon sx={{ fontSize: 40, color: '#ff5252' }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                VS
              </Typography>
            </Box>
          </Grid>
          
          {/* Informations sur l'ennemi */}
          <Grid item xs={5}>
            <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {ennemi.nom}
                </Typography>
                <Typography variant="body2" sx={{ color: getRoyaumeColor(ennemi.royaumeCultivation) }}>
                  {getNomCompletCultivation(ennemi.royaumeCultivation, NiveauPercee.AVANCE)}
                </Typography>
                <Chip 
                  label={ennemi.rang} 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'background.default',
                    color: 'text.primary'
                  }} 
                />
                
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Tooltip title="Points de vie">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HealthAndSafetyIcon fontSize="small" color="success" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {ennemi.stats.hp}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Dégâts">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalFireDepartmentIcon fontSize="small" color="error" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {ennemi.stats.degat}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Esquive">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DirectionsRunIcon fontSize="small" color="info" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {ennemi.stats.esquive}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Résistance">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ShieldIcon fontSize="small" color="warning" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {ennemi.stats.resistance}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="Précision">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon fontSize="small" color="primary" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {ennemi.stats.precision}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Logs de combat */}
        {renderLogsCombat()}
        
        {/* Résultat final */}
        {renderResultatFinal()}
      </Box>
    );
  };

  // Rendu de l'interface principale
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Arène de Combat
      </Typography>
      
      {!estDansSecte ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Vous devez rejoindre une secte pour participer aux combats.
        </Alert>
      ) : (
        <>
          {!combatEnCours ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bienvenue dans l'arène de combat de votre secte. Ici, vous pouvez défier d'autres disciples pour gagner des récompenses et prouver votre valeur.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SportsKabaddiIcon sx={{ mr: 1, color: '#ff5252' }} />
                        <Typography variant="h6">
                          Combat Normal
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Affrontez un disciple de même rang pour gagner des pierres spirituelles et des points de contribution.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={commencerCombat}
                      >
                        Commencer un Combat
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEventsIcon sx={{ mr: 1, color: '#ffab40' }} />
                        <Typography variant="h6">
                          Défi de Rang
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Défiez un disciple de rang supérieur pour tenter d'être promu. Ce combat sera plus difficile.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth
                        onClick={commencerDefiRangSuperieur}
                        disabled={!peutDefier || !prochainRang}
                      >
                        Défier le Rang {prochainRang}
                      </Button>
                      {!peutDefier && prochainRang && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                          Vous ne remplissez pas encore les conditions pour défier ce rang.
                        </Typography>
                      )}
                      
                      {/* Affichage des conditions de passage de rang */}
                      {prochainRang && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Conditions pour défier le rang {prochainRang}:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            {rangActuel === RangSecte.DISCIPLE_EXTERNE && (
                              <>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Royaume de cultivation: Qi Condensé {estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.QI_CONDENSE) ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Points de contribution: 100 {personnage.appartenanceSecte && personnage.appartenanceSecte.pointsContribution >= 100 ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                              </>
                            )}
                            {rangActuel === RangSecte.DISCIPLE_INTERNE && (
                              <>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Royaume de cultivation: Fondation {estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.FONDATION) ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Points de contribution: 300 {personnage.appartenanceSecte && personnage.appartenanceSecte.pointsContribution >= 300 ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                              </>
                            )}
                            {rangActuel === RangSecte.DISCIPLE_PRINCIPAL && (
                              <>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Royaume de cultivation: Core d'Or {estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.CORE_OR) ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Points de contribution: 1000 {personnage.appartenanceSecte && personnage.appartenanceSecte.pointsContribution >= 1000 ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                              </>
                            )}
                            {rangActuel === RangSecte.DOYEN && (
                              <>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Royaume de cultivation: Âme Naissante {estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.NASCENT_SOUL) ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Points de contribution: 3000 {personnage.appartenanceSecte && personnage.appartenanceSecte.pointsContribution >= 3000 ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                              </>
                            )}
                            {rangActuel === RangSecte.ANCIEN && (
                              <>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Royaume de cultivation: Transcendance {estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.TRANSCENDANCE) ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Points de contribution: 10000 {personnage.appartenanceSecte && personnage.appartenanceSecte.pointsContribution >= 10000 ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                              </>
                            )}
                            {rangActuel === RangSecte.GRAND_ANCIEN && (
                              <>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Royaume de cultivation: Saint Martial {estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.SAINT_MARTIAL) ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                                <Box component="li">
                                  <Typography variant="caption">
                                    Points de contribution: 30000 {personnage.appartenanceSecte && personnage.appartenanceSecte.pointsContribution >= 30000 ? '✅' : '❌'}
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : (
            renderCombatInterface()
          )}
        </>
      )}
      
      {/* Boîte de dialogue de promotion */}
      <Dialog open={promotion} onClose={fermerPromotion}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowUpwardIcon sx={{ mr: 1, color: '#ffab40' }} />
            Promotion de Rang
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Félicitations ! Vous avez prouvé votre valeur et avez été promu au rang de {personnage.appartenanceSecte?.rang}.
          </Typography>
          <Typography variant="body2">
            Ce nouveau rang vous donne accès à de nouvelles techniques et ressources au sein de votre secte.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerPromotion} color="primary">
            Continuer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CombatMenu; 