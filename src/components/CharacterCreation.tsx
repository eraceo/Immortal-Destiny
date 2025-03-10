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
  calculerEsperanceVie,
  genererAffinitesElementaires,
  genererTalentCultivation,
  TypeSecte,
  RangSecte,
  ElementCultivation,
  SECTES,
  AppartenanceSecte
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
    tempsJeuTotal: 0,
    pierresSpirituelles: 100, // Initialisation avec 100 pierres spirituelles
    // Nouvelles propriétés pour le système de sectes
    appartenanceSecte: null,
    techniquesApprises: [],
    affiniteElements: genererAffinitesElementaires(),
    talentCultivation: genererTalentCultivation()
  });
  
  // Fonction pour relancer tous les éléments du personnage
  const relancerTout = () => {
    const nouvelleRace = genererRaceAleatoire();
    setPersonnage({
      ...personnage,
      race: nouvelleRace,
      origine: genererOrigineAleatoire(),
      stats: genererStatsAleatoires(),
      age: genererAgeInitial(), // Générer un nouvel âge initial car la race a changé
      affiniteElements: genererAffinitesElementaires(),
      talentCultivation: genererTalentCultivation()
    });
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
      // S'assurer que le rang est toujours DISCIPLE_EXTERNE, quelle que soit la secte choisie
      let appartenanceSecteFinale = personnage.appartenanceSecte;
      if (appartenanceSecteFinale) {
        appartenanceSecteFinale = {
          ...appartenanceSecteFinale,
          rang: RangSecte.DISCIPLE_EXTERNE
        };
      }

      // Créer le personnage avec les valeurs actuelles
      const nouveauPersonnage: Personnage = {
        id: genererID(),
        nom: personnage.nom,
        genre: personnage.genre,
        race: personnage.race,
        origine: personnage.origine,
        stats: personnage.stats,
        pointsQi: 0,
        pointsQiTotal: 0,
        royaumeCultivation: personnage.royaumeCultivation,
        niveauPercee: personnage.niveauPercee,
        qiRequis: personnage.qiRequis,
        age: personnage.age,
        dateNaissance: Date.now(),
        dernierTempsJeu: Date.now(),
        tempsJeuTotal: 0,
        pierresSpirituelles: 0,
        // Nouvelles propriétés pour le système de sectes
        appartenanceSecte: appartenanceSecteFinale,
        techniquesApprises: personnage.techniquesApprises,
        affiniteElements: personnage.affiniteElements,
        talentCultivation: personnage.talentCultivation
      };
      
      // Créer un objet de sauvegarde contenant toutes les données
      const sauvegarde = {
        personnage: nouveauPersonnage,
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

  // Composant pour afficher les affinités élémentaires
  const renderAffiniteElements = () => {
    if (!personnage.affiniteElements) {
      // Générer les affinités si elles n'existent pas encore
      const affinites = genererAffinitesElementaires();
      setPersonnage({
        ...personnage,
        affiniteElements: affinites
      });
      return null;
    }

    // Trouver les 3 meilleures affinités
    const affinitesTriees = Object.entries(personnage.affiniteElements)
      .sort(([, valeurA], [, valeurB]) => valeurB - valeurA)
      .slice(0, 3);

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Affinités Élémentaires
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Vos affinités naturelles avec les éléments déterminent votre potentiel dans différentes techniques de cultivation.
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {affinitesTriees.map(([element, valeur]) => (
            <Grid item xs={4} key={element}>
              <Paper 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${getElementColor(element as ElementCultivation)}22, ${getElementColor(element as ElementCultivation)}44)`,
                  border: `1px solid ${getElementColor(element as ElementCultivation)}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle2">{element}</Typography>
                <Typography variant="h6">{valeur}%</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Composant pour afficher le talent de cultivation
  const renderTalentCultivation = () => {
    if (!personnage.talentCultivation) {
      // Générer le talent s'il n'existe pas encore
      const talent = genererTalentCultivation();
      setPersonnage({
        ...personnage,
        talentCultivation: talent
      });
      return null;
    }

    // Déterminer la qualité du talent
    let qualite = "Ordinaire";
    let couleur = "#f1c40f"; // Jaune
    
    if (personnage.talentCultivation >= 95) {
      qualite = "Transcendant";
      couleur = "#9b59b6"; // Violet
    } else if (personnage.talentCultivation >= 85) {
      qualite = "Exceptionnel";
      couleur = "#3498db"; // Bleu
    } else if (personnage.talentCultivation >= 70) {
      qualite = "Excellent";
      couleur = "#2ecc71"; // Vert
    } else if (personnage.talentCultivation >= 50) {
      qualite = "Bon";
      couleur = "#f1c40f"; // Jaune
    } else if (personnage.talentCultivation >= 30) {
      qualite = "Moyen";
      couleur = "#e67e22"; // Orange
    } else {
      qualite = "Faible";
      couleur = "#e74c3c"; // Rouge
    }

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Talent de Cultivation
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Votre talent inné détermine votre potentiel de cultivation et les sectes qui vous accepteront.
        </Typography>
        <Paper 
          sx={{ 
            p: 2, 
            mt: 1, 
            textAlign: 'center',
            background: `linear-gradient(135deg, ${couleur}22, ${couleur}44)`,
            border: `1px solid ${couleur}`,
            borderRadius: 2
          }}
        >
          <Typography variant="h5" sx={{ color: couleur, fontWeight: 'bold' }}>
            {qualite}
          </Typography>
          <Typography variant="h4">
            {personnage.talentCultivation}
          </Typography>
        </Paper>
      </Box>
    );
  };

  // Fonction pour obtenir la couleur associée à un élément
  const getElementColor = (element: ElementCultivation): string => {
    switch (element) {
      case ElementCultivation.FEU: return '#e74c3c'; // Rouge
      case ElementCultivation.EAU: return '#3498db'; // Bleu
      case ElementCultivation.BOIS: return '#2ecc71'; // Vert
      case ElementCultivation.METAL: return '#95a5a6'; // Gris
      case ElementCultivation.TERRE: return '#d35400'; // Marron
      case ElementCultivation.FOUDRE: return '#9b59b6'; // Violet
      case ElementCultivation.VENT: return '#1abc9c'; // Turquoise
      case ElementCultivation.GLACE: return '#00cec9'; // Cyan
      case ElementCultivation.LUMIERE: return '#f1c40f'; // Jaune
      case ElementCultivation.OBSCURITE: return '#34495e'; // Bleu foncé
      case ElementCultivation.CHAOS: return '#6c5ce7'; // Indigo
      case ElementCultivation.ESPACE: return '#0984e3'; // Bleu ciel
      case ElementCultivation.TEMPS: return '#fdcb6e'; // Or
      case ElementCultivation.SANG: return '#d63031'; // Rouge sang
      default: return '#bdc3c7'; // Gris clair
    }
  };

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
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={relancerTout}
                startIcon={<span role="img" aria-label="dice">🎲</span>}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #9b59b6 30%, #8e44ad 90%)',
                  boxShadow: '0 3px 5px 2px rgba(142, 68, 173, .3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 10px 4px rgba(142, 68, 173, .4)',
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                  },
                  animation: 'pulse 2s infinite'
                }}
              >
                Relancer Tout
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic' }}>
                Vous pouvez relancer autant de fois que vous le souhaitez pour obtenir le personnage parfait
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Affichage du talent de cultivation */}
        {renderTalentCultivation()}

        {/* Affichage des affinités élémentaires */}
        {renderAffiniteElements()}

        {/* Sélection de secte */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Rejoindre une Secte
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            En fonction de votre talent et de vos affinités, certaines sectes pourraient vous accepter comme disciple.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
            Vous commencerez toujours comme Disciple Externe, quel que soit votre talent. Vous pourrez progresser dans les rangs de la secte au fil de votre aventure.
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {SECTES.filter(secte => {
              // Filtrer les sectes en fonction du talent
              if (secte.rarete === Rarete.RARE && (!personnage.talentCultivation || personnage.talentCultivation < 50)) return false;
              if (secte.rarete === Rarete.EPIQUE && (!personnage.talentCultivation || personnage.talentCultivation < 70)) return false;
              if (secte.rarete === Rarete.LEGENDAIRE && (!personnage.talentCultivation || personnage.talentCultivation < 90)) return false;
              if (secte.rarete === Rarete.MYTHIQUE && (!personnage.talentCultivation || personnage.talentCultivation < 95)) return false;
              
              // Vérifier les stats minimales requises
              let statsOk = true;
              Object.entries(secte.conditionsAdmission.statsMinimales).forEach(([stat, valeurMin]) => {
                if (personnage.stats[stat as keyof Stats] < valeurMin) {
                  statsOk = false;
                }
              });
              
              return statsOk;
            }).map(secte => (
              <Grid item xs={12} sm={6} key={secte.id}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    border: '1px solid #333',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 5px 15px ${getRareteColor(secte.rarete)}66`,
                      borderColor: getRareteColor(secte.rarete)
                    }
                  }}
                  onClick={() => {
                    setPersonnage({
                      ...personnage,
                      appartenanceSecte: {
                        secteId: secte.id,
                        dateAdhesion: Date.now(),
                        rang: RangSecte.DISCIPLE_EXTERNE,
                        pointsContribution: 0,
                        techniquesApprises: [],
                        missionsCompletees: [],
                        ressourcesObtenues: {},
                        relationAnciens: 50
                      }
                    });
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {secte.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Type: {secte.type}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
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
                    Avantages:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={`Qi ×${secte.avantages.multiplicateurQi}`} 
                      size="small" 
                      sx={{ backgroundColor: '#1e1e1e' }} 
                    />
                    {Object.entries(secte.avantages.bonusStats).map(([stat, valeur]) => (
                      <Chip 
                        key={stat}
                        label={`${stat} +${valeur}`} 
                        size="small" 
                        sx={{ backgroundColor: '#1e1e1e' }} 
                      />
                    ))}
                    <Chip 
                      label={`Percée -${secte.avantages.reductionTempsPercee}%`} 
                      size="small" 
                      sx={{ backgroundColor: '#1e1e1e' }} 
                    />
                    <Chip 
                      label={`Longévité ${secte.avantages.bonusLongevite > 0 ? '+' : ''}${secte.avantages.bonusLongevite}%`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#1e1e1e',
                        color: secte.avantages.bonusLongevite > 0 ? '#2ecc71' : '#e74c3c'
                      }} 
                    />
                  </Box>
                  
                  {/* Indicateur de sélection */}
                  {personnage.appartenanceSecte && personnage.appartenanceSecte.secteId === secte.id && (
                    <Box 
                      sx={{ 
                        mt: 2, 
                        p: 1, 
                        borderRadius: 1, 
                        backgroundColor: '#2ecc7144',
                        border: '1px solid #2ecc71',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: '#2ecc71' }}>
                        Secte Sélectionnée
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
            
            {/* Option pour ne rejoindre aucune secte */}
            <Grid item xs={12} sm={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  border: '1px solid #333',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 5px 15px rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={() => {
                  setPersonnage({
                    ...personnage,
                    appartenanceSecte: null
                  });
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Cultivateur Indépendant
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choisissez votre propre voie sans les contraintes d'une secte. Vous serez libre mais devrez compter uniquement sur vos propres forces.
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Avantages:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                  Inconvénients:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label="Pas de bonus de Qi" 
                    size="small" 
                    sx={{ backgroundColor: '#1e1e1e', color: '#e74c3c' }} 
                  />
                  <Chip 
                    label="Pas de techniques exclusives" 
                    size="small" 
                    sx={{ backgroundColor: '#1e1e1e', color: '#e74c3c' }} 
                  />
                  <Chip 
                    label="Pas de protection" 
                    size="small" 
                    sx={{ backgroundColor: '#1e1e1e', color: '#e74c3c' }} 
                  />
                </Box>
                
                {/* Indicateur de sélection */}
                {personnage.appartenanceSecte === null && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 1, 
                      borderRadius: 1, 
                      backgroundColor: '#2ecc7144',
                      border: '1px solid #2ecc71',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#2ecc71' }}>
                      Option Sélectionnée
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={creerPersonnage}
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #e63946 30%, #ff6b6b 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
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