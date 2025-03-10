import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  LinearProgress, 
  Button, 
  Card, 
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Personnage, 
  getRaceInfo, 
  getOrigineInfo, 
  getRareteColor, 
  getNomCompletCultivation, 
  getDescriptionRoyaume,
  getProchainNiveau,
  getRoyaumeColor,
  calculerEsperanceVie,
  calculerAgeActuel,
  formaterTempsJeu,
  TEMPS_REEL_PAR_ANNEE_JEU
} from '../models/types';

const GameScreen: React.FC = () => {
  const [personnage, setPersonnage] = useState<Personnage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meditationActive, setMeditationActive] = useState<boolean>(false);
  const [gainQiParSeconde, setGainQiParSeconde] = useState<number>(0);
  const [openPerceeDialog, setOpenPerceeDialog] = useState<boolean>(false);
  const [tempsTotalMeditation, setTempsTotalMeditation] = useState<number>(0);
  const [ageActuel, setAgeActuel] = useState<number>(0);
  const [esperanceVie, setEsperanceVie] = useState<number>(0);
  const [tempsJeuFormate, setTempsJeuFormate] = useState<string>("00:00:00");
  const [openMortDialog, setOpenMortDialog] = useState<boolean>(false);
  const [openResetDialog, setOpenResetDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  
  // Référence pour le timer d'âge
  const ageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tempsJeuTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sauvegardeAutoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le personnage depuis le localStorage
  useEffect(() => {
    try {
      const personnageBase64 = localStorage.getItem('personnage');
      if (!personnageBase64) {
        setError("Aucun personnage trouvé. Veuillez en créer un nouveau.");
        setLoading(false);
        return;
      }

      // Décoder le base64 en JSON
      const personnageJSON = atob(personnageBase64);
      const personnageData = JSON.parse(personnageJSON);
      
      // Mettre à jour le dernier temps de jeu
      personnageData.dernierTempsJeu = Date.now();
      
      setPersonnage(personnageData);
      
      // Calculer l'âge actuel et l'espérance de vie
      const ageCalcule = calculerAgeActuel(personnageData);
      setAgeActuel(ageCalcule);
      
      const esperanceVieCalculee = calculerEsperanceVie(personnageData.race, personnageData.royaumeCultivation);
      setEsperanceVie(esperanceVieCalculee);
      
      // Formater le temps de jeu total
      setTempsJeuFormate(formaterTempsJeu(personnageData.tempsJeuTotal));
      
      // Calculer le gain de Qi par seconde basé sur les statistiques
      const qiBase = personnageData.stats.qi;
      const intelligenceBonus = personnageData.stats.intelligence * 0.08;
      const perceptionBonus = personnageData.stats.perception * 0.04;
      const gainCalcule = Math.max(1, Math.floor(qiBase * (1 + (intelligenceBonus + perceptionBonus) / 25)));
      setGainQiParSeconde(gainCalcule);
      
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement du personnage. Veuillez en créer un nouveau.");
      setLoading(false);
      console.error("Erreur lors du chargement du personnage:", err);
    }
  }, []);

  // Sauvegarder le personnage dans le localStorage
  const sauvegarderPersonnage = useCallback((personnageToSave?: Personnage | null) => {
    try {
      // Utiliser le personnage passé en paramètre ou celui du state
      const personnageActuel = personnageToSave || personnage;
      
      if (!personnageActuel) return false;
      
      // Mettre à jour le dernier temps de jeu
      const personnageAJour = {
        ...personnageActuel,
        dernierTempsJeu: Date.now(),
        age: ageActuel,
        tempsJeuTotal: personnageActuel.tempsJeuTotal + 10 // Ajouter 10 secondes (intervalle de sauvegarde)
      };
      
      // Convertir en JSON puis en base64
      const personnageJSON = JSON.stringify(personnageAJour);
      const personnageBase64 = btoa(personnageJSON);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('personnage', personnageBase64);
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      return false;
    }
  }, [personnage, ageActuel]);

  // Fonction pour sauvegarder manuellement
  const sauvegarderManuellement = () => {
    const resultat = sauvegarderPersonnage(personnage);
    if (resultat) {
      setSnackbarMessage("Personnage sauvegardé avec succès !");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Erreur lors de la sauvegarde !");
      setSnackbarOpen(true);
    }
  };

  // Mettre en place la sauvegarde automatique toutes les 5 secondes
  useEffect(() => {
    if (personnage) {
      // Démarrer le timer pour la sauvegarde automatique
      sauvegardeAutoTimerRef.current = setInterval(() => {
        const resultat = sauvegarderPersonnage(personnage);
        if (resultat) {
          console.log("Sauvegarde automatique effectuée");
        }
      }, 5000); // Sauvegarde toutes les 5 secondes
    }
    
    return () => {
      // Nettoyer le timer de sauvegarde automatique
      if (sauvegardeAutoTimerRef.current) {
        clearInterval(sauvegardeAutoTimerRef.current);
        sauvegardeAutoTimerRef.current = null;
      }
    };
  }, [personnage, sauvegarderPersonnage]);

  // Gérer le vieillissement du personnage
  useEffect(() => {
    if (personnage) {
      // Démarrer le timer pour mettre à jour l'âge
      ageTimerRef.current = setInterval(() => {
        const nouvelAge = calculerAgeActuel(personnage);
        setAgeActuel(nouvelAge);
        
        // Vérifier si le personnage a dépassé son espérance de vie
        if (nouvelAge >= esperanceVie) {
          setMeditationActive(false);
          setOpenMortDialog(true);
          
          // Arrêter le timer
          if (ageTimerRef.current) {
            clearInterval(ageTimerRef.current);
            ageTimerRef.current = null;
          }
        }
      }, TEMPS_REEL_PAR_ANNEE_JEU * 1000); // Mettre à jour l'âge selon le temps réel par année de jeu
      
      // Démarrer le timer pour mettre à jour le temps de jeu
      tempsJeuTimerRef.current = setInterval(() => {
        if (personnage) {
          setPersonnage(prev => {
            if (!prev) return prev;
            const nouveauTempsJeuTotal = prev.tempsJeuTotal + 1;
            setTempsJeuFormate(formaterTempsJeu(nouveauTempsJeuTotal));
            return {
              ...prev,
              tempsJeuTotal: nouveauTempsJeuTotal
            };
          });
        }
      }, 1000); // Mettre à jour le temps de jeu chaque seconde
    }
    
    return () => {
      // Nettoyer les timers
      if (ageTimerRef.current) {
        clearInterval(ageTimerRef.current);
        ageTimerRef.current = null;
      }
      
      if (tempsJeuTimerRef.current) {
        clearInterval(tempsJeuTimerRef.current);
        tempsJeuTimerRef.current = null;
      }
    };
  }, [personnage, esperanceVie]);

  // Effet pour la méditation
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (meditationActive && personnage) {
      intervalId = setInterval(() => {
        setPersonnage(prev => {
          if (!prev) return prev;
          
          const nouveauxPointsQi = prev.pointsQi + gainQiParSeconde;
          const nouveauxPointsQiTotal = prev.pointsQiTotal + gainQiParSeconde;
          
          // Vérifier si une percée est possible
          const perceeAtteinte = nouveauxPointsQi >= prev.qiRequis;
          
          if (perceeAtteinte) {
            setOpenPerceeDialog(true);
            setMeditationActive(false);
            // Jouer un son ou ajouter une animation ici si nécessaire
          }
          
          // Mettre à jour les points de Qi, même si une percée est atteinte
          // La fonction effectuerPercee s'occupera de gérer les points excédentaires
          return {
            ...prev,
            pointsQi: nouveauxPointsQi,
            pointsQiTotal: nouveauxPointsQiTotal
          };
        });
        
        // Incrémenter le temps total de méditation
        setTempsTotalMeditation(prev => prev + 1);
      }, 1000); // Remis à 1 seconde pour une mise à jour plus fluide
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [meditationActive, personnage, gainQiParSeconde]);

  // Effectuer une percée
  const effectuerPercee = () => {
    if (!personnage) return;
    
    const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
    
    // Calculer les points de Qi excédentaires après la percée
    const pointsQiExcedentaires = Math.max(0, personnage.pointsQi - personnage.qiRequis);
    
    const nouveauPersonnage = {
      ...personnage,
      pointsQi: pointsQiExcedentaires, // Conserver uniquement les points excédentaires
      royaumeCultivation: prochainNiveau.royaume,
      niveauPercee: prochainNiveau.niveau,
      qiRequis: prochainNiveau.qiRequis
    };
    
    // Mettre à jour l'état du personnage
    setPersonnage(nouveauPersonnage);
    
    // Recalculer l'espérance de vie après la percée
    const nouvelleEsperanceVie = calculerEsperanceVie(nouveauPersonnage.race, nouveauPersonnage.royaumeCultivation);
    setEsperanceVie(nouvelleEsperanceVie);
    
    // Afficher un message de succès avec les points excédentaires si applicable
    const messageExcedent = pointsQiExcedentaires > 0 
      ? ` ${pointsQiExcedentaires.toLocaleString()} points de Qi excédentaires conservés.` 
      : '';
    
    setSnackbarMessage(`Percée réussie ! Vous avez atteint ${getNomCompletCultivation(prochainNiveau.royaume, prochainNiveau.niveau)}.${messageExcedent}`);
    setSnackbarOpen(true);
    
    setOpenPerceeDialog(false);
    sauvegarderPersonnage(nouveauPersonnage);
  };

  // Activer/désactiver la méditation
  const toggleMeditation = () => {
    const nouvelEtat = !meditationActive;
    setMeditationActive(nouvelEtat);
    console.log(`Méditation ${nouvelEtat ? 'activée' : 'désactivée'}`);
    
    // Afficher un message à l'utilisateur
    setSnackbarMessage(`Méditation ${nouvelEtat ? 'activée' : 'désactivée'}`);
    setSnackbarOpen(true);
  };

  // Réinitialiser le personnage (après la mort)
  const reinitialiserPersonnage = () => {
    localStorage.removeItem('personnage');
    window.location.href = '/';
  };

  // Ouvrir la boîte de dialogue de confirmation pour la réinitialisation
  const confirmerReinitialisation = () => {
    setOpenResetDialog(true);
  };

  const retourCreation = () => {
    // Rediriger vers la page de création de personnage
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Chargement de votre aventure...</Typography>
      </Box>
    );
  }

  if (error || !personnage) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 2 }}>
        <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" color="primary" onClick={retourCreation}>
          Créer un nouveau personnage
        </Button>
      </Box>
    );
  }

  const raceInfo = getRaceInfo(personnage.race);
  const origineInfo = getOrigineInfo(personnage.origine);
  const nomCultivation = getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee);
  const descriptionRoyaume = getDescriptionRoyaume(personnage.royaumeCultivation);
  const pourcentageProgression = (personnage.pointsQi / personnage.qiRequis) * 100;
  const pourcentageAge = (ageActuel / esperanceVie) * 100;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontFamily: "'Cinzel', serif" }}>
          <span className="text-primary">Wuxia</span> <span className="text-accent">Idle</span>
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={sauvegarderManuellement}
            sx={{ mr: 1 }}
          >
            💾 Sauvegarder
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmerReinitialisation}
          >
            🔄 Réinitialiser
          </Button>
        </Box>
      </Box>
      
      {ageActuel >= esperanceVie * 0.9 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Votre personnage approche de la fin de sa vie ! Atteignez un royaume de cultivation supérieur pour prolonger votre espérance de vie.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Informations du personnage */}
        <Grid item xs={12} md={4}>
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
                  {personnage.pointsQi} / {personnage.qiRequis}
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
                Points de Qi Total: <strong>{personnage.pointsQiTotal}</strong>
              </Typography>
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Statistiques</Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Force</Typography>
                <Typography variant="body1">{personnage.stats.force}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Agilité</Typography>
                <Typography variant="body1">{personnage.stats.agilite}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Constitution</Typography>
                <Typography variant="body1">{personnage.stats.constitution}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Intelligence</Typography>
                <Typography variant="body1">{personnage.stats.intelligence}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Perception</Typography>
                <Typography variant="body1">{personnage.stats.perception}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Charisme</Typography>
                <Typography variant="body1">{personnage.stats.charisme}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Chance</Typography>
                <Typography variant="body1">{personnage.stats.chance}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Qi</Typography>
                <Typography variant="body1">{personnage.stats.qi}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Zone de jeu principale */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              backgroundColor: 'background.paper', 
              minHeight: '300px',
              border: meditationActive ? `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}` : 'none',
              boxShadow: meditationActive ? `0 0 15px ${getRoyaumeColor(personnage.royaumeCultivation)}` : 'none',
              transition: 'all 0.5s ease'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Cultivation - {personnage.royaumeCultivation}</Typography>
              <Chip 
                label={`+${gainQiParSeconde} Qi/s`} 
                color="primary" 
                size="small"
                sx={{ 
                  animation: meditationActive ? 'pulse 2s infinite' : 'none'
                }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {descriptionRoyaume}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mt: 4,
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
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  +{gainQiParSeconde} Qi
                </Box>
              )}
              
              <Button 
                variant="contained" 
                color={meditationActive ? "secondary" : "primary"}
                size="large"
                className={meditationActive ? "animate-pulse" : ""}
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
                  animation: meditationActive ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 }
                  }
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
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Méditation en cours... {Math.floor(tempsTotalMeditation / 60)}:{(tempsTotalMeditation % 60).toString().padStart(2, '0')}
                </Typography>
              )}
            </Box>
          </Paper>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Quêtes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aucune quête disponible pour le moment.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Inventaire</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Votre inventaire est vide.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Dialogue de percée */}
      <Dialog
        open={openPerceeDialog}
        onClose={() => setOpenPerceeDialog(false)}
        aria-labelledby="percee-dialog-title"
        aria-describedby="percee-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            border: `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}`,
            boxShadow: `0 0 20px ${getRoyaumeColor(personnage.royaumeCultivation)}`
          }
        }}
      >
        <DialogTitle id="percee-dialog-title" sx={{ textAlign: 'center', fontFamily: "'Cinzel', serif" }}>
          <Typography variant="h5" component="div" sx={{ color: getRoyaumeColor(personnage.royaumeCultivation) }}>
            Percée Atteinte !
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="percee-dialog-description" sx={{ mb: 2 }}>
            Vous avez accumulé suffisamment de Qi pour atteindre un nouveau niveau de cultivation.
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            border: `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}`, 
            borderRadius: 1,
            mb: 2,
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <Typography variant="body1" gutterBottom>
              Niveau actuel: <strong>{personnage.royaumeCultivation} - {nomCultivation}</strong>
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              Points de Qi accumulés: <strong>{personnage.pointsQi.toLocaleString()}</strong> / {personnage.qiRequis.toLocaleString()}
            </Typography>
            
            {(() => {
              const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
              const prochainNomComplet = getNomCompletCultivation(prochainNiveau.royaume, prochainNiveau.niveau);
              const nouvelleEsperanceVie = calculerEsperanceVie(personnage.race, prochainNiveau.royaume);
              const pointsQiExcedentaires = Math.max(0, personnage.pointsQi - personnage.qiRequis);
              
              return (
                <>
                  <Typography variant="body1" sx={{ color: getRoyaumeColor(prochainNiveau.royaume) }}>
                    Prochain niveau: <strong>{prochainNiveau.royaume} - {prochainNomComplet}</strong>
                  </Typography>
                  
                  {pointsQiExcedentaires > 0 && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Points de Qi excédentaires conservés: <strong>{pointsQiExcedentaires.toLocaleString()}</strong>
                    </Typography>
                  )}
                  
                  {nouvelleEsperanceVie > esperanceVie && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Espérance de vie: <strong>{esperanceVie} → {nouvelleEsperanceVie} ans</strong> 
                      <span style={{ color: '#2ecc71' }}> (+{nouvelleEsperanceVie - esperanceVie})</span>
                    </Typography>
                  )}
                </>
              );
            })()}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Effectuer une percée vous permettra d'accéder à un niveau de cultivation supérieur. Les points de Qi excédentaires au-delà du seuil requis seront conservés.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPerceeDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button 
            onClick={effectuerPercee} 
            variant="contained" 
            color="primary"
            sx={{ 
              boxShadow: `0 0 10px ${getRoyaumeColor(personnage.royaumeCultivation)}`,
            }}
          >
            Effectuer la Percée
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de mort */}
      <Dialog
        open={openMortDialog}
        aria-labelledby="mort-dialog-title"
        aria-describedby="mort-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            border: '1px solid #e74c3c',
            boxShadow: '0 0 20px #e74c3c'
          }
        }}
      >
        <DialogTitle id="mort-dialog-title" sx={{ textAlign: 'center', fontFamily: "'Cinzel', serif" }}>
          <Typography variant="h5" component="div" sx={{ color: '#e74c3c' }}>
            Votre Personnage Est Mort
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="mort-dialog-description" sx={{ mb: 2 }}>
            {personnage.nom} a atteint la fin de sa vie à l'âge de {ageActuel} ans. Son voyage sur le chemin de l'immortalité s'achève ici.
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e74c3c', 
            borderRadius: 1,
            mb: 2,
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <Typography variant="body1" gutterBottom>
              Niveau final: <strong>{personnage.royaumeCultivation} - {nomCultivation}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Points de Qi accumulés: <strong>{personnage.pointsQiTotal}</strong>
            </Typography>
            <Typography variant="body1">
              Temps de jeu total: <strong>{tempsJeuFormate}</strong>
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Vous devez créer un nouveau personnage pour continuer votre aventure.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={reinitialiserPersonnage} 
            variant="contained" 
            color="error"
          >
            Créer un Nouveau Personnage
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de réinitialisation */}
      <Dialog
        open={openResetDialog}
        onClose={() => setOpenResetDialog(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Confirmer la réinitialisation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Êtes-vous sûr de vouloir réinitialiser votre personnage ? Cette action est irréversible et toutes vos données seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={reinitialiserPersonnage} color="error" variant="contained">
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default GameScreen; 