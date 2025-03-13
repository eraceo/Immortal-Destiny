// Énumérations pour les raretés
export enum Rarete {
  COMMUN = "Commun",
  RARE = "Rare",
  EPIQUE = "Épique",
  LEGENDAIRE = "Légendaire",
  MYTHIQUE = "Mythique"
}

// Énumérations pour les royaumes de cultivation
export enum RoyaumeCultivation {
  MORTEL = "Royaume du Mortel",
  INITIATION = "Royaume de l'Initiation",
  QI_CONDENSE = "Royaume du Qi Condensé",
  FONDATION = "Royaume de la Fondation",
  CORE_OR = "Royaume du Core d'Or",
  NASCENT_SOUL = "Royaume du Nascent Soul",
  TRANSCENDANCE = "Royaume de la Transcendance",
  SAINT_MARTIAL = "Royaume du Saint Martial",
  DEMI_DIEU = "Royaume du Demi-Dieu",
  DIVIN_SUPREME = "Royaume du Divin Suprême"
}

// Énumérations pour les niveaux de percée dans chaque royaume
export enum NiveauPercee {
  PREMIER = "Premier Niveau",
  INTERMEDIAIRE = "Niveau Intermédiaire",
  AVANCE = "Niveau Avancé"
}

// Énumérations pour les races
export enum Race {
  HUMAIN = "Humain",
  DEMON = "Démon",
  ESPRIT = "Esprit",
  BETE_SPIRITUELLE = "Bête Spirituelle",
  IMMORTEL_CELESTE = "Immortel Céleste"
}

// Énumérations pour les origines familiales
export enum Origine {
  FAMILLE_PAYSANNE = "Famille Paysanne",
  FAMILLE_MARCHANDE = "Famille Marchande",
  FAMILLE_ARTISANS = "Famille d'Artisans",
  FAMILLE_BANDITS = "Famille de Bandits",
  FAMILLE_ARTS_MARTIAUX = "Famille d'Arts Martiaux",
  FAMILLE_LETTRÉS = "Famille de Lettrés",
  FAMILLE_NOBLE = "Famille Noble",
  FAMILLE_ROYALE = "Famille Royale",
  LIGNÉE_IMMORTELLE = "Lignée Immortelle"
}

// Énumérations pour le genre
export enum Genre {
  MASCULIN = "Masculin",
  FEMININ = "Féminin",
  AUTRE = "Autre"
}

// Énumérations pour les types d'événements
export enum TypeEvenement {
  POSITIF = "Positif",
  NEUTRE = "Neutre",
  NEGATIF = "Négatif",
  SPECIAL = "Spécial"
}

// Énumérations pour les types de sectes
export enum TypeSecte {
  MARTIALE = "Secte Martiale",
  SPIRITUELLE = "Secte Spirituelle",
  ALCHIMIQUE = "Secte Alchimique",
  DEMONIAQUE = "Secte Démoniaque",
  CELESTE = "Secte Céleste",
  NEUTRE = "Secte Neutre"
}

// Énumérations pour les rangs dans une secte
export enum RangSecte {
  DISCIPLE_EXTERNE = "Disciple Externe",
  DISCIPLE_INTERNE = "Disciple Interne",
  DISCIPLE_PRINCIPAL = "Disciple Principal",
  DOYEN = "Doyen",
  ANCIEN = "Ancien",
  GRAND_ANCIEN = "Grand Ancien",
  PATRIARCHE = "Patriarche"
}

// Énumérations pour les éléments de cultivation
export enum ElementCultivation {
  FEU = "Feu",
  EAU = "Eau",
  BOIS = "Bois",
  METAL = "Métal",
  TERRE = "Terre",
  FOUDRE = "Foudre",
  LUMIERE = "Lumière",
  OBSCURITE = "Obscurité"
}

// Constantes pour le système de temps et d'âge
export const TEMPS_REEL_PAR_ANNEE_JEU = 5; // 1 minute réelle = 12 mois (1 an) dans le jeu
export const MOIS_PAR_MINUTE = 12; // 12 mois par minute de temps réel
export const AGE_INITIAL_MIN = 16;
export const AGE_INITIAL_MAX = 25;

// Espérance de vie de base par race (en années)
export const ESPERANCE_VIE_BASE: Record<Race, number> = {
  [Race.HUMAIN]: 80,
  [Race.DEMON]: 300,
  [Race.ESPRIT]: 500,
  [Race.BETE_SPIRITUELLE]: 800,
  [Race.IMMORTEL_CELESTE]: 2000
};

// Multiplicateur d'espérance de vie par royaume de cultivation
export const MULTIPLICATEUR_ESPERANCE_VIE: Record<RoyaumeCultivation, number> = {
  [RoyaumeCultivation.MORTEL]: 1,
  [RoyaumeCultivation.INITIATION]: 1.5,
  [RoyaumeCultivation.QI_CONDENSE]: 2,
  [RoyaumeCultivation.FONDATION]: 3,
  [RoyaumeCultivation.CORE_OR]: 5,
  [RoyaumeCultivation.NASCENT_SOUL]: 10,
  [RoyaumeCultivation.TRANSCENDANCE]: 20,
  [RoyaumeCultivation.SAINT_MARTIAL]: 50,
  [RoyaumeCultivation.DEMI_DIEU]: 200,
  [RoyaumeCultivation.DIVIN_SUPREME]: 1000
};

// Détails des noms spécifiques pour chaque niveau de percée dans chaque royaume
export const NOMS_PERCEES: Record<RoyaumeCultivation, Record<NiveauPercee, string>> = {
  [RoyaumeCultivation.MORTEL]: {
    [NiveauPercee.PREMIER]: "Aspirant (初学者)",
    [NiveauPercee.INTERMEDIAIRE]: "Disciple (学徒)",
    [NiveauPercee.AVANCE]: "Expert (高手)"
  },
  [RoyaumeCultivation.INITIATION]: {
    [NiveauPercee.PREMIER]: "Réveil Spirituel (觉醒)",
    [NiveauPercee.INTERMEDIAIRE]: "Accord Énergétique (协调气息)",
    [NiveauPercee.AVANCE]: "Refinement du Qi (淬炼气息)"
  },
  [RoyaumeCultivation.QI_CONDENSE]: {
    [NiveauPercee.PREMIER]: "Premier Flux (一流气)",
    [NiveauPercee.INTERMEDIAIRE]: "Deuxième Flux (二流气)",
    [NiveauPercee.AVANCE]: "Troisième Flux (三流气)"
  },
  [RoyaumeCultivation.FONDATION]: {
    [NiveauPercee.PREMIER]: "Formation du Dantian (初筑基)",
    [NiveauPercee.INTERMEDIAIRE]: "Stabilisation (稳固筑基)",
    [NiveauPercee.AVANCE]: "Perfection (圆满筑基)"
  },
  [RoyaumeCultivation.CORE_OR]: {
    [NiveauPercee.PREMIER]: "Formation du Core (凝丹)",
    [NiveauPercee.INTERMEDIAIRE]: "Éveil du Core (觉丹)",
    [NiveauPercee.AVANCE]: "Perfection du Core (圆满金丹)"
  },
  [RoyaumeCultivation.NASCENT_SOUL]: {
    [NiveauPercee.PREMIER]: "Embryon Spirituel (初生婴)",
    [NiveauPercee.INTERMEDIAIRE]: "Maturation Spirituelle (成长婴)",
    [NiveauPercee.AVANCE]: "Âme Complète (圆满元婴)"
  },
  [RoyaumeCultivation.TRANSCENDANCE]: {
    [NiveauPercee.PREMIER]: "Éveil Divin (初化神)",
    [NiveauPercee.INTERMEDIAIRE]: "Ascension Mineure (小成化神)",
    [NiveauPercee.AVANCE]: "Souverain Spirituel (大成化神)"
  },
  [RoyaumeCultivation.SAINT_MARTIAL]: {
    [NiveauPercee.PREMIER]: "Saint Mineur (小圣)",
    [NiveauPercee.INTERMEDIAIRE]: "Saint Majeur (大圣)",
    [NiveauPercee.AVANCE]: "Saint Suprême (无上圣者)"
  },
  [RoyaumeCultivation.DEMI_DIEU]: {
    [NiveauPercee.PREMIER]: "Marcheur Divin (初步神道)",
    [NiveauPercee.INTERMEDIAIRE]: "Emprise Céleste (掌控天道)",
    [NiveauPercee.AVANCE]: "Quasi-Divin (半神巅峰)"
  },
  [RoyaumeCultivation.DIVIN_SUPREME]: {
    [NiveauPercee.PREMIER]: "Dieu Mineur (小神)",
    [NiveauPercee.INTERMEDIAIRE]: "Dieu Céleste (天神)",
    [NiveauPercee.AVANCE]: "Dieu Suprême (无上神王)"
  }
};

// Descriptions des royaumes de cultivation
export const DESCRIPTIONS_ROYAUMES: Record<RoyaumeCultivation, string> = {
  [RoyaumeCultivation.MORTEL]: "Les cultivateurs sont encore faibles, à peine capables de manipuler l'énergie spirituelle.",
  [RoyaumeCultivation.INITIATION]: "Les cultivateurs commencent à absorber et manipuler le Qi.",
  [RoyaumeCultivation.QI_CONDENSE]: "Le Qi devient plus dense et l'utilisateur acquiert des compétences mineures.",
  [RoyaumeCultivation.FONDATION]: "Les cultivateurs stabilisent leur Qi et commencent à utiliser des techniques avancées.",
  [RoyaumeCultivation.CORE_OR]: "Leur Qi se cristallise en un noyau interne, augmentant leur puissance.",
  [RoyaumeCultivation.NASCENT_SOUL]: "Ils développent une âme séparée de leur corps, renforçant leur longévité.",
  [RoyaumeCultivation.TRANSCENDANCE]: "Ils peuvent utiliser leur esprit pour influencer le monde physique.",
  [RoyaumeCultivation.SAINT_MARTIAL]: "Leur force dépasse celle des mortels, ils peuvent manipuler les lois de la nature.",
  [RoyaumeCultivation.DEMI_DIEU]: "Ils défient les lois du monde, devenant presque des dieux.",
  [RoyaumeCultivation.DIVIN_SUPREME]: "Ils contrôlent des lois universelles et façonnent la réalité à volonté."
};

// Points de Qi requis pour chaque percée
export const QI_REQUIS_PERCEE: Record<RoyaumeCultivation, Record<NiveauPercee, number>> = {
  [RoyaumeCultivation.MORTEL]: {
    [NiveauPercee.PREMIER]: 0,
    [NiveauPercee.INTERMEDIAIRE]: 300,
    [NiveauPercee.AVANCE]: 900
  },
  [RoyaumeCultivation.INITIATION]: {
    [NiveauPercee.PREMIER]: 1800,
    [NiveauPercee.INTERMEDIAIRE]: 3000,
    [NiveauPercee.AVANCE]: 4500
  },
  [RoyaumeCultivation.QI_CONDENSE]: {
    [NiveauPercee.PREMIER]: 6300,
    [NiveauPercee.INTERMEDIAIRE]: 8400,
    [NiveauPercee.AVANCE]: 10800
  },
  [RoyaumeCultivation.FONDATION]: {
    [NiveauPercee.PREMIER]: 13500,
    [NiveauPercee.INTERMEDIAIRE]: 16500,
    [NiveauPercee.AVANCE]: 19800
  },
  [RoyaumeCultivation.CORE_OR]: {
    [NiveauPercee.PREMIER]: 24000,
    [NiveauPercee.INTERMEDIAIRE]: 30000,
    [NiveauPercee.AVANCE]: 37500
  },
  [RoyaumeCultivation.NASCENT_SOUL]: {
    [NiveauPercee.PREMIER]: 45000,
    [NiveauPercee.INTERMEDIAIRE]: 54000,
    [NiveauPercee.AVANCE]: 66000
  },
  [RoyaumeCultivation.TRANSCENDANCE]: {
    [NiveauPercee.PREMIER]: 78000,
    [NiveauPercee.INTERMEDIAIRE]: 93000,
    [NiveauPercee.AVANCE]: 111000
  },
  [RoyaumeCultivation.SAINT_MARTIAL]: {
    [NiveauPercee.PREMIER]: 132000,
    [NiveauPercee.INTERMEDIAIRE]: 156000,
    [NiveauPercee.AVANCE]: 183000
  },
  [RoyaumeCultivation.DEMI_DIEU]: {
    [NiveauPercee.PREMIER]: 216000,
    [NiveauPercee.INTERMEDIAIRE]: 255000,
    [NiveauPercee.AVANCE]: 300000
  },
  [RoyaumeCultivation.DIVIN_SUPREME]: {
    [NiveauPercee.PREMIER]: 360000,
    [NiveauPercee.INTERMEDIAIRE]: 450000,
    [NiveauPercee.AVANCE]: 600000
  }
};

// Interface pour les races avec rareté
export interface RaceInfo {
  nom: Race;
  rarete: Rarete;
  description: string;
}

// Interface pour les origines avec rareté
export interface OrigineInfo {
  nom: Origine;
  rarete: Rarete;
  description: string;
  bonusStats?: Partial<Stats>; // Bonus de statistiques
  bonusPierresSpirituelles?: number; // Bonus de pierres spirituelles initiales
  bonusQi?: number; // Bonus de gain de Qi (pourcentage)
  bonusRelationSecte?: number; // Bonus de relation avec les anciens de la secte
  bonusApprentissage?: number; // Bonus d'apprentissage des techniques (pourcentage)
  bonusSpecial?: string; // Description d'un bonus spécial unique
}

// Interface pour les techniques de cultivation
export interface TechniqueCultivation {
  id: string;
  nom: string;
  description: string;
  rarete: Rarete;
  element: ElementCultivation;
  niveauRequis: RoyaumeCultivation;
  rangRequis?: RangSecte;         // Rang minimum requis dans la secte pour apprendre cette technique
  utilite: string[];              // Liste des utilisations pratiques de la technique
  effets: {
    multiplicateurQi?: number;       // Multiplicateur pour le gain de Qi
    bonusStats?: Partial<Stats>;     // Bonus aux statistiques
    reductionTemps?: number;         // Réduction du temps de cultivation (en %)
    bonusLongevite?: number;         // Bonus à l'espérance de vie (en %)
    resistanceElement?: ElementCultivation[]; // Résistance à certains éléments
  };
  coutApprentissage: number;         // Coût en pierres spirituelles pour apprendre
}

// Interface pour les ressources de secte
export interface RessourceSecte {
  id: string;
  nom: string;
  description: string;
  rarete: Rarete;
  quantite: number;
  effets: {
    gainQi?: number;                 // Gain immédiat de Qi
    bonusTemporaire?: Partial<Stats>; // Bonus temporaire aux statistiques
    dureeBonus?: number;             // Durée du bonus en années de jeu
  };
}

// Interface pour les missions de secte
export interface MissionSecte {
  id: string;
  titre: string;
  description: string;
  difficulte: Rarete;
  duree: number;                     // Durée en années de jeu
  recompenses: {
    pierresSpirituelles?: number;
    ressources?: RessourceSecte[];
    techniques?: TechniqueCultivation[];
    pointsContribution?: number;
    experience?: number;
  };
  conditionsRequises: {
    royaumeMinimum?: RoyaumeCultivation;
    statsMinimales?: Partial<Stats>;
    rangMinimum?: RangSecte;
  };
  complete: boolean;
}

// Interface pour les sectes
export interface Secte {
  id: string;
  nom: string;
  description: string;
  type: TypeSecte;
  rarete: Rarete;
  elementPrincipal: ElementCultivation;
  elementsSecondaires: ElementCultivation[];
  techniques: TechniqueCultivation[];
  ressources: RessourceSecte[];
  missions: MissionSecte[];
  avantages: {
    multiplicateurQi: number;        // Multiplicateur pour le gain de Qi
    bonusStats: Partial<Stats>;      // Bonus aux statistiques
    reductionCoutPercee: number;    // Réduction du coût pour les percées (en %)
    bonusLongevite: number;          // Bonus à l'espérance de vie (en %)
  };
  conditionsAdmission: {
    royaumeMinimum: RoyaumeCultivation;
    statsMinimales: Partial<Stats>;
    raceCompatible?: Race[];
  };
  relationSectes: Record<string, number>; // ID de secte -> valeur de relation (-100 à 100)
}

// Interface pour l'appartenance à une secte
export interface AppartenanceSecte {
  secteId: string;
  dateAdhesion: number;              // Timestamp de l'adhésion
  rang: RangSecte;
  pointsContribution: number;        // Points de contribution à la secte
  techniquesApprises: string[];      // IDs des techniques apprises
  missionsCompletees: string[];      // IDs des missions complétées
  ressourcesObtenues: Record<string, number>; // ID de ressource -> quantité
  relationAnciens: number;           // Relation avec les anciens (-100 à 100)
}

// Interface pour les statistiques du personnage
export interface Stats {
  force: number;       // Force physique
  agilite: number;     // Vitesse et réflexes
  constitution: number; // Santé et endurance
  intelligence: number; // Capacité d'apprentissage
  perception: number;   // Sens et intuition
  charisme: number;     // Influence sociale
  chance: number;       // Chance et destin
  qi: number;           // Énergie spirituelle
  // Nouvelles statistiques dérivées
  hp: number;           // Points de vie
  degat: number;        // Dégâts infligés
  esquive: number;      // Capacité d'esquive
  resistance: number;   // Résistance aux dégâts
}

// Interface pour le personnage
export interface Personnage {
  id: string;
  nom: string;
  genre: Genre;
  race: Race;
  origine: Origine;
  stats: Stats;
  pointsQi: number;
  pointsQiTotal: number;
  royaumeCultivation: RoyaumeCultivation;
  niveauPercee: NiveauPercee;
  qiRequis: number;
  // Système de temps et d'âge
  age: number;
  dateNaissance: number; // Timestamp de création du personnage
  dernierTempsJeu: number; // Timestamp de la dernière fois que le joueur a joué
  tempsJeuTotal: number; // Temps total de jeu en secondes
  tempsEcoule: number; // Temps écoulé pendant la méditation en années
  // Système monétaire
  pierresSpirituelles: number; // Monnaie du jeu
  // Système de sectes
  appartenanceSecte: AppartenanceSecte | null;
  techniquesApprises: TechniqueCultivation[];
  affiniteElements: Record<ElementCultivation, number>; // Affinité avec chaque élément (0-100)
  talentCultivation: number; // Talent de cultivation (0-100)
  // Bonus liés à l'origine
  bonusQi?: number; // Bonus de gain de Qi (pourcentage)
  bonusApprentissage?: number; // Bonus d'apprentissage des techniques (pourcentage)
  bonusSpecial?: string; // Description d'un bonus spécial unique
}

// Constantes pour les limites de statistiques
export const STAT_MAX_CREATION = 10; // Maximum lors de la création du personnage
export const STAT_MAX_JEU = 100;     // Maximum atteignable pendant le jeu

// Fonction pour calculer l'espérance de vie d'un personnage
export const calculerEsperanceVie = (race: Race, royaumeCultivation: RoyaumeCultivation): number => {
  const esperanceVieBase = ESPERANCE_VIE_BASE[race];
  const multiplicateur = MULTIPLICATEUR_ESPERANCE_VIE[royaumeCultivation];
  return Math.floor(esperanceVieBase * multiplicateur);
};

// Fonction pour générer un âge initial aléatoire
export const genererAgeInitial = (): number => {
  return Math.floor(Math.random() * (AGE_INITIAL_MAX - AGE_INITIAL_MIN + 1)) + AGE_INITIAL_MIN;
};

// Fonction pour calculer l'âge actuel du personnage
export const calculerAgeActuel = (personnage: Personnage): number => {
  // L'âge est maintenant simplement l'âge stocké dans le personnage
  return personnage.age;
};

// Fonction pour calculer le temps de jeu total formaté
export const formaterTempsJeu = (tempsEnSecondes: number): string => {
  const heures = Math.floor(tempsEnSecondes / 3600);
  const minutes = Math.floor((tempsEnSecondes % 3600) / 60);
  const secondes = Math.floor(tempsEnSecondes % 60);
  
  return `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
};

// Fonction pour obtenir le nom complet du niveau de cultivation
export const getNomCompletCultivation = (royaume: RoyaumeCultivation, niveau: NiveauPercee): string => {
  return NOMS_PERCEES[royaume][niveau];
};

// Fonction pour obtenir la description du royaume de cultivation
export const getDescriptionRoyaume = (royaume: RoyaumeCultivation): string => {
  return DESCRIPTIONS_ROYAUMES[royaume];
};

// Fonction pour obtenir le prochain niveau de cultivation et les points de Qi requis
export const getProchainNiveau = (royaume: RoyaumeCultivation, niveau: NiveauPercee): { royaume: RoyaumeCultivation, niveau: NiveauPercee, qiRequis: number } => {
  if (niveau === NiveauPercee.AVANCE) {
    // Passer au prochain royaume
    const royaumeIndex = Object.values(RoyaumeCultivation).indexOf(royaume);
    if (royaumeIndex < Object.values(RoyaumeCultivation).length - 1) {
      const prochainRoyaume = Object.values(RoyaumeCultivation)[royaumeIndex + 1];
      return {
        royaume: prochainRoyaume,
        niveau: NiveauPercee.PREMIER,
        qiRequis: QI_REQUIS_PERCEE[prochainRoyaume][NiveauPercee.PREMIER]
      };
    }
    // Déjà au niveau maximum
    return {
      royaume,
      niveau,
      qiRequis: QI_REQUIS_PERCEE[royaume][niveau]
    };
  } else {
    // Passer au prochain niveau dans le même royaume
    const niveauIndex = Object.values(NiveauPercee).indexOf(niveau);
    const prochainNiveau = Object.values(NiveauPercee)[niveauIndex + 1];
    return {
      royaume,
      niveau: prochainNiveau,
      qiRequis: QI_REQUIS_PERCEE[royaume][prochainNiveau]
    };
  }
};

// Données des races avec leurs raretés et descriptions
export const RACES_INFO: RaceInfo[] = [
  {
    nom: Race.HUMAIN,
    rarete: Rarete.COMMUN,
    description: "Les humains sont adaptables et équilibrés. Ils progressent rapidement dans leur cultivation."
  },
  {
    nom: Race.DEMON,
    rarete: Rarete.RARE,
    description: "Les démons possèdent une force innée et une affinité pour les arts martiaux sombres."
  },
  {
    nom: Race.ESPRIT,
    rarete: Rarete.RARE,
    description: "Les esprits ont une connexion naturelle avec les éléments et une grande intelligence."
  },
  {
    nom: Race.BETE_SPIRITUELLE,
    rarete: Rarete.EPIQUE,
    description: "Les bêtes spirituelles possèdent des corps puissants et des capacités uniques liées à leur nature animale."
  },
  {
    nom: Race.IMMORTEL_CELESTE,
    rarete: Rarete.LEGENDAIRE,
    description: "Les immortels célestes sont bénis par les cieux, avec un talent inné pour la cultivation et une longévité exceptionnelle."
  }
];

// Données des origines familiales avec leurs raretés et descriptions
export const ORIGINES_INFO: OrigineInfo[] = [
  {
    nom: Origine.FAMILLE_PAYSANNE,
    rarete: Rarete.COMMUN,
    description: "Une famille modeste travaillant la terre. Vous avez développé une forte endurance et une connexion avec la nature.",
    bonusStats: { constitution: 2 },
    bonusPierresSpirituelles: 50,
    bonusQi: 5,
    bonusRelationSecte: 0,
    bonusApprentissage: 0,
    bonusSpecial: "Endurance Naturelle: Vous récupérez plus rapidement de la fatigue lors de la méditation."
  },
  {
    nom: Origine.FAMILLE_MARCHANDE,
    rarete: Rarete.COMMUN,
    description: "Une famille de commerçants. Vous avez un talent naturel pour la négociation et une bonne compréhension des relations sociales.",
    bonusStats: { charisme: 2 },
    bonusPierresSpirituelles: 200,
    bonusQi: 0,
    bonusRelationSecte: 5,
    bonusApprentissage: 0,
    bonusSpecial: "Sens des Affaires: Vous obtenez 10% de réduction sur tous les achats."
  },
  {
    nom: Origine.FAMILLE_ARTISANS,
    rarete: Rarete.COMMUN,
    description: "Une famille spécialisée dans l'artisanat. Vous avez une grande dextérité et un œil pour les détails.",
    bonusStats: { agilite: 1, perception: 1 },
    bonusPierresSpirituelles: 100,
    bonusQi: 0,
    bonusRelationSecte: 0,
    bonusApprentissage: 10,
    bonusSpecial: "Main Habile: Vous avez 15% de chances supplémentaires de réussir la création d'objets."
  },
  {
    nom: Origine.FAMILLE_BANDITS,
    rarete: Rarete.RARE,
    description: "Une famille vivant en marge de la société. Vous avez appris à survivre par tous les moyens et connaissez les arts de l'infiltration.",
    bonusStats: { agilite: 2, perception: 1 },
    bonusPierresSpirituelles: 150,
    bonusQi: 0,
    bonusRelationSecte: -10,
    bonusApprentissage: 5,
    bonusSpecial: "Ombre Furtive: Vous avez 20% de chances supplémentaires d'éviter les dangers lors de l'exploration."
  },
  {
    nom: Origine.FAMILLE_ARTS_MARTIAUX,
    rarete: Rarete.RARE,
    description: "Une famille pratiquant les arts martiaux depuis des générations. Vous avez été formé aux techniques de combat dès votre plus jeune âge.",
    bonusStats: { force: 2, agilite: 1 },
    bonusPierresSpirituelles: 100,
    bonusQi: 10,
    bonusRelationSecte: 10,
    bonusApprentissage: 15,
    bonusSpecial: "Héritage Martial: Vous commencez avec une technique de combat de base déjà maîtrisée."
  },
  {
    nom: Origine.FAMILLE_LETTRÉS,
    rarete: Rarete.RARE,
    description: "Une famille d'érudits et de sages. Vous avez une connaissance approfondie des textes anciens et des théories de cultivation.",
    bonusStats: { intelligence: 2, perception: 1 },
    bonusPierresSpirituelles: 100,
    bonusQi: 5,
    bonusRelationSecte: 5,
    bonusApprentissage: 25,
    bonusSpecial: "Sagesse Ancestrale: Vous avez 30% de chances supplémentaires de comprendre les textes anciens."
  },
  {
    nom: Origine.FAMILLE_NOBLE,
    rarete: Rarete.EPIQUE,
    description: "Une famille de la haute noblesse. Vous avez accès à des ressources rares et avez reçu une éducation privilégiée.",
    bonusStats: { charisme: 2, intelligence: 1, chance: 1 },
    bonusPierresSpirituelles: 500,
    bonusQi: 10,
    bonusRelationSecte: 20,
    bonusApprentissage: 10,
    bonusSpecial: "Connexions Influentes: Vous avez accès à des missions spéciales et des ressources exclusives."
  },
  {
    nom: Origine.FAMILLE_ROYALE,
    rarete: Rarete.LEGENDAIRE,
    description: "Une famille de sang royal. Vous êtes né avec un statut élevé et avez accès aux meilleurs maîtres et ressources du royaume.",
    bonusStats: { charisme: 2, intelligence: 2, chance: 2 },
    bonusPierresSpirituelles: 1000,
    bonusQi: 20,
    bonusRelationSecte: 30,
    bonusApprentissage: 20,
    bonusSpecial: "Sang Royal: Vous avez une aura naturelle qui impressionne les autres et ouvre de nombreuses portes."
  },
  {
    nom: Origine.LIGNÉE_IMMORTELLE,
    rarete: Rarete.MYTHIQUE,
    description: "Une lignée descendant directement des immortels. Votre sang contient des traces d'énergie divine et votre potentiel est illimité.",
    bonusStats: { qi: 3, intelligence: 2, chance: 2 },
    bonusPierresSpirituelles: 2000,
    bonusQi: 50,
    bonusRelationSecte: 50,
    bonusApprentissage: 50,
    bonusSpecial: "Héritage Divin: Votre corps possède une affinité naturelle avec l'énergie céleste, accélérant considérablement votre progression."
  }
];

// Fonction pour obtenir les informations d'une race
export const getRaceInfo = (race: Race): RaceInfo => {
  return RACES_INFO.find(info => info.nom === race) || RACES_INFO[0];
};

// Fonction pour obtenir les informations d'une origine
export const getOrigineInfo = (origine: Origine): OrigineInfo => {
  return ORIGINES_INFO.find(info => info.nom === origine) || ORIGINES_INFO[0];
};

// Fonction pour générer des statistiques aléatoires
export const genererStatsAleatoires = (): Stats => {
  // Générer d'abord les statistiques de base
  const force = Math.floor(Math.random() * 10) + 1;
  const agilite = Math.floor(Math.random() * 10) + 1;
  const constitution = Math.floor(Math.random() * 10) + 1;
  const intelligence = Math.floor(Math.random() * 10) + 1;
  const perception = Math.floor(Math.random() * 10) + 1;
  const charisme = Math.floor(Math.random() * 10) + 1;
  const chance = Math.floor(Math.random() * 10) + 1;
  const qi = Math.floor(Math.random() * 10) + 1;
  
  // Calculer les statistiques dérivées
  const hp = constitution * 10 + force * 5;
  const degat = force * 2 + qi;
  const esquive = agilite * 1.5 + perception * 0.5;
  const resistance = constitution * 1.5 + force * 0.5;
  
  return {
    force,
    agilite,
    constitution,
    intelligence,
    perception,
    charisme,
    chance,
    qi,
    hp,
    degat,
    esquive,
    resistance
  };
};

// Fonction pour générer une race aléatoire avec pondération basée sur la rareté
export const genererRaceAleatoire = (): Race => {
  const random = Math.random() * 100;
  
  if (random < 70) { // 70% de chance pour Commun
    return Race.HUMAIN;
  } else if (random < 90) { // 20% de chance pour Rare
    return Math.random() < 0.5 ? Race.DEMON : Race.ESPRIT;
  } else if (random < 99) { // 9% de chance pour Épique
    return Race.BETE_SPIRITUELLE;
  } else { // 1% de chance pour Légendaire
    return Race.IMMORTEL_CELESTE;
  }
};

// Fonction pour générer une origine aléatoire avec pondération basée sur la rareté
export const genererOrigineAleatoire = (): Origine => {
  const random = Math.random() * 100;
  
  if (random < 60) { // 60% de chance pour Commun
    const originesCommunes = [Origine.FAMILLE_PAYSANNE, Origine.FAMILLE_MARCHANDE, Origine.FAMILLE_ARTISANS];
    return originesCommunes[Math.floor(Math.random() * originesCommunes.length)];
  } else if (random < 85) { // 25% de chance pour Rare
    const originesRares = [Origine.FAMILLE_BANDITS, Origine.FAMILLE_ARTS_MARTIAUX, Origine.FAMILLE_LETTRÉS];
    return originesRares[Math.floor(Math.random() * originesRares.length)];
  } else if (random < 95) { // 10% de chance pour Épique
    return Origine.FAMILLE_NOBLE;
  } else if (random < 99.5) { // 4.5% de chance pour Légendaire
    return Origine.FAMILLE_ROYALE;
  } else { // 0.5% de chance pour Mythique
    return Origine.LIGNÉE_IMMORTELLE;
  }
};

// Fonction pour obtenir la couleur associée à une rareté
export const getRareteColor = (rarete: Rarete): string => {
  switch (rarete) {
    case Rarete.COMMUN:
      return '#9e9e9e'; // Gris
    case Rarete.RARE:
      return '#2196f3'; // Bleu
    case Rarete.EPIQUE:
      return '#9c27b0'; // Violet
    case Rarete.LEGENDAIRE:
      return '#ff9800'; // Orange
    case Rarete.MYTHIQUE:
      return '#f44336'; // Rouge
    default:
      return '#9e9e9e';
  }
};

// Fonction pour obtenir la couleur associée à un royaume de cultivation
export const getRoyaumeColor = (royaume: RoyaumeCultivation): string => {
  switch (royaume) {
    case RoyaumeCultivation.MORTEL:
      return '#9e9e9e'; // Gris
    case RoyaumeCultivation.INITIATION:
      return '#4caf50'; // Vert
    case RoyaumeCultivation.QI_CONDENSE:
      return '#2196f3'; // Bleu
    case RoyaumeCultivation.FONDATION:
      return '#3f51b5'; // Indigo
    case RoyaumeCultivation.CORE_OR:
      return '#9c27b0'; // Violet
    case RoyaumeCultivation.NASCENT_SOUL:
      return '#673ab7'; // Violet foncé
    case RoyaumeCultivation.TRANSCENDANCE:
      return '#ff9800'; // Orange
    case RoyaumeCultivation.SAINT_MARTIAL:
      return '#ff5722'; // Orange foncé
    case RoyaumeCultivation.DEMI_DIEU:
      return '#f44336'; // Rouge
    case RoyaumeCultivation.DIVIN_SUPREME:
      return '#e91e63'; // Rose
    default:
      return '#9e9e9e';
  }
};

// Fonction pour générer un ID unique
export const genererID = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Interface pour les événements
export interface Evenement {
  id: string;
  titre: string;
  description: string;
  type: TypeEvenement;
  effets: {
    qi?: number;            // Modification des points de Qi (positif ou négatif)
    stats?: Partial<Stats>; // Modification des stats (positif ou négatif)
    age?: number;           // Modification de l'âge (généralement négatif pour vieillissement accéléré)
    esperanceVie?: number;  // Modification de l'espérance de vie (positif ou négatif)
    pierresSpirituelles?: number; // Modification des pierres spirituelles (positif ou négatif)
  };
  rarete: Rarete;           // Rareté de l'événement
  conditionRoyaume?: RoyaumeCultivation[]; // Royaumes de cultivation requis pour que l'événement puisse se produire
}

// Liste des événements possibles
export const EVENEMENTS: Evenement[] = [
  // Événements positifs
  {
    id: "1",
    titre: "Découverte d'une source de Qi",
    description: "Vous avez découvert une source naturelle de Qi qui renforce votre cultivation.",
    type: TypeEvenement.POSITIF,
    effets: {
      qi: 500,
      stats: { qi: 2 }
    },
    rarete: Rarete.RARE
  },
  {
    id: "2",
    titre: "Illumination soudaine",
    description: "Une compréhension soudaine des principes du Dao vous a permis d'améliorer votre intelligence.",
    type: TypeEvenement.POSITIF,
    effets: {
      stats: { intelligence: 3 }
    },
    rarete: Rarete.RARE
  },
  {
    id: "3",
    titre: "Rencontre avec un maître errant",
    description: "Un maître errant vous a enseigné quelques techniques de base, améliorant votre compréhension du Qi.",
    type: TypeEvenement.POSITIF,
    effets: {
      stats: { qi: 1, intelligence: 1, perception: 1 }
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "4",
    titre: "Herbe médicinale rare",
    description: "Vous avez trouvé une herbe médicinale rare qui a renforcé votre constitution.",
    type: TypeEvenement.POSITIF,
    effets: {
      stats: { constitution: 2 },
      esperanceVie: 5
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "5",
    titre: "Méditation profonde",
    description: "Une session de méditation particulièrement profonde vous a permis de mieux comprendre votre propre Qi.",
    type: TypeEvenement.POSITIF,
    effets: {
      qi: 300,
      stats: { perception: 1 }
    },
    rarete: Rarete.COMMUN
  },
  
  // Événements neutres
  {
    id: "6",
    titre: "Rêve étrange",
    description: "Vous avez fait un rêve étrange qui vous a laissé perplexe, mais qui pourrait avoir une signification cachée.",
    type: TypeEvenement.NEUTRE,
    effets: {
      stats: { perception: 1, intelligence: -1 }
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "7",
    titre: "Changement climatique soudain",
    description: "Un changement climatique soudain a perturbé votre méditation, mais vous a endurci.",
    type: TypeEvenement.NEUTRE,
    effets: {
      qi: -100,
      stats: { constitution: 1 }
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "8",
    titre: "Rencontre avec un voyageur",
    description: "Vous avez rencontré un voyageur qui vous a raconté des histoires de terres lointaines.",
    type: TypeEvenement.NEUTRE,
    effets: {
      stats: { charisme: 1, qi: -1 }
    },
    rarete: Rarete.COMMUN
  },
  
  // Événements négatifs
  {
    id: "9",
    titre: "Déviation de Qi",
    description: "Votre Qi a dévié pendant votre méditation, causant des dommages internes.",
    type: TypeEvenement.NEGATIF,
    effets: {
      qi: -400,
      stats: { constitution: -2 },
      age: 1
    },
    rarete: Rarete.RARE
  },
  {
    id: "10",
    titre: "Attaque de bêtes sauvages",
    description: "Des bêtes sauvages ont attaqué votre lieu de méditation, vous forçant à fuir.",
    type: TypeEvenement.NEGATIF,
    effets: {
      qi: -200,
      stats: { force: 1, constitution: -1 }
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "11",
    titre: "Maladie mystérieuse",
    description: "Vous avez contracté une maladie mystérieuse qui affaiblit votre corps.",
    type: TypeEvenement.NEGATIF,
    effets: {
      stats: { constitution: -2, force: -1 },
      esperanceVie: -3
    },
    rarete: Rarete.RARE
  },
  {
    id: "12",
    titre: "Tempête de Qi",
    description: "Une tempête de Qi a perturbé l'environnement, rendant votre cultivation plus difficile.",
    type: TypeEvenement.NEGATIF,
    effets: {
      qi: -300,
      stats: { qi: -1 }
    },
    rarete: Rarete.COMMUN
  },
  
  // Événements spéciaux (plus rares)
  {
    id: "13",
    titre: "Héritage ancien",
    description: "Vous avez découvert un héritage ancien qui contient des techniques de cultivation oubliées.",
    type: TypeEvenement.SPECIAL,
    effets: {
      qi: 1000,
      stats: { intelligence: 3, qi: 3, perception: 2 }
    },
    rarete: Rarete.LEGENDAIRE,
    conditionRoyaume: [RoyaumeCultivation.FONDATION, RoyaumeCultivation.CORE_OR, RoyaumeCultivation.NASCENT_SOUL]
  },
  {
    id: "14",
    titre: "Tribulation céleste",
    description: "Vous avez subi une tribulation céleste qui a testé vos limites, mais vous en êtes sorti plus fort.",
    type: TypeEvenement.SPECIAL,
    effets: {
      qi: -500,
      stats: { force: 3, constitution: 3, qi: 3 },
      age: 2,
      esperanceVie: 10
    },
    rarete: Rarete.EPIQUE,
    conditionRoyaume: [RoyaumeCultivation.CORE_OR, RoyaumeCultivation.NASCENT_SOUL, RoyaumeCultivation.TRANSCENDANCE]
  },
  {
    id: "15",
    titre: "Rencontre avec un immortel",
    description: "Un immortel vous a remarqué et vous a accordé sa bénédiction.",
    type: TypeEvenement.SPECIAL,
    effets: {
      qi: 2000,
      stats: { chance: 5 },
      esperanceVie: 20
    },
    rarete: Rarete.MYTHIQUE,
    conditionRoyaume: [RoyaumeCultivation.NASCENT_SOUL, RoyaumeCultivation.TRANSCENDANCE, RoyaumeCultivation.SAINT_MARTIAL]
  },
  
  // Nouveaux événements liés aux pierres spirituelles
  {
    id: "20",
    titre: "Découverte d'une veine de pierres spirituelles",
    description: "Lors de votre exploration, vous avez découvert une petite veine de pierres spirituelles dans une grotte isolée.",
    type: TypeEvenement.POSITIF,
    effets: {
      pierresSpirituelles: 200
    },
    rarete: Rarete.RARE
  },
  {
    id: "21",
    titre: "Récompense de secte",
    description: "Votre secte vous a récompensé pour vos efforts de cultivation avec quelques pierres spirituelles.",
    type: TypeEvenement.POSITIF,
    effets: {
      pierresSpirituelles: 50
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "22",
    titre: "Victoire dans un duel",
    description: "Vous avez vaincu un cultivateur rival dans un duel et gagné un pari de pierres spirituelles.",
    type: TypeEvenement.POSITIF,
    effets: {
      pierresSpirituelles: 100,
      stats: { force: 1 }
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "23",
    titre: "Embuscade de bandits",
    description: "Des bandits vous ont tendu une embuscade et volé une partie de vos pierres spirituelles.",
    type: TypeEvenement.NEGATIF,
    effets: {
      pierresSpirituelles: -75
    },
    rarete: Rarete.COMMUN
  },
  {
    id: "24",
    titre: "Achat d'un manuel de cultivation",
    description: "Vous avez dépensé des pierres spirituelles pour acquérir un manuel de cultivation qui améliore votre compréhension du Qi.",
    type: TypeEvenement.NEUTRE,
    effets: {
      pierresSpirituelles: -150,
      stats: { qi: 2, intelligence: 1 }
    },
    rarete: Rarete.RARE
  }
];

// Fonction pour obtenir un événement aléatoire en fonction du royaume de cultivation
export const obtenirEvenementAleatoire = (royaumeCultivation: RoyaumeCultivation): Evenement | null => {
  // Filtrer les événements possibles en fonction du royaume de cultivation
  const evenementsPossibles = EVENEMENTS.filter(evenement => 
    !evenement.conditionRoyaume || evenement.conditionRoyaume.includes(royaumeCultivation)
  );
  
  if (evenementsPossibles.length === 0) return null;
  
  // Système de poids basé sur la rareté
  const poids: Record<Rarete, number> = {
    [Rarete.COMMUN]: 60,
    [Rarete.RARE]: 25,
    [Rarete.EPIQUE]: 10,
    [Rarete.LEGENDAIRE]: 4,
    [Rarete.MYTHIQUE]: 1
  };
  
  // Calculer le poids total
  let poidsTotal = 0;
  evenementsPossibles.forEach(evenement => {
    poidsTotal += poids[evenement.rarete];
  });
  
  // Générer un nombre aléatoire entre 0 et le poids total
  const nombreAleatoire = Math.random() * poidsTotal;
  
  // Sélectionner un événement en fonction du poids
  let poidsActuel = 0;
  for (const evenement of evenementsPossibles) {
    poidsActuel += poids[evenement.rarete];
    if (nombreAleatoire <= poidsActuel) {
      return evenement;
    }
  }
  
  // Fallback au cas où (ne devrait jamais arriver)
  return evenementsPossibles[Math.floor(Math.random() * evenementsPossibles.length)];
};

// Fonction pour appliquer les effets d'un événement à un personnage
export const appliquerEffetsEvenement = (personnage: Personnage, evenement: Evenement): Personnage => {
  const personnageModifie = { ...personnage };
  
  // Appliquer les modifications de Qi
  if (evenement.effets.qi) {
    personnageModifie.pointsQi = Math.max(0, personnageModifie.pointsQi + evenement.effets.qi);
    personnageModifie.pointsQiTotal = Math.max(0, personnageModifie.pointsQiTotal + evenement.effets.qi);
  }
  
  // Appliquer les modifications de stats
  if (evenement.effets.stats) {
    Object.entries(evenement.effets.stats).forEach(([stat, valeur]) => {
      if (stat in personnageModifie.stats) {
        // Limiter les statistiques entre 1 et STAT_MAX_JEU (100)
        personnageModifie.stats[stat as keyof Stats] = Math.min(
          STAT_MAX_JEU, 
          Math.max(1, personnageModifie.stats[stat as keyof Stats] + (valeur as number))
        );
      }
    });
    
    // Recalculer les statistiques dérivées
    personnageModifie.stats.hp = personnageModifie.stats.constitution * 10 + personnageModifie.stats.force * 5;
    personnageModifie.stats.degat = personnageModifie.stats.force * 2 + personnageModifie.stats.qi;
    personnageModifie.stats.esquive = personnageModifie.stats.agilite * 1.5 + personnageModifie.stats.perception * 0.5;
    personnageModifie.stats.resistance = personnageModifie.stats.constitution * 1.5 + personnageModifie.stats.force * 0.5;
    
    // Recalculer le talent de cultivation
    personnageModifie.talentCultivation = calculerTalentCultivation(personnageModifie.stats);
  }
  
  // Appliquer les modifications d'âge
  if (evenement.effets.age) {
    personnageModifie.age += evenement.effets.age;
  }
  
  // Appliquer les modifications de pierres spirituelles
  if (evenement.effets.pierresSpirituelles) {
    personnageModifie.pierresSpirituelles = Math.max(0, personnageModifie.pierresSpirituelles + evenement.effets.pierresSpirituelles);
  }
  
  return personnageModifie;
};

// Liste des sectes disponibles dans le jeu
export const SECTES: Secte[] = [
  {
    id: "secte-epee-azur",
    nom: "Secte de l'Épée d'Azur",
    description: "Une secte ancienne spécialisée dans les arts de l'épée et la cultivation du Qi de métal. Leurs disciples sont connus pour leur discipline stricte et leur maîtrise inégalée des techniques d'épée. La secte possède une riche histoire et des techniques de forge légendaires qui permettent de créer des armes spirituelles de grande qualité.",
    type: TypeSecte.MARTIALE,
    rarete: Rarete.RARE,
    elementPrincipal: ElementCultivation.METAL,
    elementsSecondaires: [ElementCultivation.EAU],
    techniques: [],
    ressources: [],
    missions: [],
    avantages: {
      multiplicateurQi: 1.2,
      bonusStats: { force: 1, agilite: 1 },
      reductionCoutPercee: 10,
      bonusLongevite: 5
    },
    conditionsAdmission: {
      royaumeMinimum: RoyaumeCultivation.INITIATION,
      statsMinimales: { force: 4, agilite: 4 }
    },
    relationSectes: {}
  },
  {
    id: "secte-lotus-pourpre",
    nom: "Secte du Lotus Pourpre",
    description: "Une secte mystique qui cultive l'essence spirituelle à travers la méditation et l'alchimie. Leurs disciples excellent dans la création d'élixirs et la compréhension des mystères du monde. Leur bibliothèque ancestrale contient des milliers de textes anciens sur les arts de cultivation et les remèdes médicinaux.",
    type: TypeSecte.SPIRITUELLE,
    rarete: Rarete.RARE,
    elementPrincipal: ElementCultivation.EAU,
    elementsSecondaires: [ElementCultivation.BOIS, ElementCultivation.LUMIERE],
    techniques: [],
    ressources: [],
    missions: [],
    avantages: {
      multiplicateurQi: 1.3,
      bonusStats: { intelligence: 1, perception: 1 },
      reductionCoutPercee: 5,
      bonusLongevite: 15
    },
    conditionsAdmission: {
      royaumeMinimum: RoyaumeCultivation.INITIATION,
      statsMinimales: { intelligence: 5, perception: 3 }
    },
    relationSectes: {}
  },
  {
    id: "secte-flamme-eternelle",
    nom: "Secte de la Flamme Éternelle",
    description: "Une secte puissante qui maîtrise les arts du feu et de la forge. Leurs disciples sont réputés pour leur tempérament ardent et leur capacité à forger des artefacts légendaires. Au cœur de leur territoire se trouve un volcan sacré dont la lave est utilisée dans leurs rituels les plus puissants et pour tremper leurs armes les plus redoutables.",
    type: TypeSecte.ALCHIMIQUE,
    rarete: Rarete.RARE,
    elementPrincipal: ElementCultivation.FEU,
    elementsSecondaires: [ElementCultivation.METAL, ElementCultivation.TERRE],
    techniques: [],
    ressources: [],
    missions: [],
    avantages: {
      multiplicateurQi: 1.15,
      bonusStats: { force: 1, constitution: 1 },
      reductionCoutPercee: 8,
      bonusLongevite: 10
    },
    conditionsAdmission: {
      royaumeMinimum: RoyaumeCultivation.INITIATION,
      statsMinimales: { force: 3, constitution: 5 }
    },
    relationSectes: {}
  },
  {
    id: "secte-montagne-verte",
    nom: "Secte de la Montagne Verte",
    description: "Une secte paisible qui vit en harmonie avec la nature. Leurs disciples cultivent l'essence naturelle et excellent dans les arts de guérison et d'herboristerie. Leurs jardins médicinaux sont réputés dans tout le continent pour abriter des plantes rares aux propriétés miraculeuses. Leur philosophie de vie en harmonie avec la nature leur a permis de développer des techniques de cultivation uniques.",
    type: TypeSecte.NEUTRE,
    rarete: Rarete.COMMUN,
    elementPrincipal: ElementCultivation.BOIS,
    elementsSecondaires: [ElementCultivation.EAU, ElementCultivation.TERRE],
    techniques: [],
    ressources: [],
    missions: [],
    avantages: {
      multiplicateurQi: 1.1,
      bonusStats: { constitution: 1, intelligence: 1 },
      reductionCoutPercee: 5,
      bonusLongevite: 15
    },
    conditionsAdmission: {
      royaumeMinimum: RoyaumeCultivation.MORTEL,
      statsMinimales: { constitution: 3, intelligence: 3 }
    },
    relationSectes: {}
  },
  {
    id: "secte-voile-obscur",
    nom: "Secte du Voile Obscur",
    description: "Une secte mystérieuse qui étudie les mystères de l'obscurité et de la lumière. Leurs disciples sont rares mais extrêmement puissants, capables de manipuler les ombres et d'illuminer les ténèbres. Leur siège se trouve dans une vallée cachée où le jour et la nuit semblent coexister en permanence. Leurs techniques de divination sont considérées comme les plus précises du monde connu.",
    type: TypeSecte.CELESTE,
    rarete: Rarete.LEGENDAIRE,
    elementPrincipal: ElementCultivation.OBSCURITE,
    elementsSecondaires: [ElementCultivation.LUMIERE, ElementCultivation.FOUDRE],
    techniques: [],
    ressources: [],
    missions: [],
    avantages: {
      multiplicateurQi: 1.6,
      bonusStats: { intelligence: 2, perception: 2 },
      reductionCoutPercee: 25,
      bonusLongevite: 30
    },
    conditionsAdmission: {
      royaumeMinimum: RoyaumeCultivation.CORE_OR,
      statsMinimales: { intelligence: 7, perception: 7, chance: 6 }
    },
    relationSectes: {}
  }
];

// Fonction pour obtenir les sectes disponibles en fonction du talent et des stats
export const getSecteDisponibles = (personnage: Personnage): Secte[] => {
  // Calculer un score de talent basé sur les stats et le talent de cultivation
  // Utiliser le talent calculé à partir des statistiques
  const scoreTalent = personnage.talentCultivation + 
                     (personnage.stats.esquive * 0.3) + 
                     (personnage.stats.resistance * 0.3) + 
                     (personnage.stats.degat * 0.2);
  
  // Filtrer les sectes en fonction du royaume de cultivation et des stats minimales
  return SECTES.filter(secte => {
    // Vérifier si le personnage répond aux conditions d'admission de base
    const royaumeOk = personnage.royaumeCultivation >= secte.conditionsAdmission.royaumeMinimum;
    
    // Vérifier si les stats du personnage sont suffisantes
    let statsOk = true;
    Object.entries(secte.conditionsAdmission.statsMinimales).forEach(([stat, valeurMin]) => {
      if (personnage.stats[stat as keyof Stats] < valeurMin) {
        statsOk = false;
      }
    });
    
    // Vérifier la compatibilité de race si spécifiée
    let raceOk = true;
    if (secte.conditionsAdmission.raceCompatible && 
        !secte.conditionsAdmission.raceCompatible.includes(personnage.race)) {
      raceOk = false;
    }
    
    // Vérifier l'affinité élémentaire avec l'élément principal de la secte
    let affiniteOk = true;
    const affiniteRequise = secte.rarete === Rarete.COMMUN ? 30 :
                           secte.rarete === Rarete.RARE ? 50 :
                           secte.rarete === Rarete.EPIQUE ? 65 :
                           secte.rarete === Rarete.LEGENDAIRE ? 80 :
                           secte.rarete === Rarete.MYTHIQUE ? 90 : 0;
    
    if (personnage.affiniteElements[secte.elementPrincipal] < affiniteRequise) {
      affiniteOk = false;
    }
    
    // Vérifier le score de talent pour les sectes rares
    let talentOk = true;
    if (secte.rarete === Rarete.RARE && scoreTalent < 50) talentOk = false;
    if (secte.rarete === Rarete.EPIQUE && scoreTalent < 70) talentOk = false;
    if (secte.rarete === Rarete.LEGENDAIRE && scoreTalent < 90) talentOk = false;
    if (secte.rarete === Rarete.MYTHIQUE && scoreTalent < 95) talentOk = false;
    
    return royaumeOk && statsOk && raceOk && affiniteOk && talentOk;
  });
};

// Fonction pour rejoindre une secte
export const rejoindreSecte = (personnage: Personnage, secteId: string): Personnage => {
  // Copie profonde du personnage pour éviter les mutations directes
  const personnageMisAJour = JSON.parse(JSON.stringify(personnage));
  
  // Trouver la secte correspondante
  const secte = SECTES.find(s => s.id === secteId);
  if (!secte) return personnageMisAJour;
  
  // Créer l'appartenance à la secte
  personnageMisAJour.appartenanceSecte = {
    secteId: secte.id,
    dateAdhesion: Date.now(),
    rang: RangSecte.DISCIPLE_EXTERNE,
    pointsContribution: 0,
    techniquesApprises: [],
    missionsCompletees: [],
    ressourcesObtenues: {},
    relationAnciens: 50 // Relation neutre au départ
  };
  
  return personnageMisAJour;
};

// Fonction pour obtenir les informations d'une secte par son ID
export const getSecteById = (secteId: string): Secte | undefined => {
  return SECTES.find(secte => secte.id === secteId);
};

// Fonction pour calculer les bonus de secte appliqués au personnage
export const calculerBonusSecte = (personnage: Personnage): { 
  multiplicateurQi: number, 
  bonusStats: Partial<Stats>,
  reductionCoutPercee: number,
  bonusLongevite: number
} => {
  // Valeurs par défaut si le personnage n'appartient à aucune secte
  const bonusDefaut = {
    multiplicateurQi: 1,
    bonusStats: {},
    reductionCoutPercee: 0,
    bonusLongevite: 0
  };
  
  // Si le personnage n'appartient à aucune secte, retourner les valeurs par défaut
  if (!personnage.appartenanceSecte) return bonusDefaut;
  
  // Trouver la secte du personnage
  const secte = getSecteById(personnage.appartenanceSecte.secteId);
  if (!secte) return bonusDefaut;
  
  // Calculer les bonus en fonction du rang dans la secte
  let multiplicateurRang = 1;
  switch (personnage.appartenanceSecte.rang) {
    case RangSecte.DISCIPLE_EXTERNE:
      multiplicateurRang = 1;
      break;
    case RangSecte.DISCIPLE_INTERNE:
      multiplicateurRang = 1.2;
      break;
    case RangSecte.DISCIPLE_PRINCIPAL:
      multiplicateurRang = 1.5;
      break;
    case RangSecte.DOYEN:
      multiplicateurRang = 1.8;
      break;
    case RangSecte.ANCIEN:
      multiplicateurRang = 2;
      break;
    case RangSecte.GRAND_ANCIEN:
      multiplicateurRang = 2.5;
      break;
    case RangSecte.PATRIARCHE:
      multiplicateurRang = 3;
      break;
  }
  
  // Appliquer les bonus de la secte multipliés par le rang
  return {
    multiplicateurQi: secte.avantages.multiplicateurQi * multiplicateurRang,
    bonusStats: Object.entries(secte.avantages.bonusStats).reduce((acc, [stat, valeur]) => {
      acc[stat as keyof Stats] = valeur * multiplicateurRang;
      return acc;
    }, {} as Partial<Stats>),
    reductionCoutPercee: secte.avantages.reductionCoutPercee * multiplicateurRang,
    bonusLongevite: secte.avantages.bonusLongevite * multiplicateurRang
  };
};

// Fonction pour appliquer les bonus de secte au personnage
export const appliquerBonusSecte = (personnage: Personnage): Personnage => {
  const personnageModifie = { ...personnage };
  
  // Calculer les bonus de secte
  const bonus = calculerBonusSecte(personnage);
  
  // Appliquer les bonus aux statistiques
  if (bonus.bonusStats) {
    Object.entries(bonus.bonusStats).forEach(([stat, valeur]) => {
      if (stat in personnageModifie.stats) {
        // Limiter les statistiques à STAT_MAX_JEU (100)
        personnageModifie.stats[stat as keyof Stats] = Math.min(
          STAT_MAX_JEU,
          personnageModifie.stats[stat as keyof Stats] + valeur
        );
      }
    });
    
    // Recalculer les statistiques dérivées
    personnageModifie.stats.hp = personnageModifie.stats.constitution * 10 + personnageModifie.stats.force * 5;
    personnageModifie.stats.degat = personnageModifie.stats.force * 2 + personnageModifie.stats.qi;
    personnageModifie.stats.esquive = personnageModifie.stats.agilite * 1.5 + personnageModifie.stats.perception * 0.5;
    personnageModifie.stats.resistance = personnageModifie.stats.constitution * 1.5 + personnageModifie.stats.force * 0.5;
    
    // Recalculer le talent de cultivation
    personnageModifie.talentCultivation = calculerTalentCultivation(personnageModifie.stats);
  }
  
  return personnageModifie;
};

// Fonction pour générer des affinités élémentaires aléatoires
export const genererAffinitesElementaires = (): Record<ElementCultivation, number> => {
  const affinites: Partial<Record<ElementCultivation, number>> = {};
  
  // Générer une affinité pour chaque élément
  Object.values(ElementCultivation).forEach(element => {
    // Valeur entre 1 et 100, avec une distribution plus équilibrée
    // Les valeurs plus élevées sont plus rares
    let valeur = Math.floor(Math.random() * 60) + 1; // Base entre 1 et 60
    
    // 30% de chance d'avoir une affinité plus élevée (61-80)
    if (Math.random() < 0.3) {
      valeur = Math.floor(Math.random() * 20) + 61;
    }
    
    // 10% de chance d'avoir une affinité exceptionnelle (81-100)
    if (Math.random() < 0.1) {
      valeur = Math.floor(Math.random() * 20) + 81;
    }
    
    affinites[element] = valeur;
  });
  
  return affinites as Record<ElementCultivation, number>;
};

// Fonction pour calculer le talent de cultivation basé sur les statistiques
export const calculerTalentCultivation = (stats: Stats): number => {
  // Calculer la moyenne des statistiques de base (sur 10)
  const moyenneStats = (
    stats.force + 
    stats.agilite + 
    stats.constitution + 
    stats.intelligence + 
    stats.perception + 
    stats.charisme + 
    stats.chance + 
    stats.qi
  ) / 8;
  
  // Appliquer une formule exponentielle pour favoriser les moyennes élevées
  // Une moyenne de 5 donnera un talent de 50
  // Une moyenne de 7 donnera un talent d'environ 70
  // Une moyenne de 9 donnera un talent d'environ 90
  // Une moyenne de 10 donnera un talent de 100
  const talent = Math.pow(moyenneStats / 10, 1.5) * 100;
  
  // Arrondir et s'assurer que le talent est entre 1 et 100
  return Math.min(100, Math.max(1, Math.round(talent)));
};

// Fonction pour générer un talent de cultivation aléatoire
// Maintenue pour compatibilité avec le code existant
export const genererTalentCultivation = (): number => {
  // Générer des stats aléatoires et calculer le talent
  const stats = genererStatsAleatoires();
  return calculerTalentCultivation(stats);
}; 