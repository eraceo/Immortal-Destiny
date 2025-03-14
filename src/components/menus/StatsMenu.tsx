import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress,
  Tooltip,
  Divider,
  Chip
} from '@mui/material';
import { Personnage, STAT_MAX_CREATION, STAT_MAX_JEU, calculerBonusSecte, MULTIPLICATEUR_COMBAT_ROYAUME, getRoyaumeColor, RoyaumeCultivation, calculerStatsCombat, ElementCultivation } from '../../models/types';

interface StatsMenuProps {
  personnage: Personnage;
}

// Fonction pour obtenir la couleur en fonction de la valeur de la statistique
const getStatColor = (value: number): string => {
  // Normaliser la valeur par rapport à STAT_MAX_JEU (100)
  // Cela donne une valeur entre 0 et 1, que nous multiplions par 10 pour obtenir une échelle de 0 à 10
  const normalizedValue = (value / STAT_MAX_JEU) * 10;
  
  if (normalizedValue <= 3) return '#e74c3c'; // Faible - rouge
  if (normalizedValue <= 6) return '#f1c40f'; // Moyen - jaune
  if (normalizedValue <= 8) return '#2ecc71'; // Bon - vert
  return '#9b59b6'; // Excellent - violet
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

// Composant pour afficher une statistique avec une barre de progression
const StatDisplay = ({ nom, valeur, description, personnage, statKey }: { 
  nom: string, 
  valeur: number, 
  description: string,
  personnage: Personnage,
  statKey: keyof typeof personnage.stats
}) => {
  // Calculer le pourcentage pour la barre de progression (0-100%)
  const progressValue = (valeur / STAT_MAX_JEU) * 100;
  
  // Calculer les bonus appliqués à cette statistique
  const bonusSecte = calculerBonusSecte(personnage);
  const bonusSecteValue = bonusSecte.bonusStats[statKey] || 0;
  
  // Bonus des techniques
  const bonusTechniques = personnage.techniquesApprises
    .filter(technique => technique.effets.bonusStats && technique.effets.bonusStats[statKey])
    .map(technique => ({
      nom: technique.nom,
      valeur: technique.effets.bonusStats?.[statKey] || 0
    }));
  
  // Bonus de l'origine (si applicable)
  const origineInfo = personnage.origine ? 
    require('../../models/types').getOrigineInfo(personnage.origine) : null;
  const bonusOrigine = origineInfo && origineInfo.bonusStats && origineInfo.bonusStats[statKey] || 0;
  
  // Bonus de la race (si applicable)
  const raceInfo = personnage.race ? 
    require('../../models/types').getRaceInfo(personnage.race) : null;
  const bonusRace = raceInfo && raceInfo.bonusStats && raceInfo.bonusStats[statKey] || 0;
  
  // Calculer la valeur de base (sans les bonus)
  // Nous ne pouvons pas simplement soustraire les bonus de la valeur totale,
  // car cela pourrait donner des résultats incorrects si la valeur totale est limitée
  // Nous devons utiliser une approche différente pour estimer la valeur de base
  const totalBonus = bonusSecteValue + bonusOrigine + bonusRace + 
                    bonusTechniques.reduce((sum, t) => sum + t.valeur, 0);
  
  // La valeur de base est la valeur actuelle moins les bonus, mais ne peut pas être inférieure à 1
  // et ne doit pas dépasser STAT_MAX_JEU
  const valeurBase = Math.max(1, Math.min(STAT_MAX_JEU, valeur - totalBonus));
  
  // Construire le contenu du tooltip
  const tooltipContent = (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Détails des bonus
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Valeur de base: {valeurBase}
      </Typography>
      
      {bonusSecteValue > 0 && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Bonus de secte: +{bonusSecteValue.toFixed(1)}
        </Typography>
      )}
      
      {bonusOrigine > 0 && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Bonus d'origine: +{bonusOrigine}
        </Typography>
      )}
      
      {bonusRace > 0 && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Bonus de race: +{bonusRace}
        </Typography>
      )}
      
      {bonusTechniques.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Bonus de techniques:
          </Typography>
          {bonusTechniques.map((technique, index) => (
            <Typography key={index} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
              • {technique.nom}: +{technique.valeur}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body1">{nom}</Typography>
        <Tooltip 
          title={tooltipContent}
          arrow
          placement="top"
        >
          <Typography variant="body1" fontWeight="bold" sx={{ cursor: 'help' }}>
            {valeur} / {STAT_MAX_JEU}
          </Typography>
        </Tooltip>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progressValue} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getStatColor(valeur),
          }
        }} 
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
};

// Composant pour afficher les affinités élémentaires
const ElementalAffinityDisplay = ({ personnage }: { personnage: Personnage }) => {
  // Trier les affinités par valeur décroissante
  const affinitesTriees = Object.entries(personnage.affiniteElements)
    .sort(([, valeurA], [, valeurB]) => valeurB - valeurA);
  
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Affinités Élémentaires
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Vos affinités naturelles avec les éléments déterminent votre potentiel dans différentes techniques de cultivation.
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {affinitesTriees.map(([element, valeur]) => (
          <Grid item xs={6} sm={4} md={3} key={element}>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                <Chip 
                  label={element} 
                  size="small" 
                  sx={{ 
                    backgroundColor: `${getElementColor(element as ElementCultivation)}22`,
                    color: getElementColor(element as ElementCultivation),
                    border: `1px solid ${getElementColor(element as ElementCultivation)}`,
                    height: '24px'
                  }} 
                />
                <Typography variant="body2" fontWeight="bold">
                  {valeur}/100
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={valeur} 
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
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ 
        p: 2, 
        mt: 2,
        backgroundColor: 'rgba(0,0,0,0.1)', 
        borderRadius: 1,
        border: '1px solid #3498db'
      }}>
        <Typography variant="body2">
          <strong>Note:</strong> Les affinités élémentaires influencent votre capacité à apprendre et à maîtriser des techniques liées à ces éléments.
        </Typography>
      </Box>
    </Box>
  );
};

const StatsMenu: React.FC<StatsMenuProps> = ({ personnage }) => {
  // Calculer les statistiques de combat correctement
  const statsCombat = calculerStatsCombat(personnage.stats, personnage.royaumeCultivation);
  
  // Calcul du total des statistiques de base uniquement (sans les stats dérivées)
  const statsDeBase = [
    personnage.stats.force,
    personnage.stats.agilite,
    personnage.stats.constitution,
    personnage.stats.intelligence,
    personnage.stats.perception,
    personnage.stats.charisme,
    personnage.stats.chance,
    personnage.stats.qi
  ];
  
  const totalStats = statsDeBase.reduce((a, b) => a + b, 0);
  const moyenneStats = totalStats / statsDeBase.length;

  // Utiliser toujours STAT_MAX_JEU (100) comme référence pour la couleur de la moyenne
  // Cela permettra aux statistiques de dépasser 10 après la création du personnage
  const moyenneColor = getStatColor(moyenneStats);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Statistiques du Personnage</Typography>
      
      <Grid container spacing={3}>
        {/* Colonne de gauche: Statistiques de base et de combat */}
        <Grid item xs={12} md={8}>
          {/* Statistiques de base */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Aperçu des Statistiques</Typography>
              <Box sx={{ 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1, 
                backgroundColor: moyenneColor,
                color: 'white',
                fontWeight: 'bold'
              }}>
                Moyenne: {moyenneStats.toFixed(1)}
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Les statistiques déterminent vos capacités et influencent votre progression dans le monde de la cultivation.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StatDisplay 
                  nom="Force" 
                  valeur={personnage.stats.force} 
                  description="Détermine votre puissance physique et vos dégâts au combat."
                  personnage={personnage}
                  statKey="force"
                />
                <StatDisplay 
                  nom="Agilité" 
                  valeur={personnage.stats.agilite} 
                  description="Affecte votre vitesse, votre esquive et votre précision."
                  personnage={personnage}
                  statKey="agilite"
                />
                <StatDisplay 
                  nom="Constitution" 
                  valeur={personnage.stats.constitution} 
                  description="Influence votre santé, votre endurance et votre résistance."
                  personnage={personnage}
                  statKey="constitution"
                />
                <StatDisplay 
                  nom="Intelligence" 
                  valeur={personnage.stats.intelligence} 
                  description="Améliore votre capacité à apprendre des techniques et augmente votre gain de Qi."
                  personnage={personnage}
                  statKey="intelligence"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StatDisplay 
                  nom="Perception" 
                  valeur={personnage.stats.perception} 
                  description="Affecte votre capacité à détecter les dangers et les opportunités."
                  personnage={personnage}
                  statKey="perception"
                />
                <StatDisplay 
                  nom="Charisme" 
                  valeur={personnage.stats.charisme} 
                  description="Influence vos interactions sociales et votre capacité à diriger."
                  personnage={personnage}
                  statKey="charisme"
                />
                <StatDisplay 
                  nom="Chance" 
                  valeur={personnage.stats.chance} 
                  description="Augmente vos chances de trouver des objets rares et d'éviter les dangers."
                  personnage={personnage}
                  statKey="chance"
                />
                <StatDisplay 
                  nom="Qi" 
                  valeur={personnage.stats.qi} 
                  description="Détermine votre puissance spirituelle et votre taux de gain de Qi pendant la méditation."
                  personnage={personnage}
                  statKey="qi"
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Statistiques de combat */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
            <Typography variant="h6" gutterBottom>Statistiques de Combat</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">Points de Vie (HP)</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {statsCombat.hp}
                    </Typography>
                  </Box>
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Détail du calcul
                        </Typography>
                        <Typography variant="body2">
                          (Constitution × 10 + Force × 5) × Multiplicateur du Royaume
                        </Typography>
                        <Typography variant="body2">
                          ({personnage.stats.constitution} × 10 + {personnage.stats.force} × 5) × {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} = {Math.round((personnage.stats.constitution * 10 + personnage.stats.force * 5) * MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation])}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, cursor: 'help' }}>
                      Calculé à partir de Constitution (×10) et Force (×5) avec un multiplicateur de {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} pour le {personnage.royaumeCultivation}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">Dégâts</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {statsCombat.degat}
                    </Typography>
                  </Box>
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Détail du calcul
                        </Typography>
                        <Typography variant="body2">
                          (Force × 2 + Qi) × Multiplicateur du Royaume
                        </Typography>
                        <Typography variant="body2">
                          ({personnage.stats.force} × 2 + {personnage.stats.qi}) × {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} = {Math.round((personnage.stats.force * 2 + personnage.stats.qi) * MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation])}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, cursor: 'help' }}>
                      Calculé à partir de Force (×2) et Qi avec un multiplicateur de {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} pour le {personnage.royaumeCultivation}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">Esquive</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {statsCombat.esquive}
                    </Typography>
                  </Box>
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Détail du calcul
                        </Typography>
                        <Typography variant="body2">
                          (Agilité × 1.5 + Perception × 0.5) × Multiplicateur du Royaume
                        </Typography>
                        <Typography variant="body2">
                          ({personnage.stats.agilite} × 1.5 + {personnage.stats.perception} × 0.5) × {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} = {Math.round((personnage.stats.agilite * 1.5 + personnage.stats.perception * 0.5) * MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation])}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, cursor: 'help' }}>
                      Calculé à partir d'Agilité (×1.5) et Perception (×0.5) avec un multiplicateur de {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} pour le {personnage.royaumeCultivation}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">Résistance</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {statsCombat.resistance}
                    </Typography>
                  </Box>
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Détail du calcul
                        </Typography>
                        <Typography variant="body2">
                          (Constitution × 1.5 + Force × 0.5) × Multiplicateur du Royaume
                        </Typography>
                        <Typography variant="body2">
                          ({personnage.stats.constitution} × 1.5 + {personnage.stats.force} × 0.5) × {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} = {Math.round((personnage.stats.constitution * 1.5 + personnage.stats.force * 0.5) * MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation])}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, cursor: 'help' }}>
                      Calculé à partir de Constitution (×1.5) et Force (×0.5) avec un multiplicateur de {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} pour le {personnage.royaumeCultivation}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">Précision</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {statsCombat.precision}
                    </Typography>
                  </Box>
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Détail du calcul
                        </Typography>
                        <Typography variant="body2">
                          (Perception × 2 + Agilité × 0.5) × Multiplicateur du Royaume
                        </Typography>
                        <Typography variant="body2">
                          ({personnage.stats.perception} × 2 + {personnage.stats.agilite} × 0.5) × {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} = {Math.round((personnage.stats.perception * 2 + personnage.stats.agilite * 0.5) * MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation])}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, cursor: 'help' }}>
                      Calculé à partir de Perception (×2) et Agilité (×0.5) avec un multiplicateur de {MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]} pour le {personnage.royaumeCultivation}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ 
              p: 2, 
              mt: 2,
              backgroundColor: 'rgba(0,0,0,0.1)', 
              borderRadius: 1,
              border: '1px solid #e74c3c'
            }}>
              <Typography variant="body2" gutterBottom>
                <strong>Note:</strong> Les statistiques de combat sont dérivées de vos statistiques de base et sont multipliées par un facteur dépendant de votre royaume de cultivation actuel ({MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation]}x pour {personnage.royaumeCultivation}).
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Multiplicateurs de Combat par Royaume:
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(MULTIPLICATEUR_COMBAT_ROYAUME).map(([royaume, multiplicateur]) => (
                  <Grid item xs={6} sm={4} md={3} key={royaume}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        backgroundColor: royaume === personnage.royaumeCultivation ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: royaume === personnage.royaumeCultivation ? `1px solid ${getRoyaumeColor(royaume as RoyaumeCultivation)}` : 'none'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: getRoyaumeColor(royaume as RoyaumeCultivation),
                          fontWeight: royaume === personnage.royaumeCultivation ? 'bold' : 'normal'
                        }}
                      >
                        {royaume}: ×{multiplicateur}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Colonne de droite: Affinités élémentaires et effets des statistiques */}
        <Grid item xs={12} md={4}>
          {/* Affinités élémentaires */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
            <ElementalAffinityDisplay personnage={personnage} />
          </Paper>
          
          {/* Effets des statistiques */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Effets des Statistiques</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Gain de Qi par seconde:</strong> {personnage.stats.qi} (base) + {(personnage.stats.intelligence * 0.08).toFixed(2)} (intelligence) + {(personnage.stats.perception * 0.04).toFixed(2)} (perception)
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Espérance de vie:</strong> Influencée par votre race et votre niveau de cultivation.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Formules de calcul des statistiques de combat:
              </Typography>
              
              <Box sx={{ pl: 2, mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Points de Vie (HP):</strong> (Constitution × 10 + Force × 5) × Multiplicateur du Royaume
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Dégâts:</strong> (Force × 2 + Qi) × Multiplicateur du Royaume
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Esquive:</strong> (Agilité × 1.5 + Perception × 0.5) × Multiplicateur du Royaume
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Résistance:</strong> (Constitution × 1.5 + Force × 0.5) × Multiplicateur du Royaume
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Précision:</strong> (Perception × 2 + Agilité × 0.5) × Multiplicateur du Royaume
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Influence des statistiques de base:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Force:</strong> Augmente les dégâts (×2), les points de vie (×5) et la résistance (×0.5)
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Agilité:</strong> Augmente l'esquive (×1.5) et la précision (×0.5)
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Constitution:</strong> Augmente les points de vie (×10) et la résistance (×1.5)
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Intelligence:</strong> Augmente le gain de Qi (×0.08 par point)
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Perception:</strong> Augmente l'esquive (×0.5), la précision (×2) et le gain de Qi (×0.04 par point)
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Charisme:</strong> Améliore les interactions sociales et les négociations
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Chance:</strong> Augmente les probabilités d'événements favorables
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Qi:</strong> Augmente les dégâts (×1) et le gain de Qi (×1 par point)
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsMenu; 