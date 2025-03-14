import { 
  Personnage, 
  Stats, 
  RoyaumeCultivation, 
  RangSecte,
  calculerStatsCombat,
  ElementCultivation,
  TechniqueCultivation
} from './types';

// Interface pour les ennemis dans les combats de secte
export interface Ennemi {
  id: string;
  nom: string;
  description: string;
  stats: Stats;
  royaumeCultivation: RoyaumeCultivation;
  techniques: TechniqueCultivation[];
  element: ElementCultivation;
  rang: RangSecte; // Rang de l'ennemi dans la secte
  recompenses: {
    pierresSpirituelles: number;
    pointsContribution: number;
    experience: number;
  };
}

// Interface pour les actions de combat
export interface ActionCombat {
  type: 'attaque' | 'technique' | 'esquive' | 'defense';
  source: 'joueur' | 'ennemi';
  nom: string;
  description: string;
  degats?: number;
  soins?: number;
  effets?: string[];
}

// Interface pour les logs de combat
export interface LogCombat {
  tour: number;
  action: ActionCombat;
  hpJoueur: number;
  hpEnnemi: number;
}

// Interface pour les résultats de combat
export interface ResultatCombat {
  victoire: boolean;
  logs: LogCombat[];
  recompenses?: {
    pierresSpirituelles: number;
    pointsContribution: number;
    experience: number;
  };
}

// Multiplicateurs de difficulté par rang
const MULTIPLICATEUR_DIFFICULTE: Record<RangSecte, number> = {
  [RangSecte.DISCIPLE_EXTERNE]: 1,
  [RangSecte.DISCIPLE_INTERNE]: 1.5,
  [RangSecte.DISCIPLE_PRINCIPAL]: 2,
  [RangSecte.DOYEN]: 3,
  [RangSecte.ANCIEN]: 4,
  [RangSecte.GRAND_ANCIEN]: 5,
  [RangSecte.PATRIARCHE]: 7
};

// Fonction pour générer un ennemi aléatoire en fonction du rang cible
export const genererEnnemi = (rangCible: RangSecte, secteId: string): Ennemi => {
  // Noms possibles pour les ennemis
  const noms = [
    "Disciple Feng", "Maître Li", "Ancien Wang", "Cultivateur Zhao", 
    "Guerrier Chen", "Immortel Huang", "Démon Xu", "Esprit Wu", 
    "Gardien Zhang", "Protecteur Liu", "Érudit Sun", "Alchimiste Qian"
  ];
  
  // Descriptions possibles
  const descriptions = [
    "Un disciple arrogant qui cherche à prouver sa valeur.",
    "Un cultivateur expérimenté aux techniques redoutables.",
    "Un ancien respecté pour sa sagesse et sa puissance.",
    "Un guerrier impitoyable qui ne recule devant rien.",
    "Un pratiquant mystérieux aux pouvoirs étranges.",
    "Un expert en arts martiaux à la réputation légendaire."
  ];
  
  // Éléments possibles
  const elements = [
    ElementCultivation.FEU,
    ElementCultivation.EAU,
    ElementCultivation.BOIS,
    ElementCultivation.METAL,
    ElementCultivation.TERRE,
    ElementCultivation.FOUDRE,
    ElementCultivation.LUMIERE,
    ElementCultivation.OBSCURITE
  ];
  
  // Royaumes de cultivation en fonction du rang
  const royaumesParRang: Record<RangSecte, RoyaumeCultivation> = {
    [RangSecte.DISCIPLE_EXTERNE]: RoyaumeCultivation.QI_CONDENSE,
    [RangSecte.DISCIPLE_INTERNE]: RoyaumeCultivation.FONDATION,
    [RangSecte.DISCIPLE_PRINCIPAL]: RoyaumeCultivation.CORE_OR,
    [RangSecte.DOYEN]: RoyaumeCultivation.NASCENT_SOUL,
    [RangSecte.ANCIEN]: RoyaumeCultivation.TRANSCENDANCE,
    [RangSecte.GRAND_ANCIEN]: RoyaumeCultivation.SAINT_MARTIAL,
    [RangSecte.PATRIARCHE]: RoyaumeCultivation.DEMI_DIEU
  };
  
  // Générer des stats de base en fonction du rang
  const baseStats: Stats = {
    force: 10 + Math.floor(Math.random() * 20) * MULTIPLICATEUR_DIFFICULTE[rangCible],
    agilite: 10 + Math.floor(Math.random() * 20) * MULTIPLICATEUR_DIFFICULTE[rangCible],
    constitution: 10 + Math.floor(Math.random() * 20) * MULTIPLICATEUR_DIFFICULTE[rangCible],
    intelligence: 10 + Math.floor(Math.random() * 20) * MULTIPLICATEUR_DIFFICULTE[rangCible],
    perception: 10 + Math.floor(Math.random() * 20) * MULTIPLICATEUR_DIFFICULTE[rangCible],
    charisme: 10 + Math.floor(Math.random() * 10),
    chance: 10 + Math.floor(Math.random() * 10),
    qi: 20 + Math.floor(Math.random() * 30) * MULTIPLICATEUR_DIFFICULTE[rangCible],
    hp: 0,
    degat: 0,
    esquive: 0,
    resistance: 0,
    precision: 0
  };
  
  // Calculer les stats de combat
  const royaume = royaumesParRang[rangCible];
  const statsCombat = calculerStatsCombat(baseStats, royaume);
  
  // Mettre à jour les stats avec les valeurs de combat
  baseStats.hp = statsCombat.hp;
  baseStats.degat = statsCombat.degat;
  baseStats.esquive = statsCombat.esquive;
  baseStats.resistance = statsCombat.resistance;
  baseStats.precision = statsCombat.precision;
  
  // Générer les récompenses en fonction du rang
  const recompenses = {
    pierresSpirituelles: 100 * MULTIPLICATEUR_DIFFICULTE[rangCible],
    pointsContribution: 10 * MULTIPLICATEUR_DIFFICULTE[rangCible],
    experience: 50 * MULTIPLICATEUR_DIFFICULTE[rangCible]
  };
  
  return {
    id: `ennemi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    nom: noms[Math.floor(Math.random() * noms.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    stats: baseStats,
    royaumeCultivation: royaume,
    techniques: [], // À implémenter: générer des techniques aléatoires
    element: elements[Math.floor(Math.random() * elements.length)],
    rang: rangCible,
    recompenses
  };
};

// Fonction pour simuler un combat automatique
export const simulerCombat = (joueur: Personnage, ennemi: Ennemi): ResultatCombat => {
  // Copier les stats pour ne pas modifier les originaux
  const statsJoueur = { ...joueur.stats };
  const statsEnnemi = { ...ennemi.stats };
  
  // Logs de combat
  const logs: LogCombat[] = [];
  
  // Points de vie initiaux
  let hpJoueur = statsJoueur.hp;
  let hpEnnemi = statsEnnemi.hp;
  
  // Déterminer qui commence (basé sur l'agilité)
  let tourJoueur = statsJoueur.agilite >= statsEnnemi.agilite;
  
  // Simuler le combat tour par tour
  for (let tour = 1; tour <= 30 && hpJoueur > 0 && hpEnnemi > 0; tour++) {
    if (tourJoueur) {
      // Tour du joueur
      const action = genererActionCombat(joueur, ennemi, 'joueur');
      
      // Appliquer les dégâts
      if (action.degats && action.degats > 0) {
        // Calculer les dégâts en tenant compte de la résistance
        const degatsReduits = Math.max(1, action.degats - statsEnnemi.resistance / 2);
        hpEnnemi -= degatsReduits;
        action.degats = degatsReduits; // Mettre à jour les dégâts réels infligés
      }
      
      // Appliquer les soins
      if (action.soins && action.soins > 0) {
        hpJoueur = Math.min(statsJoueur.hp, hpJoueur + action.soins);
      }
      
      // Enregistrer l'action
      logs.push({
        tour,
        action,
        hpJoueur,
        hpEnnemi
      });
    } else {
      // Tour de l'ennemi
      const action = genererActionCombat(ennemi, joueur, 'ennemi');
      
      // Appliquer les dégâts
      if (action.degats && action.degats > 0) {
        // Calculer les dégâts en tenant compte de la résistance
        const degatsReduits = Math.max(1, action.degats - statsJoueur.resistance / 2);
        hpJoueur -= degatsReduits;
        action.degats = degatsReduits; // Mettre à jour les dégâts réels infligés
      }
      
      // Appliquer les soins
      if (action.soins && action.soins > 0) {
        hpEnnemi = Math.min(statsEnnemi.hp, hpEnnemi + action.soins);
      }
      
      // Enregistrer l'action
      logs.push({
        tour,
        action,
        hpJoueur,
        hpEnnemi
      });
    }
    
    // Alterner les tours
    tourJoueur = !tourJoueur;
  }
  
  // Déterminer le vainqueur
  const victoire = hpJoueur > 0 && hpEnnemi <= 0;
  
  // Préparer le résultat
  const resultat: ResultatCombat = {
    victoire,
    logs
  };
  
  // Ajouter les récompenses en cas de victoire
  if (victoire) {
    resultat.recompenses = ennemi.recompenses;
  }
  
  return resultat;
};

// Fonction pour générer une action de combat
const genererActionCombat = (
  attaquant: Personnage | Ennemi, 
  defenseur: Personnage | Ennemi, 
  source: 'joueur' | 'ennemi'
): ActionCombat => {
  // Probabilités des différentes actions
  const probAttaque = 0.7;
  const probTechnique = 0.2;
  const probDefense = 0.1;
  
  const rand = Math.random();
  
  if (rand < probAttaque) {
    // Attaque normale
    const degats = attaquant.stats.degat;
    
    // Vérifier si le défenseur esquive (basé sur l'esquive et la précision)
    // Plus la précision de l'attaquant est élevée, moins le défenseur a de chances d'esquiver
    const ratioEsquivePrecision = defenseur.stats.esquive / (defenseur.stats.esquive + attaquant.stats.precision);
    const chanceEsquive = ratioEsquivePrecision * 0.8; // Facteur d'ajustement pour que l'esquive ne soit pas trop fréquente
    const esquive = Math.random() < chanceEsquive;
    
    if (esquive) {
      return {
        type: 'esquive',
        source,
        nom: 'Esquive',
        description: `${defenseur.nom} esquive l'attaque de ${attaquant.nom}!`,
        degats: 0
      };
    }
    
    return {
      type: 'attaque',
      source,
      nom: 'Attaque',
      description: `${attaquant.nom} attaque ${defenseur.nom} avec précision!`,
      degats
    };
  } else if (rand < probAttaque + probTechnique) {
    // Utilisation d'une technique (à améliorer avec de vraies techniques)
    const multiplicateur = 1.5; // Les techniques font plus de dégâts
    const degats = Math.round(attaquant.stats.degat * multiplicateur);
    
    // Les techniques sont également affectées par la précision, mais moins que les attaques normales
    const ratioEsquivePrecision = defenseur.stats.esquive / (defenseur.stats.esquive + attaquant.stats.precision * 1.2);
    const chanceEsquive = ratioEsquivePrecision * 0.6; // Facteur d'ajustement pour les techniques
    const esquive = Math.random() < chanceEsquive;
    
    if (esquive) {
      return {
        type: 'esquive',
        source,
        nom: 'Esquive Technique',
        description: `${defenseur.nom} esquive habilement la technique de ${attaquant.nom}!`,
        degats: 0
      };
    }
    
    return {
      type: 'technique',
      source,
      nom: 'Technique Spirituelle',
      description: `${attaquant.nom} utilise une technique spirituelle puissante contre ${defenseur.nom}!`,
      degats,
      effets: ['Dégâts augmentés']
    };
  } else {
    // Défense
    const bonusDefense = Math.round(attaquant.stats.resistance * 0.2);
    
    return {
      type: 'defense',
      source,
      nom: 'Posture Défensive',
      description: `${attaquant.nom} adopte une posture défensive!`,
      soins: bonusDefense,
      effets: ['Résistance augmentée']
    };
  }
};

// Fonction pour appliquer les récompenses de combat
export const appliquerRecompensesCombat = (personnage: Personnage, recompenses: ResultatCombat['recompenses']): Personnage => {
  if (!recompenses) return personnage;
  
  const personnageModifie = { ...personnage };
  
  // Ajouter les pierres spirituelles
  personnageModifie.pierresSpirituelles += recompenses.pierresSpirituelles;
  
  // Ajouter les points de contribution si le personnage appartient à une secte
  if (personnageModifie.appartenanceSecte) {
    personnageModifie.appartenanceSecte.pointsContribution += recompenses.pointsContribution;
  }
  
  // Ajouter de l'expérience sous forme de points de Qi
  personnageModifie.pointsQi += recompenses.experience;
  personnageModifie.pointsQiTotal += recompenses.experience;
  
  // Recalculer les statistiques dérivées avec le multiplicateur du royaume
  const statsCombat = calculerStatsCombat(personnageModifie.stats, personnageModifie.royaumeCultivation);
  personnageModifie.stats.hp = statsCombat.hp;
  personnageModifie.stats.degat = statsCombat.degat;
  personnageModifie.stats.esquive = statsCombat.esquive;
  personnageModifie.stats.resistance = statsCombat.resistance;
  personnageModifie.stats.precision = statsCombat.precision;
  
  return personnageModifie;
};

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

// Fonction pour vérifier si le personnage peut défier un rang supérieur
export const peutDefierRangSuperieur = (personnage: Personnage): boolean => {
  if (!personnage.appartenanceSecte) return false;
  
  const rangActuel = personnage.appartenanceSecte.rang;
  
  // Vérifier si le personnage n'est pas déjà au rang maximum
  if (rangActuel === RangSecte.PATRIARCHE) return false;
  
  // Vérifier les conditions spécifiques pour chaque rang
  switch (rangActuel) {
    case RangSecte.DISCIPLE_EXTERNE:
      return estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.QI_CONDENSE) && 
             personnage.appartenanceSecte.pointsContribution >= 100;
    
    case RangSecte.DISCIPLE_INTERNE:
      return estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.FONDATION) && 
             personnage.appartenanceSecte.pointsContribution >= 300;
    
    case RangSecte.DISCIPLE_PRINCIPAL:
      return estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.CORE_OR) && 
             personnage.appartenanceSecte.pointsContribution >= 1000;
    
    case RangSecte.DOYEN:
      return estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.NASCENT_SOUL) && 
             personnage.appartenanceSecte.pointsContribution >= 3000;
    
    case RangSecte.ANCIEN:
      return estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.TRANSCENDANCE) && 
             personnage.appartenanceSecte.pointsContribution >= 10000;
    
    case RangSecte.GRAND_ANCIEN:
      return estRoyaumeSuperieureOuEgal(personnage.royaumeCultivation, RoyaumeCultivation.SAINT_MARTIAL) && 
             personnage.appartenanceSecte.pointsContribution >= 30000;
    
    default:
      return false;
  }
};

// Fonction pour obtenir le prochain rang
export const getProchainRang = (rangActuel: RangSecte): RangSecte | null => {
  switch (rangActuel) {
    case RangSecte.DISCIPLE_EXTERNE:
      return RangSecte.DISCIPLE_INTERNE;
    case RangSecte.DISCIPLE_INTERNE:
      return RangSecte.DISCIPLE_PRINCIPAL;
    case RangSecte.DISCIPLE_PRINCIPAL:
      return RangSecte.DOYEN;
    case RangSecte.DOYEN:
      return RangSecte.ANCIEN;
    case RangSecte.ANCIEN:
      return RangSecte.GRAND_ANCIEN;
    case RangSecte.GRAND_ANCIEN:
      return RangSecte.PATRIARCHE;
    case RangSecte.PATRIARCHE:
      return null; // Pas de rang supérieur
    default:
      return null;
  }
};

// Fonction pour promouvoir le personnage au rang supérieur
export const promouvoirPersonnage = (personnage: Personnage): Personnage => {
  if (!personnage.appartenanceSecte) return personnage;
  
  const personnageModifie = { ...personnage };
  
  if (!personnageModifie.appartenanceSecte) return personnage;
  
  const rangActuel = personnageModifie.appartenanceSecte.rang;
  const prochainRang = getProchainRang(rangActuel);
  
  if (!prochainRang) return personnage;
  
  // Mettre à jour le rang en conservant toutes les propriétés existantes
  personnageModifie.appartenanceSecte = {
    secteId: personnageModifie.appartenanceSecte.secteId,
    dateAdhesion: personnageModifie.appartenanceSecte.dateAdhesion,
    rang: prochainRang,
    pointsContribution: personnageModifie.appartenanceSecte.pointsContribution,
    techniquesApprises: personnageModifie.appartenanceSecte.techniquesApprises,
    missionsCompletees: personnageModifie.appartenanceSecte.missionsCompletees,
    ressourcesObtenues: personnageModifie.appartenanceSecte.ressourcesObtenues,
    relationAnciens: personnageModifie.appartenanceSecte.relationAnciens
  };
  
  return personnageModifie;
}; 