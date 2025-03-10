import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton
} from '@mui/material';
import { 
  Personnage, 
  getRaceInfo, 
  getOrigineInfo, 
  getRareteColor, 
  getNomCompletCultivation, 
  getDescriptionRoyaume,
  getProchainNiveau,
  getRoyaumeColor
} from '../models/types';

const GameScreen: React.FC = () => {
  const [personnage, setPersonnage] = useState<Personnage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meditationActive, setMeditationActive] = useState<boolean>(false);
  const [gainQiParSeconde, setGainQiParSeconde] = useState<number>(0);
  const [openPerceeDialog, setOpenPerceeDialog] = useState<boolean>(false);
  const [tempsTotalMeditation, setTempsTotalMeditation] = useState<number>(0);

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
      setPersonnage(personnageData);
      
      // Calculer le gain de Qi par seconde basé sur les statistiques
      const qiBase = personnageData.stats.qi;
      const intelligenceBonus = personnageData.stats.intelligence * 0.2;
      const perceptionBonus = personnageData.stats.perception * 0.1;
      const gainCalcule = Math.max(1, Math.floor(qiBase * (1 + (intelligenceBonus + perceptionBonus) / 10)));
      setGainQiParSeconde(gainCalcule);
      
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement du personnage. Veuillez en créer un nouveau.");
      setLoading(false);
      console.error("Erreur lors du chargement du personnage:", err);
    }
  }, []);

  // Sauvegarder le personnage dans le localStorage
  const sauvegarderPersonnage = useCallback(() => {
    if (personnage) {
      try {
        const personnageJSON = JSON.stringify(personnage);
        const personnageBase64 = btoa(personnageJSON);
        localStorage.setItem('personnage', personnageBase64);
      } catch (err) {
        console.error("Erreur lors de la sauvegarde du personnage:", err);
      }
    }
  }, [personnage]);

  // Gérer la méditation pour gagner des points de Qi
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
          }
          
          return {
            ...prev,
            pointsQi: perceeAtteinte ? prev.pointsQi : nouveauxPointsQi,
            pointsQiTotal: nouveauxPointsQiTotal
          };
        });
        
        setTempsTotalMeditation(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [meditationActive, personnage, gainQiParSeconde]);

  // Sauvegarder automatiquement toutes les 10 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      sauvegarderPersonnage();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [sauvegarderPersonnage]);

  // Effectuer une percée
  const effectuerPercee = () => {
    if (!personnage) return;
    
    const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
    
    setPersonnage({
      ...personnage,
      pointsQi: 0,
      royaumeCultivation: prochainNiveau.royaume,
      niveauPercee: prochainNiveau.niveau,
      qiRequis: prochainNiveau.qiRequis
    });
    
    setOpenPerceeDialog(false);
    sauvegarderPersonnage();
  };

  // Basculer l'état de méditation
  const toggleMeditation = () => {
    setMeditationActive(!meditationActive);
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

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily: "'Cinzel', serif" }}>
        <span className="text-primary">Wuxia</span> <span className="text-accent">Idle</span>
      </Typography>
      
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
                  }
                }}
              >
                {meditationActive ? "Arrêter la Méditation" : "Méditer"}
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
            
            {(() => {
              const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
              const prochainNomComplet = getNomCompletCultivation(prochainNiveau.royaume, prochainNiveau.niveau);
              
              return (
                <Typography variant="body1" sx={{ color: getRoyaumeColor(prochainNiveau.royaume) }}>
                  Prochain niveau: <strong>{prochainNiveau.royaume} - {prochainNomComplet}</strong>
                </Typography>
              );
            })()}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Effectuer une percée réinitialisera vos points de Qi actuels, mais vous permettra d'accéder à de nouvelles techniques et capacités.
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
    </Box>
  );
};

export default GameScreen; 