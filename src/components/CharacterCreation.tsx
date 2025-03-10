import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Divider, 
  LinearProgress,
  Chip,
  Tooltip,
  SelectChangeEvent,
  Paper,
  Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// Ces types sont utilisés dans le code, même s'ils ne sont pas directement référencés
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { 
  Personnage, 
  Genre, 
  Race, 
  Origine, 
  Stats, 
  genererStatsAleatoires, 
  genererRaceAleatoire, 
  genererOrigineAleatoire,
  genererID,
  getRaceInfo,
  getOrigineInfo,
  getRareteColor,
  Rarete,
  RoyaumeCultivation,
  NiveauPercee,
  QI_REQUIS_PERCEE,
  getNomCompletCultivation,
  genererAgeInitial,
  calculerEsperanceVie
} from '../models/types';

// Composant pour afficher une statistique avec une barre de progression
const StatDisplay = ({ nom, valeur }: { nom: string, valeur: number }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{nom}</Typography>
        <Typography variant="body2" fontWeight="bold">{valeur}</Typography>
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
    </Box>
  );
};

// Fonction pour obtenir la couleur en fonction de la valeur de la statistique
const getStatColor = (value: number): string => {
  if (value <= 3) return '#e74c3c'; // Faible - rouge
  if (value <= 6) return '#f1c40f'; // Moyen - jaune
  if (value <= 8) return '#2ecc71'; // Bon - vert
  return '#9b59b6'; // Excellent - violet
};

// Composant pour afficher un badge de rareté
const RareteBadge = ({ rarete }: { rarete: Rarete }) => {
  // Définir les styles en fonction de la rareté
  let styles = {
    backgroundColor: getRareteColor(rarete),
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold' as const,
    fontSize: '0.7rem',
    boxShadow: 'none',
    animation: 'none',
    border: 'none'
  };

  // Ajouter des effets visuels pour les raretés élevées
  if (rarete === Rarete.EPIQUE) {
    styles = {
      ...styles,
      boxShadow: '0 0 5px 2px rgba(156, 39, 176, 0.5)',
      animation: 'pulse 2s infinite'
    };
  } else if (rarete === Rarete.LEGENDAIRE) {
    styles = {
      ...styles,
      boxShadow: '0 0 8px 3px rgba(255, 152, 0, 0.7)',
      animation: 'pulse 1.5s infinite',
      border: '1px solid gold'
    };
  } else if (rarete === Rarete.MYTHIQUE) {
    styles = {
      ...styles,
      boxShadow: '0 0 12px 4px rgba(244, 67, 54, 0.8)',
      animation: 'pulse 1s infinite, float 3s infinite',
      border: '1px solid white'
    };
  }

  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        p: 0.5, 
        borderBottomLeftRadius: '4px',
        ...styles
      }}
    >
      {rarete}
    </Box>
  );
};

const CharacterCreation: React.FC = () => {
  const navigate = useNavigate();
  
  // État pour le personnage
  const [personnage, setPersonnage] = useState<Personnage>({
    id: genererID(),
    nom: '',
    genre: Genre.MASCULIN,
    race: genererRaceAleatoire(),
    origine: genererOrigineAleatoire(),
    stats: genererStatsAleatoires(),
    pointsQi: 0,
    pointsQiTotal: 0,
    royaumeCultivation: RoyaumeCultivation.MORTEL,
    niveauPercee: NiveauPercee.PREMIER,
    qiRequis: QI_REQUIS_PERCEE[RoyaumeCultivation.MORTEL][NiveauPercee.INTERMEDIAIRE],
    age: genererAgeInitial(),
    dateNaissance: Date.now(),
    dernierTempsJeu: Date.now(),
    tempsJeuTotal: 0
  });

  // État pour le nombre de relances restantes
  const [relancesRestantes, setRelancesRestantes] = useState<number>(3);
  
  // État pour suivre ce qui a été relancé
  const [statsRelancees, setStatsRelancees] = useState<boolean>(false);
  const [raceRelancee, setRaceRelancee] = useState<boolean>(false);
  const [origineRelancee, setOrigineRelancee] = useState<boolean>(false);

  // Fonction pour relancer les statistiques
  const relancerStats = () => {
    if (relancesRestantes > 0) {
      setPersonnage({
        ...personnage,
        stats: genererStatsAleatoires()
      });
      setRelancesRestantes(relancesRestantes - 1);
      setStatsRelancees(true);
    }
  };

  // Fonction pour relancer la race
  const relancerRace = () => {
    if (relancesRestantes > 0) {
      const nouvelleRace = genererRaceAleatoire();
      setPersonnage({
        ...personnage,
        race: nouvelleRace,
        age: genererAgeInitial() // Générer un nouvel âge initial car la race a changé
      });
      setRelancesRestantes(relancesRestantes - 1);
      setRaceRelancee(true);
    }
  };

  // Fonction pour relancer l'origine
  const relancerOrigine = () => {
    if (relancesRestantes > 0) {
      setPersonnage({
        ...personnage,
        origine: genererOrigineAleatoire()
      });
      setRelancesRestantes(relancesRestantes - 1);
      setOrigineRelancee(true);
    }
  };

  // Fonction pour gérer le changement de nom
  const handleNomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonnage({
      ...personnage,
      nom: event.target.value
    });
  };

  // Fonction pour gérer le changement de genre
  const handleGenreChange = (event: SelectChangeEvent) => {
    setPersonnage({
      ...personnage,
      genre: event.target.value as Genre
    });
  };

  // Fonction pour créer le personnage
  const creerPersonnage = () => {
    if (!personnage.nom) {
      alert("Veuillez entrer un nom pour votre personnage.");
      return;
    }

    try {
      // Créer un objet de sauvegarde contenant toutes les données
      const sauvegarde = {
        personnage: personnage,
        tempsMeditationCumule: 0,
        derniereAnneeEvenement: 0,
        historiqueEvenements: []
      };
      
      // Convertir l'objet de sauvegarde en JSON
      const sauvegardeJSON = JSON.stringify(sauvegarde);
      
      // Encoder le JSON en base64
      const sauvegardeBase64 = btoa(sauvegardeJSON);
      
      // Stocker dans le localStorage
      localStorage.setItem('wuxiaWorldSauvegarde', sauvegardeBase64);
      
      // Rediriger vers la page du jeu
      navigate('/game');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du personnage:", error);
      alert("Une erreur est survenue lors de la création du personnage. Veuillez réessayer.");
    }
  };

  // Calcul du total des statistiques
  const totalStats = Object.values(personnage.stats).reduce((a, b) => a + b, 0);
  const moyenneStats = totalStats / 8;

  // Obtenir les informations de race et d'origine
  const raceInfo = getRaceInfo(personnage.race);
  const origineInfo = getOrigineInfo(personnage.origine);

  // Obtenir le nom complet du niveau de cultivation
  const nomCultivation = getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee);

  // Calcul de l'espérance de vie
  const esperanceVie = calculerEsperanceVie(personnage.race, personnage.royaumeCultivation);

  return (
    <Card sx={{ maxWidth: 800, margin: '0 auto', backgroundColor: 'background.paper' }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontFamily: "'Cinzel', serif" }}>
          Création de Personnage
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
          Façonnez votre destin dans le monde des arts martiaux
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations Personnelles
            </Typography>
            
            <TextField
              fullWidth
              label="Nom"
              variant="outlined"
              value={personnage.nom}
              onChange={handleNomChange}
              margin="normal"
              required
              helperText="Choisissez un nom digne de votre légende"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="genre-label">Genre</InputLabel>
              <Select
                labelId="genre-label"
                value={personnage.genre}
                label="Genre"
                onChange={handleGenreChange}
              >
                {Object.values(Genre).map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 3, mb: 2 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${getRareteColor(raceInfo.rarete)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 10px 2px ${getRareteColor(raceInfo.rarete)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <RareteBadge rarete={raceInfo.rarete} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Race: <strong>{personnage.race}</strong></Typography>
                  <Tooltip title={raceRelancee ? "Vous avez déjà relancé la race" : "Relancer la race"}>
                    <span>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={relancerRace} 
                        disabled={relancesRestantes === 0}
                        color="secondary"
                      >
                        Relancer
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {raceInfo.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Espérance de vie: <strong>{esperanceVie} ans</strong>
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${getRareteColor(origineInfo.rarete)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 10px 2px ${getRareteColor(origineInfo.rarete)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <RareteBadge rarete={origineInfo.rarete} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Origine: <strong>{personnage.origine}</strong></Typography>
                  <Tooltip title={origineRelancee ? "Vous avez déjà relancé l'origine" : "Relancer l'origine"}>
                    <span>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={relancerOrigine} 
                        disabled={relancesRestantes === 0}
                        color="secondary"
                      >
                        Relancer
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {origineInfo.description}
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Niveau de Cultivation: <strong>{personnage.royaumeCultivation} - {nomCultivation}</strong>
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={0} 
                sx={{ height: 8, borderRadius: 4 }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Points de Qi: 0 / {personnage.qiRequis} pour la prochaine percée
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Âge: <strong>{personnage.age} ans</strong>
              </Typography>
            </Box>
          </Grid>
          
          {/* Statistiques */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Statistiques
              </Typography>
              <Box>
                <Tooltip title={statsRelancees ? "Vous avez déjà relancé les statistiques" : "Relancer toutes les statistiques"}>
                  <span>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={relancerStats} 
                      disabled={relancesRestantes === 0}
                      color="secondary"
                      sx={{ mr: 1 }}
                    >
                      Relancer
                    </Button>
                  </span>
                </Tooltip>
                <Chip 
                  label={`Moyenne: ${moyenneStats.toFixed(1)}`} 
                  color={moyenneStats >= 7 ? "success" : moyenneStats >= 5 ? "warning" : "error"}
                  size="small"
                />
              </Box>
            </Box>
            
            <StatDisplay nom="Force" valeur={personnage.stats.force} />
            <StatDisplay nom="Agilité" valeur={personnage.stats.agilite} />
            <StatDisplay nom="Constitution" valeur={personnage.stats.constitution} />
            <StatDisplay nom="Intelligence" valeur={personnage.stats.intelligence} />
            <StatDisplay nom="Perception" valeur={personnage.stats.perception} />
            <StatDisplay nom="Charisme" valeur={personnage.stats.charisme} />
            <StatDisplay nom="Chance" valeur={personnage.stats.chance} />
            <StatDisplay nom="Qi" valeur={personnage.stats.qi} />
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Relances restantes: <strong>{relancesRestantes}</strong>
              </Typography>
              <Tooltip title="Vous pouvez relancer les statistiques, la race ou l'origine jusqu'à 3 fois au total">
                <span>
                  <Chip 
                    label={`${3 - relancesRestantes}/3 utilisées`} 
                    color={relancesRestantes > 0 ? "primary" : "error"}
                    size="small"
                  />
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={creerPersonnage}
            disabled={!personnage.nom}
            sx={{ 
              minWidth: 200,
              py: 1.5,
              boxShadow: '0 4px 20px rgba(230, 57, 70, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 25px rgba(230, 57, 70, 0.6)',
              }
            }}
          >
            Commencer l'Aventure
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CharacterCreation; 