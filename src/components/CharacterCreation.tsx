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
  calculerTalentCultivation,
  TypeSecte,
  RangSecte,
  ElementCultivation,
  SECTES,
  AppartenanceSecte,
  getSecteDisponibles,
  STAT_MAX_CREATION
} from '../models/types';

// Composant pour afficher une statistique avec une barre de progression
const StatDisplay = ({ nom, valeur, isDerivee = false }: { nom: string, valeur: number, isDerivee?: boolean }) => {
  // Pour les statistiques dérivées, on utilise une échelle différente
  const progressValue = isDerivee 
    ? Math.min(100, valeur) // Limiter à 100% pour les statistiques dérivées
    : (valeur / STAT_MAX_CREATION) * 100; // Pourcentage par rapport à STAT_MAX_CREATION
  
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{nom}</Typography>
        <Typography variant="body2" fontWeight="bold">{valeur}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progressValue} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getStatColor(isDerivee ? valeur / 10 : valeur),
          }
        }} 
      />
    </Box>
  );
};

// Composant pour afficher une statistique de combat sans barre de progression
const CombatStatDisplay = ({ nom, valeur }: { nom: string, valeur: number }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        p: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography variant="body2">{nom}</Typography>
        <Typography 
          variant="body2" 
          fontWeight="bold" 
          sx={{ 
            color: getStatColor(valeur / 10) 
          }}
        >
          {valeur}
        </Typography>
      </Box>
    </Box>
  );
};

// Fonction pour obtenir la couleur en fonction de la valeur de la statistique
const getStatColor = (value: number): string => {
  // Normaliser la valeur par rapport à STAT_MAX_CREATION
  const normalizedValue = value / STAT_MAX_CREATION * 10;
  
  if (normalizedValue <= 3) return '#e74c3c'; // Faible - rouge
  if (normalizedValue <= 5) return '#e67e22'; // Moyen - orange
  if (normalizedValue <= 7) return '#f1c40f'; // Bon - jaune
  if (normalizedValue <= 9) return '#2ecc71'; // Excellent - vert
  return '#3498db'; // Exceptionnel - bleu
};

// Fonction pour obtenir l'affinité élémentaire requise en fonction de la rareté de la secte
const getAffiniteRequise = (rarete: Rarete): number => {
  switch (rarete) {
    case Rarete.COMMUN: return 30;
    case Rarete.RARE: return 50;
    case Rarete.EPIQUE: return 65;
    case Rarete.LEGENDAIRE: return 80;
    case Rarete.MYTHIQUE: return 90;
    default: return 0;
  }
};

// Fonction pour obtenir le talent requis en fonction de la rareté de la secte
const getTalentRequis = (rarete: Rarete): number => {
  switch (rarete) {
    case Rarete.COMMUN: return 0;
    case Rarete.RARE: return 50;
    case Rarete.EPIQUE: return 70;
    case Rarete.LEGENDAIRE: return 90;
    case Rarete.MYTHIQUE: return 95;
    default: return 0;
  }
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

// Composant pour afficher un chip de rareté (pour les sectes)
const RareteChip = ({ rarete }: { rarete: Rarete }) => {
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
    border: 'none',
    display: 'inline-block'
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
    <Box sx={styles}>
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
  
  // État pour contrôler l'affichage des informations détaillées sur les sectes
  const [afficherInfosSectes, setAfficherInfosSectes] = useState<boolean>(false);
  
  // Fonction pour relancer tous les éléments du personnage
  const relancerTout = () => {
    const stats = genererStatsAleatoires();
    const race = genererRaceAleatoire();
    const origine = genererOrigineAleatoire();
    const affiniteElements = genererAffinitesElementaires();
    const talent = calculerTalentCultivation(stats);
    
    setPersonnage({
      ...personnage,
      race,
      origine,
      stats,
      age: genererAgeInitial(),
      affiniteElements,
      talentCultivation: talent
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

      // Obtenir les informations de l'origine pour appliquer les bonus
      const origineInfo = getOrigineInfo(personnage.origine);
      
      // Appliquer les bonus de statistiques de l'origine
      const statsFinales = { ...personnage.stats };
      if (origineInfo.bonusStats) {
        Object.entries(origineInfo.bonusStats).forEach(([stat, bonus]) => {
          statsFinales[stat as keyof Stats] += bonus;
          // S'assurer que les statistiques ne dépassent pas STAT_MAX_CREATION
          if (statsFinales[stat as keyof Stats] > STAT_MAX_CREATION) {
            statsFinales[stat as keyof Stats] = STAT_MAX_CREATION;
          }
        });
      }

      // Recalculer les statistiques dérivées après avoir appliqué les bonus
      statsFinales.hp = statsFinales.constitution * 10 + statsFinales.force * 5;
      statsFinales.degat = statsFinales.force * 2 + statsFinales.qi;
      statsFinales.esquive = statsFinales.agilite * 1.5 + statsFinales.perception * 0.5;
      statsFinales.resistance = statsFinales.constitution * 1.5 + statsFinales.force * 0.5;

      // Recalculer le talent de cultivation avec les statistiques finales
      const talentFinal = calculerTalentCultivation(statsFinales);

      // Calculer les pierres spirituelles initiales avec le bonus de l'origine
      const pierresInitiales = 100 + (origineInfo.bonusPierresSpirituelles || 0);

      // Créer le personnage avec les valeurs actuelles et les bonus appliqués
      const nouveauPersonnage: Personnage = {
        id: genererID(),
        nom: personnage.nom,
        genre: personnage.genre,
        race: personnage.race,
        origine: personnage.origine,
        stats: statsFinales,
        pointsQi: 0,
        pointsQiTotal: 0,
        royaumeCultivation: personnage.royaumeCultivation,
        niveauPercee: personnage.niveauPercee,
        qiRequis: personnage.qiRequis,
        age: personnage.age,
        dateNaissance: Date.now(),
        dernierTempsJeu: Date.now(),
        tempsJeuTotal: 0,
        pierresSpirituelles: pierresInitiales,
        // Nouvelles propriétés pour le système de sectes
        appartenanceSecte: appartenanceSecteFinale,
        techniquesApprises: personnage.techniquesApprises,
        affiniteElements: personnage.affiniteElements,
        talentCultivation: talentFinal,
        // Ajouter les bonus de l'origine comme propriétés du personnage
        bonusQi: origineInfo.bonusQi || 0,
        bonusApprentissage: origineInfo.bonusApprentissage || 0,
        bonusSpecial: origineInfo.bonusSpecial || ""
      };
      
      // Si le personnage a rejoint une secte, appliquer le bonus de relation
      if (nouveauPersonnage.appartenanceSecte && origineInfo.bonusRelationSecte) {
        nouveauPersonnage.appartenanceSecte.relationAnciens += origineInfo.bonusRelationSecte;
        // S'assurer que la relation ne dépasse pas 100 et n'est pas inférieure à 0
        if (nouveauPersonnage.appartenanceSecte.relationAnciens > 100) {
          nouveauPersonnage.appartenanceSecte.relationAnciens = 100;
        } else if (nouveauPersonnage.appartenanceSecte.relationAnciens < 0) {
          nouveauPersonnage.appartenanceSecte.relationAnciens = 0;
        }
      }
      
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
      // Calculer le talent en fonction des statistiques
      const talent = calculerTalentCultivation(personnage.stats);
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
      case ElementCultivation.LUMIERE: return '#f1c40f'; // Jaune
      case ElementCultivation.OBSCURITE: return '#34495e'; // Bleu foncé
      default: return '#bdc3c7'; // Gris clair
    }
  };

  return (
    <Card sx={{ 
      maxWidth: '100%', 
      margin: '0 auto', 
      backgroundColor: '#121212', 
      color: '#fff',
      height: 'calc(100vh - 40px)',
      overflow: 'auto'
    }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily: "'Cinzel', serif", mb: 1 }}>
          Création de Personnage
        </Typography>
        
        <Grid container spacing={2}>
          {/* Colonne 1: Informations de base */}
          <Grid item xs={12} md={4} lg={3}>
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
              size="small"
            />
            
            <FormControl fullWidth margin="normal" size="small">
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
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 1.5, 
                  mb: 1.5, 
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1">Race: <strong>{personnage.race}</strong></Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {raceInfo.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                  Espérance de vie: <strong>{esperanceVie} ans</strong>
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 1.5, 
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1">Origine: <strong>{personnage.origine}</strong></Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {origineInfo.description}
                </Typography>
                
                {/* Affichage des bonus de l'origine */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Avantages de l'origine:
                  </Typography>
                  <Grid container spacing={0.5}>
                    {/* Bonus de statistiques */}
                    {origineInfo.bonusStats && Object.entries(origineInfo.bonusStats).map(([stat, bonus]) => (
                      <Grid item xs={6} key={stat}>
                        <Chip 
                          label={`${stat.charAt(0).toUpperCase() + stat.slice(1)} +${bonus}`} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${getStatColor(personnage.stats[stat as keyof Stats])}22`,
                            color: getStatColor(personnage.stats[stat as keyof Stats]),
                            border: `1px solid ${getStatColor(personnage.stats[stat as keyof Stats])}`,
                            fontSize: '0.7rem',
                            height: '22px'
                          }} 
                        />
                      </Grid>
                    ))}
                    
                    {/* Autres bonus */}
                    {origineInfo.bonusPierresSpirituelles && origineInfo.bonusPierresSpirituelles > 0 && (
                      <Grid item xs={6}>
                        <Chip 
                          label={`Pierres +${origineInfo.bonusPierresSpirituelles}`} 
                          size="small" 
                          sx={{ backgroundColor: '#1e1e1e', fontSize: '0.7rem', height: '22px' }} 
                        />
                      </Grid>
                    )}
                    
                    {origineInfo.bonusQi && origineInfo.bonusQi > 0 && (
                      <Grid item xs={6}>
                        <Chip 
                          label={`Gain de Qi +${origineInfo.bonusQi}%`} 
                          size="small" 
                          sx={{ backgroundColor: '#1e1e1e', fontSize: '0.7rem', height: '22px' }} 
                        />
                      </Grid>
                    )}
                    
                    {origineInfo.bonusRelationSecte && origineInfo.bonusRelationSecte !== 0 && (
                      <Grid item xs={6}>
                        <Chip 
                          label={`Relation Secte ${origineInfo.bonusRelationSecte > 0 ? '+' : ''}${origineInfo.bonusRelationSecte}`} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#1e1e1e',
                            color: origineInfo.bonusRelationSecte > 0 ? '#2ecc71' : '#e74c3c',
                            fontSize: '0.7rem',
                            height: '22px'
                          }} 
                        />
                      </Grid>
                    )}
                    
                    {origineInfo.bonusApprentissage && origineInfo.bonusApprentissage > 0 && (
                      <Grid item xs={6}>
                        <Chip 
                          label={`Apprentissage +${origineInfo.bonusApprentissage}%`} 
                          size="small" 
                          sx={{ backgroundColor: '#1e1e1e', fontSize: '0.7rem', height: '22px' }} 
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Paper>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={relancerTout}
                startIcon={<span role="img" aria-label="dice">🎲</span>}
                fullWidth
                size="small"
                sx={{ 
                  fontWeight: 'bold',
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
            </Box>
          </Grid>
          
          {/* Colonne 2: Statistiques et Cultivation */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                Statistiques
              </Typography>
              <Box>
                <Chip 
                  label={`Moyenne: ${moyenneStats.toFixed(1)}`} 
                  color={moyenneStats >= 7 ? "success" : moyenneStats >= 5 ? "warning" : "error"}
                  size="small"
                  sx={{ height: '22px', fontSize: '0.75rem' }}
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatDisplay nom="Force" valeur={personnage.stats.force} />
                  <StatDisplay nom="Agilité" valeur={personnage.stats.agilite} />
                  <StatDisplay nom="Constitution" valeur={personnage.stats.constitution} />
                  <StatDisplay nom="Intelligence" valeur={personnage.stats.intelligence} />
                </Grid>
                <Grid item xs={6}>
                  <StatDisplay nom="Perception" valeur={personnage.stats.perception} />
                  <StatDisplay nom="Charisme" valeur={personnage.stats.charisme} />
                  <StatDisplay nom="Chance" valeur={personnage.stats.chance} />
                  <StatDisplay nom="Qi" valeur={personnage.stats.qi} />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Statistiques de Combat
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <CombatStatDisplay nom="Points de Vie" valeur={personnage.stats.hp} />
                  <CombatStatDisplay nom="Dégâts" valeur={personnage.stats.degat} />
                </Grid>
                <Grid item xs={6}>
                  <CombatStatDisplay nom="Esquive" valeur={personnage.stats.esquive} />
                  <CombatStatDisplay nom="Résistance" valeur={personnage.stats.resistance} />
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Cultivation
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Niveau: <strong>{personnage.royaumeCultivation} - {nomCultivation}</strong>
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
            
            {/* Talent de Cultivation (version compacte) */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Talent de Cultivation
              </Typography>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 1.5, 
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid #9b59b6',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {personnage.talentCultivation >= 90 && (
                  <RareteBadge rarete={Rarete.MYTHIQUE} />
                )}
                {personnage.talentCultivation >= 80 && personnage.talentCultivation < 90 && (
                  <RareteBadge rarete={Rarete.LEGENDAIRE} />
                )}
                {personnage.talentCultivation >= 70 && personnage.talentCultivation < 80 && (
                  <RareteBadge rarete={Rarete.EPIQUE} />
                )}
                {personnage.talentCultivation >= 50 && personnage.talentCultivation < 70 && (
                  <RareteBadge rarete={Rarete.RARE} />
                )}
                {personnage.talentCultivation < 50 && (
                  <RareteBadge rarete={Rarete.COMMUN} />
                )}
                <Typography variant="subtitle1" gutterBottom>
                  {personnage.talentCultivation >= 95 ? "Talent Transcendant" : 
                   personnage.talentCultivation >= 85 ? "Talent Exceptionnel" : 
                   personnage.talentCultivation >= 70 ? "Talent Excellent" : 
                   personnage.talentCultivation >= 50 ? "Bon Talent" : 
                   personnage.talentCultivation >= 30 ? "Talent Moyen" : "Talent Faible"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {personnage.talentCultivation >= 90 ? "Un talent inné extraordinaire qui n'apparaît qu'une fois par millénaire." : 
                   personnage.talentCultivation >= 80 ? "Un talent rare qui vous permettra d'atteindre les sommets de la cultivation." : 
                   personnage.talentCultivation >= 70 ? "Un excellent talent qui vous ouvrira les portes des grandes sectes." : 
                   personnage.talentCultivation >= 50 ? "Un bon talent qui vous permettra de progresser régulièrement." : 
                   personnage.talentCultivation >= 30 ? "Un talent moyen qui nécessitera beaucoup d'efforts pour progresser." : 
                   "Un talent faible qui limitera votre progression dans les arts martiaux."}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`Vitesse de Cultivation: ${(1 + personnage.talentCultivation / 100).toFixed(2)}x`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#1e1e1e', 
                      mr: 0.5, 
                      mb: 0.5,
                      fontSize: '0.7rem',
                      height: '22px'
                    }} 
                  />
                </Box>
              </Paper>
            </Box>
          </Grid>
          
          {/* Colonne 3: Affinités Élémentaires et Sectes */}
          <Grid item xs={12} md={4} lg={3}>
            <Typography variant="h6" gutterBottom>
              Affinités Élémentaires
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {Object.entries(personnage.affiniteElements).map(([element, affinite]) => (
                <Grid item xs={6} key={element}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 1, 
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: `1px solid ${getElementColor(element as ElementCultivation)}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: getElementColor(element as ElementCultivation) }}>
                      {element}
                    </Typography>
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={affinite} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getElementColor(element as ElementCultivation),
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      {affinite}/100
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Secte
            </Typography>
            <Box sx={{ maxHeight: '250px', overflow: 'auto', pr: 1 }}>
              <Grid container spacing={1}>
                {/* Option pour ne rejoindre aucune secte */}
                <Grid item xs={12}>
                  <Paper 
                    sx={{ 
                      p: 1.5, 
                      cursor: 'pointer',
                      border: personnage.appartenanceSecte === null ? '1px solid #2ecc71' : '1px solid #333',
                      borderRadius: 2,
                      backgroundColor: personnage.appartenanceSecte === null ? 'rgba(46, 204, 113, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 3px 8px rgba(255, 255, 255, 0.1)',
                      }
                    }}
                    onClick={() => {
                      setPersonnage({
                        ...personnage,
                        appartenanceSecte: null
                      });
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      Cultivateur Indépendant
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Choisissez votre propre voie sans les contraintes d'une secte.
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Liste des sectes disponibles */}
                {getSecteDisponibles(personnage).map((secte) => (
                  <Grid item xs={12} key={secte.id}>
                    <Paper 
                      sx={{ 
                        p: 1.5, 
                        cursor: 'pointer',
                        border: personnage.appartenanceSecte && personnage.appartenanceSecte.secteId === secte.id 
                          ? '1px solid #2ecc71' 
                          : '1px solid #333',
                        borderRadius: 2,
                        backgroundColor: personnage.appartenanceSecte && personnage.appartenanceSecte.secteId === secte.id 
                          ? 'rgba(46, 204, 113, 0.1)' 
                          : 'transparent',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 3px 8px rgba(255, 255, 255, 0.1)',
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
                            relationAnciens: 50 // Relation neutre au départ
                          }
                        });
                      }}
                    >
                      <RareteBadge rarete={secte.rarete} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            {secte.nom}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={secte.rarete} 
                            sx={{ 
                              height: '20px', 
                              fontSize: '0.7rem',
                              backgroundColor: `${getRareteColor(secte.rarete)}33`,
                              color: getRareteColor(secte.rarete),
                              border: `1px solid ${getRareteColor(secte.rarete)}`
                            }} 
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1, clear: 'both' }}>
                        {secte.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        <Chip 
                          size="small" 
                          label={secte.type} 
                          sx={{ 
                            height: '20px', 
                            fontSize: '0.7rem',
                            backgroundColor: '#1e1e1e'
                          }} 
                        />
                        <Chip 
                          size="small" 
                          label={secte.elementPrincipal} 
                          sx={{ 
                            height: '20px', 
                            fontSize: '0.7rem',
                            backgroundColor: `${getElementColor(secte.elementPrincipal)}33`,
                            color: getElementColor(secte.elementPrincipal),
                            border: `1px solid ${getElementColor(secte.elementPrincipal)}`
                          }} 
                        />
                        <Tooltip title={`Affinité requise: ${personnage.affiniteElements[secte.elementPrincipal]}/${getAffiniteRequise(secte.rarete)}`}>
                          <Chip 
                            size="small" 
                            label={`Affinité: ${Math.round(personnage.affiniteElements[secte.elementPrincipal] / getAffiniteRequise(secte.rarete) * 100)}%`} 
                            sx={{ 
                              height: '20px', 
                              fontSize: '0.7rem',
                              backgroundColor: personnage.affiniteElements[secte.elementPrincipal] >= getAffiniteRequise(secte.rarete) 
                                ? 'rgba(46, 204, 113, 0.2)' 
                                : 'rgba(231, 76, 60, 0.2)',
                              color: personnage.affiniteElements[secte.elementPrincipal] >= getAffiniteRequise(secte.rarete) 
                                ? '#2ecc71' 
                                : '#e74c3c',
                              border: `1px solid ${personnage.affiniteElements[secte.elementPrincipal] >= getAffiniteRequise(secte.rarete) 
                                ? '#2ecc71' 
                                : '#e74c3c'}`
                            }} 
                          />
                        </Tooltip>
                        <Tooltip title={`Talent requis: ${personnage.talentCultivation}/${getTalentRequis(secte.rarete)}`}>
                          <Chip 
                            size="small" 
                            label={`Talent: ${Math.round(personnage.talentCultivation / getTalentRequis(secte.rarete) * 100)}%`} 
                            sx={{ 
                              height: '20px', 
                              fontSize: '0.7rem',
                              backgroundColor: personnage.talentCultivation >= getTalentRequis(secte.rarete) 
                                ? 'rgba(46, 204, 113, 0.2)' 
                                : 'rgba(231, 76, 60, 0.2)',
                              color: personnage.talentCultivation >= getTalentRequis(secte.rarete) 
                                ? '#2ecc71' 
                                : '#e74c3c',
                              border: `1px solid ${personnage.talentCultivation >= getTalentRequis(secte.rarete) 
                                ? '#2ecc71' 
                                : '#e74c3c'}`
                            }} 
                          />
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
                
                {/* Message si aucune secte n'est disponible */}
                {getSecteDisponibles(personnage).length === 0 && (
                  <Grid item xs={12}>
                    <Paper 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid #e74c3c'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#e74c3c' }}>
                        Aucune secte disponible
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        Votre talent ou vos affinités élémentaires ne sont pas suffisants pour rejoindre une secte. 
                        Vous pouvez continuer en tant que cultivateur indépendant ou relancer vos statistiques.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          
          {/* Colonne 4: Bouton de création et informations supplémentaires */}
          <Grid item xs={12} md={12} lg={3}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              justifyContent: 'space-between' 
            }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Informations Supplémentaires
                </Typography>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    border: '1px solid #333',
                    mb: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    Votre personnage commencera son voyage dans le monde de la cultivation avec 100 pierres spirituelles.
                    Choisissez judicieusement votre race, origine et secte pour maximiser vos chances de survie.
                  </Typography>
                </Paper>
                
                {personnage.appartenanceSecte && (
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px solid #333',
                      mb: 2
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Secte Sélectionnée: {SECTES.find(s => s.id === personnage.appartenanceSecte?.secteId)?.nom || ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Vous commencerez comme Disciple Externe et pourrez progresser dans les rangs de la secte en accomplissant des missions et en gagnant de la réputation.
                    </Typography>
                  </Paper>
                )}
              </Box>
              
              <Box sx={{ mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  onClick={creerPersonnage}
                  fullWidth
                  sx={{ 
                    py: 1.5, 
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #e63946 30%, #ff6b6b 90%)',
                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                    mt: 2
                  }}
                >
                  Commencer l'Aventure
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CharacterCreation; 