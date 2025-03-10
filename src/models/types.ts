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

// Constantes pour le système de temps et d'âge
export const TEMPS_REEL_PAR_ANNEE_JEU = 60 * 5; // 5 minutes réelles = 1 année dans le jeu (remis à la valeur d'origine)
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
    [NiveauPercee.INTERMEDIAIRE]: 200,
    [NiveauPercee.AVANCE]: 600
  },
  [RoyaumeCultivation.INITIATION]: {
    [NiveauPercee.PREMIER]: 1200,
    [NiveauPercee.INTERMEDIAIRE]: 2000,
    [NiveauPercee.AVANCE]: 3000
  },
  [RoyaumeCultivation.QI_CONDENSE]: {
    [NiveauPercee.PREMIER]: 4200,
    [NiveauPercee.INTERMEDIAIRE]: 5600,
    [NiveauPercee.AVANCE]: 7200
  },
  [RoyaumeCultivation.FONDATION]: {
    [NiveauPercee.PREMIER]: 9000,
    [NiveauPercee.INTERMEDIAIRE]: 11000,
    [NiveauPercee.AVANCE]: 13200
  },
  [RoyaumeCultivation.CORE_OR]: {
    [NiveauPercee.PREMIER]: 16000,
    [NiveauPercee.INTERMEDIAIRE]: 20000,
    [NiveauPercee.AVANCE]: 25000
  },
  [RoyaumeCultivation.NASCENT_SOUL]: {
    [NiveauPercee.PREMIER]: 30000,
    [NiveauPercee.INTERMEDIAIRE]: 36000,
    [NiveauPercee.AVANCE]: 44000
  },
  [RoyaumeCultivation.TRANSCENDANCE]: {
    [NiveauPercee.PREMIER]: 52000,
    [NiveauPercee.INTERMEDIAIRE]: 62000,
    [NiveauPercee.AVANCE]: 74000
  },
  [RoyaumeCultivation.SAINT_MARTIAL]: {
    [NiveauPercee.PREMIER]: 88000,
    [NiveauPercee.INTERMEDIAIRE]: 104000,
    [NiveauPercee.AVANCE]: 122000
  },
  [RoyaumeCultivation.DEMI_DIEU]: {
    [NiveauPercee.PREMIER]: 144000,
    [NiveauPercee.INTERMEDIAIRE]: 170000,
    [NiveauPercee.AVANCE]: 200000
  },
  [RoyaumeCultivation.DIVIN_SUPREME]: {
    [NiveauPercee.PREMIER]: 120000,
    [NiveauPercee.INTERMEDIAIRE]: 150000,
    [NiveauPercee.AVANCE]: 200000
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
}

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
  const maintenant = Date.now();
  const tempsEcoule = maintenant - personnage.dateNaissance;
  const anneesEcoulees = Math.floor(tempsEcoule / (TEMPS_REEL_PAR_ANNEE_JEU * 1000));
  return personnage.age + anneesEcoulees;
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
    description: "Une famille modeste travaillant la terre. Vous avez développé une forte endurance et une connexion avec la nature."
  },
  {
    nom: Origine.FAMILLE_MARCHANDE,
    rarete: Rarete.COMMUN,
    description: "Une famille de commerçants. Vous avez un talent naturel pour la négociation et une bonne compréhension des relations sociales."
  },
  {
    nom: Origine.FAMILLE_ARTISANS,
    rarete: Rarete.COMMUN,
    description: "Une famille spécialisée dans l'artisanat. Vous avez une grande dextérité et un œil pour les détails."
  },
  {
    nom: Origine.FAMILLE_BANDITS,
    rarete: Rarete.RARE,
    description: "Une famille vivant en marge de la société. Vous avez appris à survivre par tous les moyens et connaissez les arts de l'infiltration."
  },
  {
    nom: Origine.FAMILLE_ARTS_MARTIAUX,
    rarete: Rarete.RARE,
    description: "Une famille pratiquant les arts martiaux depuis des générations. Vous avez été formé aux techniques de combat dès votre plus jeune âge."
  },
  {
    nom: Origine.FAMILLE_LETTRÉS,
    rarete: Rarete.RARE,
    description: "Une famille d'érudits et de sages. Vous avez une connaissance approfondie des textes anciens et des théories de cultivation."
  },
  {
    nom: Origine.FAMILLE_NOBLE,
    rarete: Rarete.EPIQUE,
    description: "Une famille de la haute noblesse. Vous avez accès à des ressources rares et avez reçu une éducation privilégiée."
  },
  {
    nom: Origine.FAMILLE_ROYALE,
    rarete: Rarete.LEGENDAIRE,
    description: "Une famille de sang royal. Vous êtes né avec un statut élevé et avez accès aux meilleurs maîtres et ressources du royaume."
  },
  {
    nom: Origine.LIGNÉE_IMMORTELLE,
    rarete: Rarete.MYTHIQUE,
    description: "Une lignée descendant directement des immortels. Votre sang contient des traces d'énergie divine et votre potentiel est illimité."
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
  return {
    force: Math.floor(Math.random() * 10) + 1,
    agilite: Math.floor(Math.random() * 10) + 1,
    constitution: Math.floor(Math.random() * 10) + 1,
    intelligence: Math.floor(Math.random() * 10) + 1,
    perception: Math.floor(Math.random() * 10) + 1,
    charisme: Math.floor(Math.random() * 10) + 1,
    chance: Math.floor(Math.random() * 10) + 1,
    qi: Math.floor(Math.random() * 10) + 1
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