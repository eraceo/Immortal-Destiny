import { TechniqueCultivation, Rarete, ElementCultivation, RoyaumeCultivation, Stats, genererID, RangSecte } from './types';

// Techniques de la Secte du Lotus Pourpre (Spirituelle, Eau)
export const TECHNIQUES_LOTUS_POURPRE: TechniqueCultivation[] = [
  {
    id: "technique-meditation-lotus",
    nom: "Méditation du Lotus Éternel",
    description: "Une technique de méditation profonde qui permet au pratiquant de se connecter avec l'essence spirituelle de l'eau. Le cultivateur visualise un lotus flottant sur l'eau, absorbant l'énergie pure du monde.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    effets: {
      multiplicateurQi: 1.2,
      reductionTemps: 5,
      bonusLongevite: 3
    },
    coutApprentissage: 100
  },
  {
    id: "technique-rosee-celeste",
    nom: "Rosée Céleste",
    description: "Une technique qui permet au cultivateur de condenser l'humidité de l'air en gouttelettes d'eau chargées de Qi. Ces gouttelettes peuvent être utilisées pour soigner les blessures mineures ou purifier le corps des toxines.",
    rarete: Rarete.RARE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    effets: {
      bonusStats: { constitution: 1, intelligence: 1 },
      bonusLongevite: 5
    },
    coutApprentissage: 500
  },
  {
    id: "technique-vagues-purificatrices",
    nom: "Vagues Purificatrices",
    description: "Une technique défensive qui crée une barrière d'eau autour du cultivateur, capable de repousser les attaques physiques et spirituelles. L'eau absorbe et purifie les énergies négatives.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    effets: {
      bonusStats: { constitution: 2 },
      resistanceElement: [ElementCultivation.FEU, ElementCultivation.TERRE]
    },
    coutApprentissage: 1500
  },
  {
    id: "technique-paume-lotus-divin",
    nom: "Paume du Lotus Divin",
    description: "Une technique offensive qui concentre l'énergie spirituelle dans la paume du cultivateur, formant un lotus d'eau qui explose au contact de l'adversaire. L'impact peut paralyser temporairement le système de circulation du Qi de la cible.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DOYEN,
    effets: {
      bonusStats: { force: 2, agilite: 1, intelligence: 2 },
      multiplicateurQi: 1.4
    },
    coutApprentissage: 5000
  },
  {
    id: "technique-transformation-brume",
    nom: "Transformation en Brume",
    description: "Une technique avancée qui permet au cultivateur de transformer son corps en brume, lui permettant d'éviter les attaques physiques et de se déplacer à travers des espaces étroits. Dans cet état, le cultivateur peut également absorber l'humidité de l'environnement pour récupérer son énergie.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.NASCENT_SOUL,
    rangRequis: RangSecte.ANCIEN,
    effets: {
      bonusStats: { agilite: 3, perception: 2 },
      multiplicateurQi: 1.6,
      bonusLongevite: 15
    },
    coutApprentissage: 15000
  }
];

// Techniques de la Secte de la Flamme Éternelle (Alchimique, Feu)
export const TECHNIQUES_FLAMME_ETERNELLE: TechniqueCultivation[] = [
  {
    id: "technique-souffle-dragon",
    nom: "Souffle du Dragon de Feu",
    description: "Une technique qui permet au cultivateur de générer une chaleur intense dans son corps, renforçant sa résistance au froid et augmentant sa force physique. Le pratiquant peut également exhaler un souffle brûlant capable d'enflammer des objets à distance.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    effets: {
      bonusStats: { force: 1, constitution: 1 },
      resistanceElement: [ElementCultivation.EAU]
    },
    coutApprentissage: 100
  },
  {
    id: "technique-peau-metal-incandescent",
    nom: "Peau de Métal Incandescent",
    description: "Une technique défensive qui renforce la peau du cultivateur, la rendant aussi dure que le métal et brûlante au toucher. Les attaques physiques peuvent être partiellement absorbées et l'attaquant risque de se brûler au contact.",
    rarete: Rarete.RARE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    effets: {
      bonusStats: { constitution: 2 },
      resistanceElement: [ElementCultivation.METAL, ElementCultivation.BOIS]
    },
    coutApprentissage: 500
  },
  {
    id: "technique-forge-spirituelle",
    nom: "Forge Spirituelle",
    description: "Une technique alchimique qui permet au cultivateur de forger des armes et des objets imprégnés de son Qi. Ces objets peuvent canaliser l'énergie du feu et devenir plus puissants avec le temps, en absorbant l'essence spirituelle de leur environnement.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    effets: {
      bonusStats: { force: 1, intelligence: 2 },
      multiplicateurQi: 1.3
    },
    coutApprentissage: 1500
  },
  {
    id: "technique-explosion-nova",
    nom: "Explosion Nova",
    description: "Une technique offensive dévastatrice qui concentre une quantité massive de Qi de feu dans le corps du cultivateur avant de la libérer dans une explosion contrôlée. L'explosion peut être dirigée et sa puissance varie selon la quantité de Qi investie.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DOYEN,
    effets: {
      bonusStats: { force: 3 },
      multiplicateurQi: 1.5
    },
    coutApprentissage: 5000
  },
  {
    id: "technique-phenix-renaissant",
    nom: "Phénix Renaissant",
    description: "Une technique mythique qui imite le cycle de vie du phénix. Le cultivateur peut se régénérer rapidement après une blessure grave en consumant une grande quantité de Qi. Dans les cas extrêmes, cette technique peut même ressusciter le pratiquant une fois, au prix d'une régression temporaire de son niveau de cultivation.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.NASCENT_SOUL,
    rangRequis: RangSecte.ANCIEN,
    effets: {
      bonusStats: { constitution: 3, chance: 2 },
      bonusLongevite: 20,
      multiplicateurQi: 1.7
    },
    coutApprentissage: 15000
  }
];

// Techniques de la Secte de la Montagne Verte (Neutre, Bois)
export const TECHNIQUES_MONTAGNE_VERTE: TechniqueCultivation[] = [
  {
    id: "technique-respiration-foret",
    nom: "Respiration de la Forêt",
    description: "Une technique de base qui enseigne au cultivateur comment absorber l'essence vitale des plantes et des arbres. Le pratiquant synchronise sa respiration avec les cycles naturels de la forêt, purifiant son corps et renforçant son Qi.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.MORTEL,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    effets: {
      multiplicateurQi: 1.1,
      bonusLongevite: 2,
      reductionTemps: 3
    },
    coutApprentissage: 50
  },
  {
    id: "technique-croissance-acceleree",
    nom: "Croissance Accélérée",
    description: "Une technique qui permet au cultivateur d'accélérer la croissance des plantes et de communiquer avec elles à un niveau basique. Utile pour cultiver des herbes médicinales rares ou créer des barrières naturelles rapidement.",
    rarete: Rarete.RARE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    effets: {
      bonusStats: { intelligence: 1, perception: 1 },
      reductionTemps: 7
    },
    coutApprentissage: 300
  },
  {
    id: "technique-armure-ecorce",
    nom: "Armure d'Écorce",
    description: "Une technique défensive qui recouvre le corps du cultivateur d'une couche d'écorce magique, offrant une protection contre les attaques physiques et certains types d'énergie spirituelle. L'écorce peut se régénérer lentement tant que le cultivateur a du Qi.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    effets: {
      bonusStats: { constitution: 2 },
      resistanceElement: [ElementCultivation.TERRE, ElementCultivation.METAL]
    },
    coutApprentissage: 1000
  },
  {
    id: "technique-lianes-etrangleuses",
    nom: "Lianes Étrangleuses",
    description: "Une technique offensive qui permet au cultivateur de faire jaillir des lianes de son corps ou du sol environnant. Ces lianes peuvent immobiliser un adversaire, drainer son énergie spirituelle ou même l'étouffer si nécessaire.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DOYEN,
    effets: {
      bonusStats: { force: 1, agilite: 2, perception: 1 },
      multiplicateurQi: 1.3
    },
    coutApprentissage: 3000
  },
  {
    id: "technique-renaissance-printaniere",
    nom: "Renaissance Printanière",
    description: "Une technique de guérison puissante qui canalise l'essence de la vie et du renouveau. Le cultivateur entre dans un état de méditation profonde, entouré d'une aura verte qui accélère considérablement la guérison des blessures et peut même régénérer des membres perdus sur une période prolongée.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.ANCIEN,
    effets: {
      bonusStats: { constitution: 3, intelligence: 2 },
      bonusLongevite: 25,
      multiplicateurQi: 1.5
    },
    coutApprentissage: 10000
  }
];

// Techniques de la Secte du Voile Obscur (Céleste, Obscurité/Lumière)
export const TECHNIQUES_VOILE_OBSCUR: TechniqueCultivation[] = [
  {
    id: "technique-vision-obscurite",
    nom: "Vision dans l'Obscurité",
    description: "Une technique qui permet au cultivateur de voir parfaitement dans les ténèbres et de percevoir les fluctuations d'énergie spirituelle invisibles à l'œil nu. Cette technique améliore également la capacité à détecter les illusions et les dissimulations.",
    rarete: Rarete.RARE,
    element: ElementCultivation.OBSCURITE,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    effets: {
      bonusStats: { perception: 2 },
      resistanceElement: [ElementCultivation.LUMIERE]
    },
    coutApprentissage: 2000
  },
  {
    id: "technique-pas-ombre",
    nom: "Pas de l'Ombre",
    description: "Une technique de déplacement qui permet au cultivateur de se fondre dans les ombres et de voyager rapidement d'une zone d'ombre à une autre. À des niveaux avancés, le pratiquant peut même traverser de courtes distances à travers une dimension d'ombre parallèle.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.OBSCURITE,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    effets: {
      bonusStats: { agilite: 3 },
      multiplicateurQi: 1.3
    },
    coutApprentissage: 5000
  },
  {
    id: "technique-lance-aurore",
    nom: "Lance de l'Aurore",
    description: "Une technique offensive qui concentre l'énergie de la lumière en une lance éblouissante capable de percer les défenses spirituelles les plus solides. La lance peut également dissiper les ténèbres et révéler ce qui est caché.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.LUMIERE,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    effets: {
      bonusStats: { force: 2, intelligence: 1 },
      resistanceElement: [ElementCultivation.OBSCURITE]
    },
    coutApprentissage: 5000
  },
  {
    id: "technique-equilibre-celeste",
    nom: "Équilibre Céleste",
    description: "Une technique rare qui permet au cultivateur de maîtriser simultanément les énergies de la lumière et de l'obscurité. Le pratiquant peut passer d'un élément à l'autre ou les utiliser ensemble pour créer des effets uniques. Cette technique est extrêmement difficile à maîtriser mais offre une polyvalence inégalée.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.LUMIERE, // L'élément principal peut varier selon l'utilisation
    niveauRequis: RoyaumeCultivation.NASCENT_SOUL,
    rangRequis: RangSecte.DOYEN,
    effets: {
      bonusStats: { intelligence: 2, perception: 2, chance: 1 },
      multiplicateurQi: 1.5,
      resistanceElement: [ElementCultivation.OBSCURITE, ElementCultivation.LUMIERE]
    },
    coutApprentissage: 10000
  },
  {
    id: "technique-eclipse-eternelle",
    nom: "Éclipse Éternelle",
    description: "Une technique mythique qui permet au cultivateur de créer une zone où la lumière et l'obscurité fusionnent en une énergie primordiale. Dans cette zone, le temps et l'espace deviennent fluides, et le pratiquant peut manipuler la réalité à un niveau fondamental. Cette technique est considérée comme un pas vers la divinité.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.OBSCURITE,
    niveauRequis: RoyaumeCultivation.TRANSCENDANCE,
    rangRequis: RangSecte.ANCIEN,
    effets: {
      bonusStats: { intelligence: 3, perception: 3, chance: 2 },
      multiplicateurQi: 2.0,
      bonusLongevite: 50
    },
    coutApprentissage: 50000
  }
];

// Techniques génériques disponibles pour toutes les sectes
export const TECHNIQUES_GENERIQUES: TechniqueCultivation[] = [
  {
    id: "technique-meditation-base",
    nom: "Méditation Fondamentale",
    description: "Une technique de méditation de base enseignée à tous les cultivateurs débutants. Elle permet de sentir et d'absorber le Qi environnant, établissant les fondations pour des techniques plus avancées.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.TERRE, // Neutre, compatible avec tous les éléments
    niveauRequis: RoyaumeCultivation.MORTEL,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    effets: {
      multiplicateurQi: 1.05,
      reductionTemps: 2
    },
    coutApprentissage: 10
  },
  {
    id: "technique-renforcement-corps",
    nom: "Renforcement du Corps",
    description: "Une technique qui renforce le corps physique en faisant circuler le Qi à travers les méridiens et les organes. Elle améliore la force, l'endurance et la résistance aux maladies.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.TERRE,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    effets: {
      bonusStats: { force: 1, constitution: 1 },
      bonusLongevite: 1
    },
    coutApprentissage: 50
  },
  {
    id: "technique-perception-qi",
    nom: "Perception du Qi",
    description: "Une technique qui affine la capacité du cultivateur à percevoir le Qi dans son environnement et chez les autres êtres. Elle est essentielle pour identifier les dangers, les opportunités de cultivation et les trésors naturels.",
    rarete: Rarete.RARE,
    element: ElementCultivation.TERRE,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    effets: {
      bonusStats: { perception: 2 },
      reductionTemps: 5
    },
    coutApprentissage: 200
  }
];

// Fonction pour obtenir toutes les techniques d'une secte spécifique
export const getTechniquesSecte = (secteId: string): TechniqueCultivation[] => {
  switch (secteId) {
    case "secte-lotus-pourpre":
      return [...TECHNIQUES_GENERIQUES, ...TECHNIQUES_LOTUS_POURPRE];
    case "secte-flamme-eternelle":
      return [...TECHNIQUES_GENERIQUES, ...TECHNIQUES_FLAMME_ETERNELLE];
    case "secte-montagne-verte":
      return [...TECHNIQUES_GENERIQUES, ...TECHNIQUES_MONTAGNE_VERTE];
    case "secte-voile-obscur":
      return [...TECHNIQUES_GENERIQUES, ...TECHNIQUES_VOILE_OBSCUR];
    default:
      return TECHNIQUES_GENERIQUES;
  }
};

// Fonction pour obtenir une technique par son ID
export const getTechniqueById = (techniqueId: string): TechniqueCultivation | undefined => {
  const toutesLesTechniques = [
    ...TECHNIQUES_GENERIQUES,
    ...TECHNIQUES_LOTUS_POURPRE,
    ...TECHNIQUES_FLAMME_ETERNELLE,
    ...TECHNIQUES_MONTAGNE_VERTE,
    ...TECHNIQUES_VOILE_OBSCUR
  ];
  
  return toutesLesTechniques.find(technique => technique.id === techniqueId);
};

// Fonction pour vérifier si un personnage peut apprendre une technique
export const peutApprendreTechnique = (
  personnage: { 
    royaumeCultivation: RoyaumeCultivation, 
    pierresSpirituelles: number,
    techniquesApprises: TechniqueCultivation[],
    affiniteElements: Record<ElementCultivation, number>,
    appartenanceSecte?: { secteId: string, rang: RangSecte } | null
  }, 
  technique: TechniqueCultivation
): { peut: boolean, raison?: string } => {
  // Vérifier si le personnage a déjà appris cette technique
  if (personnage.techniquesApprises.some(t => t.id === technique.id)) {
    return { peut: false, raison: "Vous avez déjà appris cette technique." };
  }
  
  // Vérifier le niveau de cultivation requis
  if (personnage.royaumeCultivation < technique.niveauRequis) {
    return { 
      peut: false, 
      raison: `Votre niveau de cultivation est insuffisant. Niveau requis: ${technique.niveauRequis}.` 
    };
  }
  
  // Vérifier si le personnage a assez de pierres spirituelles
  if (personnage.pierresSpirituelles < technique.coutApprentissage) {
    return { 
      peut: false, 
      raison: `Vous n'avez pas assez de pierres spirituelles. Coût: ${technique.coutApprentissage}.` 
    };
  }
  
  // Vérifier le rang requis dans la secte
  if (technique.rangRequis && personnage.appartenanceSecte) {
    const rangPersonnage = personnage.appartenanceSecte.rang;
    if (rangPersonnage < technique.rangRequis) {
      return {
        peut: false,
        raison: `Votre rang dans la secte est insuffisant. Rang requis: ${technique.rangRequis}.`
      };
    }
  }
  
  // Vérifier l'affinité élémentaire (si l'affinité est trop basse, l'apprentissage est plus difficile)
  const affiniteElement = personnage.affiniteElements[technique.element] || 0;
  if (affiniteElement < 20 && technique.rarete >= Rarete.EPIQUE) {
    return { 
      peut: false, 
      raison: `Votre affinité avec l'élément ${technique.element} est trop faible pour cette technique avancée.` 
    };
  }
  
  return { peut: true };
};

// Fonction pour calculer le coût réel d'apprentissage d'une technique (en tenant compte des bonus)
export const calculerCoutApprentissage = (
  personnage: { 
    bonusApprentissage?: number,
    affiniteElements: Record<ElementCultivation, number>,
    appartenanceSecte?: { secteId: string } | null
  }, 
  technique: TechniqueCultivation,
  secteId?: string
): number => {
  let coutModifie = technique.coutApprentissage;
  
  // Réduction basée sur l'affinité élémentaire
  const affiniteElement = personnage.affiniteElements[technique.element] || 0;
  const reductionAffinite = Math.min(affiniteElement / 2, 40); // Max 40% de réduction
  
  // Réduction basée sur le bonus d'apprentissage du personnage
  const reductionBonus = personnage.bonusApprentissage || 0;
  
  // Réduction supplémentaire si la technique appartient à la secte du personnage
  let reductionSecte = 0;
  if (personnage.appartenanceSecte?.secteId === secteId || secteId === undefined) {
    reductionSecte = 20; // 20% de réduction pour les techniques de sa propre secte
  }
  
  // Appliquer toutes les réductions
  const reductionTotale = Math.min(reductionAffinite + reductionBonus + reductionSecte, 75); // Max 75% de réduction
  coutModifie = Math.round(coutModifie * (1 - reductionTotale / 100));
  
  return Math.max(coutModifie, 1); // Minimum 1 pierre spirituelle
}; 