import { TechniqueCultivation, Rarete, ElementCultivation, RoyaumeCultivation, Stats, genererID, RangSecte } from './types';

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
    utilite: [
      "Pratique quotidienne pour renforcer les bases de cultivation",
      "Détection du Qi environnant",
      "Préparation mentale avant l'apprentissage de techniques avancées",
      "Récupération d'énergie spirituelle"
    ],
    effets: {
      multiplicateurQi: 1.08
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
    utilite: [
      "Entraînement physique quotidien",
      "Résistance aux maladies et aux poisons faibles",
      "Amélioration des capacités physiques de base",
      "Préparation du corps pour des techniques plus exigeantes"
    ],
    effets: {
      bonusStats: { force: 1, constitution: 1 },
      bonusLongevite: 2
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
    utilite: [
      "Détection de trésors naturels et de ressources spirituelles",
      "Évaluation de la puissance d'autres cultivateurs",
      "Identification de formations spirituelles et de pièges",
      "Localisation de veines de Qi terrestres pour la méditation",
      "Analyse des flux de Qi dans les artefacts et talismans"
    ],
    effets: {
      bonusStats: { perception: 3 }
    },
    coutApprentissage: 200
  },
  {
    id: "technique-pas-leger",
    nom: "Pas Léger",
    description: "Une technique de déplacement de base qui permet au cultivateur de réduire son poids et de se déplacer rapidement et silencieusement. Elle est utile pour la furtivité, l'esquive et les déplacements sur des surfaces instables.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.TERRE,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    utilite: [
      "Déplacement silencieux pour la furtivité",
      "Esquive rapide lors de combats",
      "Traversée de surfaces instables comme l'eau ou les sables mouvants",
      "Course sur de longues distances sans fatigue",
      "Réduction des dégâts lors de chutes"
    ],
    effets: {
      bonusStats: { agilite: 2 }
    },
    coutApprentissage: 30
  },
  {
    id: "technique-poing-tonnerre",
    nom: "Poing du Tonnerre",
    description: "Une technique de combat basique mais efficace qui concentre le Qi dans les poings pour augmenter considérablement la force d'impact. Lorsqu'elle est exécutée correctement, l'impact produit un son semblable au tonnerre.",
    rarete: Rarete.RARE,
    element: ElementCultivation.FOUDRE,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    utilite: [
      "Combat rapproché contre des adversaires",
      "Destruction d'obstacles physiques",
      "Intimidation d'adversaires plus faibles",
      "Entraînement pour renforcer les poings et les bras",
      "Création d'ondes de choc pour déstabiliser plusieurs ennemis"
    ],
    effets: {
      bonusStats: { force: 3 }
    },
    coutApprentissage: 300
  },
  {
    id: "technique-respiration-purificatrice",
    nom: "Respiration Purificatrice",
    description: "Une technique de respiration qui permet au cultivateur de purifier son corps des toxines et des énergies négatives. Elle est particulièrement utile après avoir été exposé à des poisons ou des miasmes spirituels.",
    rarete: Rarete.RARE,
    element: ElementCultivation.TERRE,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    utilite: [
      "Détoxification du corps après empoisonnement",
      "Purification du Qi corrompu",
      "Récupération accélérée après un combat",
      "Résistance temporaire aux environnements toxiques",
      "Préparation du corps avant l'absorption d'élixirs puissants"
    ],
    effets: {
      bonusStats: { constitution: 2 },
      bonusLongevite: 5
    },
    coutApprentissage: 400
  },
  {
    id: "technique-meditation-etoiles",
    nom: "Méditation des Étoiles",
    description: "Une technique de méditation avancée qui permet au cultivateur d'absorber l'essence des étoiles pendant la nuit. Cette énergie céleste pure est particulièrement bénéfique pour raffiner l'esprit et élargir la conscience.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.LUMIERE,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    utilite: [
      "Méditation nocturne pour accélérer la cultivation",
      "Expansion de la conscience spirituelle",
      "Amélioration de la clarté mentale et de l'intuition",
      "Préparation aux percées spirituelles majeures",
      "Connexion avec les énergies cosmiques"
    ],
    effets: {
      bonusStats: { intelligence: 3, perception: 2 },
      multiplicateurQi: 1.5,
      bonusLongevite: 10
    },
    coutApprentissage: 2000
  }
];

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
    utilite: [
      "Méditation quotidienne pour accélérer la cultivation",
      "Purification du corps des impuretés",
      "Amélioration de la concentration lors des études"
    ],
    effets: {
      multiplicateurQi: 1.25,
      bonusLongevite: 5
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
    utilite: [
      "Soins d'urgence pour les blessures légères",
      "Détoxification du corps après empoisonnement",
      "Création d'eau pure dans des environnements hostiles",
      "Amélioration de l'efficacité des herbes médicinales"
    ],
    effets: {
      bonusStats: { constitution: 2, intelligence: 2 },
      bonusLongevite: 8
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
    utilite: [
      "Protection contre les attaques physiques et spirituelles",
      "Purification des énergies négatives dans l'environnement",
      "Création d'une zone de méditation sécurisée",
      "Dissipation des illusions et des poisons spirituels"
    ],
    effets: {
      bonusStats: { constitution: 3 },
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
    utilite: [
      "Combat contre des adversaires puissants",
      "Paralysie temporaire du système de circulation du Qi d'un ennemi",
      "Destruction de barrières spirituelles",
      "Démonstration de puissance lors de duels ou tournois"
    ],
    effets: {
      bonusStats: { force: 3, agilite: 2, intelligence: 3 },
      multiplicateurQi: 1.6
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
    utilite: [
      "Évasion de situations dangereuses",
      "Infiltration dans des zones sécurisées",
      "Traversée d'obstacles physiques",
      "Récupération d'énergie dans des environnements humides",
      "Dissimulation et espionnage"
    ],
    effets: {
      bonusStats: { agilite: 4, perception: 3 },
      multiplicateurQi: 1.8,
      bonusLongevite: 20
    },
    coutApprentissage: 15000
  },
  {
    id: "technique-miroir-aquatique",
    nom: "Miroir Aquatique",
    description: "Une technique spirituelle qui permet au cultivateur de créer une surface d'eau parfaitement calme qui reflète non seulement les images, mais aussi les souvenirs et les pensées. Ce miroir peut révéler des vérités cachées, détecter les mensonges et même entrevoir des fragments du passé ou du futur.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    utilite: [
      "Divination et recherche de vérités cachées",
      "Détection de mensonges lors d'interrogatoires",
      "Exploration de souvenirs personnels oubliés",
      "Communication à distance avec d'autres pratiquants de la technique",
      "Observation d'événements distants"
    ],
    effets: {
      bonusStats: { intelligence: 3, perception: 3 },
      multiplicateurQi: 1.5
    },
    coutApprentissage: 2000
  },
  {
    id: "technique-danse-pluie",
    nom: "Danse de la Pluie Céleste",
    description: "Une technique rituelle qui permet au cultivateur d'invoquer la pluie en exécutant une danse sacrée. La pluie invoquée est chargée d'énergie spirituelle et peut nourrir les plantes, purifier une zone ou renforcer les techniques d'eau des alliés. Dans les cas extrêmes, elle peut se transformer en déluge purificateur.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DOYEN,
    utilite: [
      "Invocation de pluie dans des régions arides",
      "Purification de zones corrompues par des énergies maléfiques",
      "Renforcement des cultivateurs d'eau alliés",
      "Création d'un environnement favorable à la cultivation",
      "Extinction d'incendies massifs"
    ],
    effets: {
      bonusStats: { intelligence: 3, charisme: 3 },
      multiplicateurQi: 1.7,
      bonusLongevite: 15
    },
    coutApprentissage: 8000
  },
  {
    id: "technique-dragon-eau",
    nom: "Manifestation du Dragon d'Eau",
    description: "Une technique légendaire qui permet au cultivateur de condenser une immense quantité de Qi aquatique pour créer un dragon d'eau semi-conscient. Ce dragon peut attaquer les ennemis, protéger son invocateur ou transporter des personnes sur de longues distances. La connexion spirituelle avec le dragon permet également au cultivateur de voir à travers ses yeux.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.EAU,
    niveauRequis: RoyaumeCultivation.TRANSCENDANCE,
    rangRequis: RangSecte.GRAND_ANCIEN,
    utilite: [
      "Attaque dévastatrice contre des ennemis puissants",
      "Transport rapide sur de longues distances",
      "Protection de zones importantes comme les territoires de la secte",
      "Exploration de zones dangereuses via la vision partagée",
      "Démonstration de puissance pour intimider des sectes rivales"
    ],
    effets: {
      bonusStats: { force: 4, intelligence: 4, charisme: 3 },
      multiplicateurQi: 2.2,
      bonusLongevite: 30
    },
    coutApprentissage: 30000
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
    utilite: [
      "Attaque à distance contre des ennemis",
      "Allumage de feux dans des conditions difficiles",
      "Fonte de métaux et travail de forge",
      "Réchauffement dans des environnements froids"
    ],
    effets: {
      bonusStats: { force: 2, constitution: 2 },
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
    utilite: [
      "Protection contre les attaques physiques",
      "Survie dans des environnements extrêmement froids",
      "Intimidation des adversaires",
      "Résistance aux poisons de contact"
    ],
    effets: {
      bonusStats: { constitution: 3 },
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
    utilite: [
      "Création d'armes et d'équipements spirituels",
      "Réparation d'objets magiques endommagés",
      "Amélioration d'artefacts existants",
      "Extraction de matériaux précieux des minerais",
      "Création de talismans de feu"
    ],
    effets: {
      bonusStats: { force: 2, intelligence: 3 },
      multiplicateurQi: 1.5
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
    utilite: [
      "Attaque dévastatrice contre des groupes d'ennemis",
      "Destruction de barrières et fortifications",
      "Création de diversions",
      "Signal de détresse visible à grande distance",
      "Purification de zones corrompues par des énergies maléfiques"
    ],
    effets: {
      bonusStats: { force: 4 },
      multiplicateurQi: 1.7
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
    utilite: [
      "Auto-guérison de blessures graves ou mortelles",
      "Purification du corps des poisons et malédictions",
      "Dernier recours dans des situations désespérées",
      "Renouvellement complet du Qi en cas d'épuisement",
      "Transcendance temporaire des limites du corps"
    ],
    effets: {
      bonusStats: { constitution: 4, chance: 3 },
      bonusLongevite: 30,
      multiplicateurQi: 2.0
    },
    coutApprentissage: 15000
  },
  {
    id: "technique-alchimie-flamme-celeste",
    nom: "Alchimie de la Flamme Céleste",
    description: "Une technique alchimique avancée qui permet au cultivateur de manipuler une flamme spirituelle spéciale capable de raffiner des ingrédients ordinaires en élixirs puissants. Cette flamme peut également purifier les impuretés des matériaux alchimiques et révéler leurs propriétés cachées.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    utilite: [
      "Création d'élixirs médicinaux et de cultivation",
      "Purification d'ingrédients alchimiques contaminés",
      "Analyse des propriétés cachées de matériaux rares",
      "Extraction d'essences spirituelles de plantes et minéraux",
      "Amélioration de la qualité des pilules alchimiques"
    ],
    effets: {
      bonusStats: { intelligence: 3, perception: 2 },
      multiplicateurQi: 1.4,
      bonusLongevite: 8
    },
    coutApprentissage: 2000
  },
  {
    id: "technique-coeur-fournaise",
    nom: "Cœur de la Fournaise",
    description: "Une technique qui transforme le cœur du cultivateur en une fournaise spirituelle, lui permettant de générer et de contrôler des températures extrêmes. Le pratiquant devient insensible à la chaleur et peut faire fondre presque n'importe quel matériau par simple contact.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DOYEN,
    utilite: [
      "Raffinage de métaux précieux et de matériaux spirituels",
      "Destruction d'artefacts corrompus ou maudits",
      "Survie dans des environnements de chaleur extrême",
      "Combat contre des entités de glace ou d'eau",
      "Création d'armes forgées directement à partir du Qi"
    ],
    effets: {
      bonusStats: { force: 3, constitution: 3 },
      resistanceElement: [ElementCultivation.EAU, ElementCultivation.METAL],
      multiplicateurQi: 1.6
    },
    coutApprentissage: 7000
  },
  {
    id: "technique-soleil-interieur",
    nom: "Soleil Intérieur",
    description: "Une technique mythique qui permet au cultivateur de créer un véritable soleil miniature dans son dantian. Cette source d'énergie quasi-inépuisable alimente toutes les techniques de feu du pratiquant et rayonne d'une aura qui inspire crainte et respect. À son niveau ultime, le cultivateur peut brièvement manifester ce soleil dans le monde extérieur.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.FEU,
    niveauRequis: RoyaumeCultivation.TRANSCENDANCE,
    rangRequis: RangSecte.GRAND_ANCIEN,
    utilite: [
      "Source d'énergie quasi-illimitée pour les techniques de feu",
      "Création d'un domaine de chaleur extrême autour du cultivateur",
      "Manifestation d'un soleil miniature pour des attaques dévastatrices",
      "Illumination de vastes zones plongées dans les ténèbres",
      "Intimidation d'adversaires par la simple présence du cultivateur"
    ],
    effets: {
      bonusStats: { force: 4, constitution: 3, charisme: 4 },
      multiplicateurQi: 2.5,
      bonusLongevite: 35,
      resistanceElement: [ElementCultivation.EAU, ElementCultivation.OBSCURITE]
    },
    coutApprentissage: 35000
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
    utilite: [
      "Méditation en milieu naturel pour accélérer la cultivation",
      "Purification du corps des toxines",
      "Détection des plantes médicinales et des herbes rares",
      "Communication basique avec la flore environnante"
    ],
    effets: {
      multiplicateurQi: 1.15,
      bonusLongevite: 3
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
    utilite: [
      "Culture accélérée d'herbes médicinales et de plantes rares",
      "Création de barrières végétales pour la protection",
      "Amélioration des récoltes et lutte contre la famine",
      "Restauration d'écosystèmes endommagés",
      "Communication avec les plantes pour obtenir des informations"
    ],
    effets: {
      bonusStats: { intelligence: 2, perception: 2 }
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
    utilite: [
      "Protection contre les attaques physiques et spirituelles",
      "Survie dans des environnements hostiles",
      "Camouflage en milieu forestier",
      "Absorption de dégâts pour protéger des alliés"
    ],
    effets: {
      bonusStats: { constitution: 3 },
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
    utilite: [
      "Immobilisation d'adversaires",
      "Création de pièges",
      "Escalade de surfaces verticales",
      "Drainage d'énergie spirituelle d'ennemis",
      "Capture de créatures ou d'individus vivants"
    ],
    effets: {
      bonusStats: { force: 2, agilite: 3, perception: 2 },
      multiplicateurQi: 1.5
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
    utilite: [
      "Guérison de blessures graves",
      "Régénération de membres ou d'organes perdus",
      "Prolongation de la vie de personnes mourantes",
      "Purification de zones corrompues",
      "Restauration de terres stériles"
    ],
    effets: {
      bonusStats: { constitution: 4, intelligence: 3 },
      bonusLongevite: 35,
      multiplicateurQi: 1.8
    },
    coutApprentissage: 10000
  },
  {
    id: "technique-communion-arbre-ancestral",
    nom: "Communion avec l'Arbre Ancestral",
    description: "Une technique méditative qui permet au cultivateur d'établir une connexion spirituelle avec l'Arbre Ancestral de la secte, un être végétal millénaire doté d'une conscience propre. Cette communion permet d'accéder à la sagesse accumulée par l'arbre au fil des siècles et d'obtenir des conseils sur des questions complexes.",
    rarete: Rarete.RARE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    utilite: [
      "Consultation sur des questions de cultivation difficiles",
      "Obtention d'informations historiques oubliées",
      "Guidance spirituelle lors de dilemmes moraux",
      "Localisation de ressources naturelles rares",
      "Apaisement de l'esprit troublé"
    ],
    effets: {
      bonusStats: { intelligence: 3, charisme: 2 },
      bonusLongevite: 8
    },
    coutApprentissage: 800
  },
  {
    id: "technique-metamorphose-vegetale",
    nom: "Métamorphose Végétale",
    description: "Une technique avancée qui permet au cultivateur de transformer temporairement son corps en une forme végétale. Dans cet état, le pratiquant peut fusionner avec les plantes environnantes, absorber les nutriments directement du sol et se régénérer à la lumière du soleil.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    utilite: [
      "Camouflage parfait en milieu naturel",
      "Récupération accélérée de Qi à la lumière du soleil",
      "Survie prolongée sans nourriture conventionnelle",
      "Communication avancée avec toutes formes de végétation",
      "Résistance aux toxines et poisons"
    ],
    effets: {
      bonusStats: { constitution: 3, perception: 2 },
      multiplicateurQi: 1.5,
      bonusLongevite: 12
    },
    coutApprentissage: 2500
  },
  {
    id: "technique-gardien-foret",
    nom: "Gardien de la Forêt Primordiale",
    description: "Une technique légendaire qui fait du cultivateur un véritable gardien de la nature. Le pratiquant peut éveiller la conscience des plantes environnantes, commander aux créatures de la forêt et invoquer l'essence même de la forêt primordiale pour créer un domaine sacré où la nature règne en maître absolu.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.BOIS,
    niveauRequis: RoyaumeCultivation.TRANSCENDANCE,
    rangRequis: RangSecte.GRAND_ANCIEN,
    utilite: [
      "Création d'un domaine naturel sacré et inviolable",
      "Commandement des créatures et plantes sur un vaste territoire",
      "Purification de corruptions spirituelles à grande échelle",
      "Invocation de gardiens végétaux anciens pour la protection",
      "Restauration d'écosystèmes entiers en quelques jours"
    ],
    effets: {
      bonusStats: { force: 3, constitution: 4, charisme: 4 },
      multiplicateurQi: 2.2,
      bonusLongevite: 40,
      resistanceElement: [ElementCultivation.FEU, ElementCultivation.METAL]
    },
    coutApprentissage: 30000
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
    utilite: [
      "Navigation dans l'obscurité totale",
      "Détection d'énergies spirituelles cachées",
      "Perception des illusions et des dissimulations",
      "Lecture de textes anciens dans des tombeaux obscurs",
      "Repérage d'adversaires cachés"
    ],
    effets: {
      bonusStats: { perception: 3 }
    },
    coutApprentissage: 200
  },
  {
    id: "technique-pas-ombre",
    nom: "Pas de l'Ombre",
    description: "Une technique de déplacement qui permet au cultivateur de se fondre dans les ombres et de voyager rapidement d'une zone d'ombre à une autre. À des niveaux avancés, le pratiquant peut même traverser de courtes distances à travers une dimension d'ombre parallèle.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.OBSCURITE,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    utilite: [
      "Déplacement rapide entre zones d'ombre",
      "Évasion de situations dangereuses",
      "Infiltration discrète",
      "Embuscades surprises",
      "Traversée de barrières physiques via les ombres"
    ],
    effets: {
      bonusStats: { agilite: 4 },
      multiplicateurQi: 1.5
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
    utilite: [
      "Attaque perçante contre des défenses spirituelles",
      "Dissipation des ténèbres et des énergies négatives",
      "Révélation d'entités cachées ou invisibles",
      "Purification de zones corrompues",
      "Signal lumineux visible à grande distance"
    ],
    effets: {
      bonusStats: { force: 3, intelligence: 2 },
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
    utilite: [
      "Adaptation à différents environnements spirituels",
      "Création d'illusions complexes mêlant lumière et ombre",
      "Manipulation des perceptions d'autrui",
      "Neutralisation de techniques basées sur la lumière ou l'obscurité",
      "Accès à des domaines spirituels normalement inaccessibles"
    ],
    effets: {
      bonusStats: { intelligence: 3, perception: 3, chance: 2 },
      multiplicateurQi: 1.7,
      resistanceElement: [ElementCultivation.OBSCURITE, ElementCultivation.LUMIERE]
    },
    coutApprentissage: 10000
  },
  {
    id: "technique-vide-absolu",
    nom: "Vide Absolu",
    description: "La technique ultime de la Secte du Voile Obscur, qui permet au cultivateur de créer un espace de vide absolu où ni la lumière ni l'obscurité n'existent. Dans cet espace, le pratiquant devient presque omnipotent, pouvant manipuler la réalité elle-même pour une courte durée.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.OBSCURITE, // Bien que ce soit un mélange des deux
    niveauRequis: RoyaumeCultivation.TRANSCENDANCE,
    rangRequis: RangSecte.ANCIEN,
    utilite: [
      "Création d'un domaine personnel où les lois normales ne s'appliquent pas",
      "Isolement complet d'une zone de combat",
      "Manipulation temporaire de la réalité",
      "Protection absolue contre les attaques extérieures",
      "Méditation profonde pour des percées spirituelles majeures"
    ],
    effets: {
      bonusStats: { intelligence: 4, perception: 4, chance: 3 },
      multiplicateurQi: 2.5,
      bonusLongevite: 40
    },
    coutApprentissage: 50000
  },
  {
    id: "technique-meditation-dualite",
    nom: "Méditation de la Dualité Céleste",
    description: "Une technique méditative fondamentale de la Secte du Voile Obscur qui enseigne au cultivateur à percevoir et à comprendre la nature duelle de l'univers. En alternant entre la contemplation de la lumière et de l'obscurité, le pratiquant développe une compréhension profonde de l'équilibre cosmique.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.LUMIERE, // Alterne entre lumière et obscurité
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    utilite: [
      "Méditation quotidienne pour renforcer l'esprit",
      "Développement d'une affinité avec la lumière et l'obscurité",
      "Préparation mentale pour des techniques plus avancées",
      "Perception des déséquilibres énergétiques subtils",
      "Résistance aux influences spirituelles extérieures"
    ],
    effets: {
      bonusStats: { intelligence: 2, perception: 2 },
      multiplicateurQi: 1.25
    },
    coutApprentissage: 200
  },
  {
    id: "technique-illusion-miroir",
    nom: "Illusion du Miroir Céleste",
    description: "Une technique qui permet au cultivateur de créer des illusions complexes en manipulant la lumière et l'ombre. Ces illusions peuvent sembler totalement réelles aux sens et même posséder une substance semi-physique capable d'interagir avec le monde réel.",
    rarete: Rarete.RARE,
    element: ElementCultivation.LUMIERE,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    utilite: [
      "Création de diversions lors de situations dangereuses",
      "Dissimulation d'objets ou de personnes",
      "Tests psychologiques pour les disciples",
      "Représentation visuelle de concepts abstraits lors de l'enseignement",
      "Manipulation subtile des perceptions d'autrui"
    ],
    effets: {
      bonusStats: { intelligence: 3, charisme: 2 },
      multiplicateurQi: 1.4
    },
    coutApprentissage: 1500
  },
  {
    id: "technique-ascension-astrale",
    nom: "Ascension Astrale",
    description: "Une technique mystique qui permet au cultivateur de séparer son esprit de son corps physique, lui permettant de voyager dans le plan astral. Dans cet état, le pratiquant peut observer des lieux distants, communiquer avec d'autres êtres spirituels et accéder à des connaissances normalement inaccessibles.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.LUMIERE,
    niveauRequis: RoyaumeCultivation.SAINT_MARTIAL,
    rangRequis: RangSecte.PATRIARCHE,
    utilite: [
      "Exploration de domaines spirituels inaccessibles physiquement",
      "Communication avec des entités célestes et des esprits anciens",
      "Observation d'événements distants en temps réel",
      "Acquisition de connaissances cosmiques transcendantes",
      "Préparation à la véritable transcendance spirituelle"
    ],
    effets: {
      bonusStats: { intelligence: 5, perception: 4, chance: 4 },
      multiplicateurQi: 3.0,
      bonusLongevite: 60,
      resistanceElement: [ElementCultivation.OBSCURITE, ElementCultivation.LUMIERE, ElementCultivation.FOUDRE]
    },
    coutApprentissage: 100000
  }
];

// Techniques de la Secte de l'Épée d'Azur (Martiale, Métal)
export const TECHNIQUES_EPEE_AZUR: TechniqueCultivation[] = [
  {
    id: "technique-meditation-lame-azur",
    nom: "Méditation de la Lame d'Azur",
    description: "Une technique de méditation fondamentale qui permet au cultivateur de comprendre l'essence du métal et de forger un lien spirituel avec son épée. Le pratiquant visualise son Qi comme une lame tranchante qui affine constamment son esprit et son corps.",
    rarete: Rarete.COMMUN,
    element: ElementCultivation.METAL,
    niveauRequis: RoyaumeCultivation.INITIATION,
    rangRequis: RangSecte.DISCIPLE_EXTERNE,
    utilite: [
      "Méditation quotidienne pour renforcer le lien avec l'épée",
      "Amélioration de la précision et de la vitesse des techniques d'épée",
      "Purification du Qi pour le rendre plus tranchant",
      "Préparation mentale avant les combats"
    ],
    effets: {
      bonusStats: { agilite: 2 },
      multiplicateurQi: 1.25
    },
    coutApprentissage: 100
  },
  {
    id: "technique-pas-eclair-celeste",
    nom: "Pas de l'Éclair Céleste",
    description: "Une technique de déplacement avancée qui permet au cultivateur de se mouvoir avec une vitesse fulgurante, laissant une traînée d'énergie azurée derrière lui. Cette technique est parfaite pour surprendre les adversaires ou esquiver des attaques rapides.",
    rarete: Rarete.RARE,
    element: ElementCultivation.METAL,
    niveauRequis: RoyaumeCultivation.QI_CONDENSE,
    rangRequis: RangSecte.DISCIPLE_INTERNE,
    utilite: [
      "Déplacement rapide sur le champ de bataille",
      "Esquive d'attaques ennemies",
      "Création d'images résiduelles pour confondre l'adversaire",
      "Exécution de manœuvres d'épée complexes nécessitant une grande mobilité",
      "Poursuite d'adversaires en fuite"
    ],
    effets: {
      bonusStats: { agilite: 3, perception: 2 },
      multiplicateurQi: 1.4
    },
    coutApprentissage: 500
  },
  {
    id: "technique-forge-epee-spirituelle",
    nom: "Forge de l'Épée Spirituelle",
    description: "Une technique légendaire de forge qui permet au cultivateur d'infuser son Qi dans le métal pour créer des épées spirituelles exceptionnelles. Ces armes peuvent canaliser le Qi du porteur et devenir plus puissantes avec le temps, développant même une conscience rudimentaire.",
    rarete: Rarete.EPIQUE,
    element: ElementCultivation.METAL,
    niveauRequis: RoyaumeCultivation.FONDATION,
    rangRequis: RangSecte.DISCIPLE_PRINCIPAL,
    utilite: [
      "Création d'épées spirituelles de haute qualité",
      "Réparation et amélioration d'armes existantes",
      "Extraction de l'essence de métaux rares",
      "Purification de matériaux contaminés par des énergies négatives",
      "Création de talismans métalliques pour la défense"
    ],
    effets: {
      bonusStats: { force: 2, intelligence: 3 },
      multiplicateurQi: 1.5
    },
    coutApprentissage: 2000
  },
  {
    id: "technique-danse-lames-azurees",
    nom: "Danse des Lames Azurées",
    description: "Une technique de combat avancée qui permet au cultivateur de contrôler simultanément plusieurs épées volantes avec son Qi. Ces lames dansent autour du pratiquant, formant un bouclier défensif tout en lançant des attaques précises contre les ennemis.",
    rarete: Rarete.LEGENDAIRE,
    element: ElementCultivation.METAL,
    niveauRequis: RoyaumeCultivation.CORE_OR,
    rangRequis: RangSecte.DOYEN,
    utilite: [
      "Combat contre plusieurs adversaires simultanément",
      "Création d'une zone de défense impénétrable",
      "Attaques à distance précises et mortelles",
      "Démonstration de maîtrise lors de tournois",
      "Exécution de formations d'épées complexes avec d'autres disciples"
    ],
    effets: {
      bonusStats: { force: 2, agilite: 3, intelligence: 3 },
      multiplicateurQi: 1.7
    },
    coutApprentissage: 5000
  },
  {
    id: "technique-tranchant-absolu",
    nom: "Tranchant Absolu",
    description: "La technique ultime de la Secte de l'Épée d'Azur, qui concentre l'essence du métal dans une seule frappe d'une puissance inimaginable. Cette attaque peut trancher presque n'importe quelle matière, y compris certaines défenses spirituelles, et laisse une marque azurée caractéristique sur tout ce qu'elle touche.",
    rarete: Rarete.MYTHIQUE,
    element: ElementCultivation.METAL,
    niveauRequis: RoyaumeCultivation.TRANSCENDANCE,
    rangRequis: RangSecte.ANCIEN,
    utilite: [
      "Frappe décisive contre des adversaires puissants",
      "Pénétration de barrières spirituelles et formations défensives",
      "Découpe de matériaux normalement indestructibles",
      "Création de failles spatiales temporaires",
      "Technique signature des maîtres de la secte lors de confrontations majeures"
    ],
    effets: {
      bonusStats: { force: 4, agilite: 4, perception: 3 },
      multiplicateurQi: 2.5,
      bonusLongevite: 30
    },
    coutApprentissage: 30000
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
    case "secte-epee-azur":
      return [...TECHNIQUES_GENERIQUES, ...TECHNIQUES_EPEE_AZUR];
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
    ...TECHNIQUES_VOILE_OBSCUR,
    ...TECHNIQUES_EPEE_AZUR
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
  
  // Vérifier le niveau de cultivation requis (maintenant rétrocompatible)
  // On vérifie si le royaume du personnage est inférieur au royaume requis
  const royaumeIndex = Object.values(RoyaumeCultivation).indexOf(personnage.royaumeCultivation);
  const royaumeRequisIndex = Object.values(RoyaumeCultivation).indexOf(technique.niveauRequis);
  
  if (royaumeIndex < royaumeRequisIndex) {
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
  
  // Vérifier le rang requis dans la secte (maintenant rétrocompatible)
  if (technique.rangRequis && personnage.appartenanceSecte) {
    const rangPersonnageIndex = Object.values(RangSecte).indexOf(personnage.appartenanceSecte.rang);
    const rangRequisIndex = Object.values(RangSecte).indexOf(technique.rangRequis);
    
    if (rangPersonnageIndex < rangRequisIndex) {
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