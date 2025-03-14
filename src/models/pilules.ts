import { 
  Personnage, 
  Pilule, 
  PILULES, 
  Stats,
  calculerStatsCombat
} from './types';

// Fonction pour acheter une pilule et l'ajouter à l'inventaire
export const acheterPilule = (personnage: Personnage, piluleId: string): { 
  personnageMisAJour: Personnage, 
  succes: boolean, 
  message: string 
} => {
  // Vérifier si le personnage appartient à une secte
  if (!personnage.appartenanceSecte) {
    return { 
      personnageMisAJour: personnage, 
      succes: false, 
      message: "Vous devez appartenir à une secte pour acheter des pilules." 
    };
  }

  // Trouver la pilule
  const pilule = PILULES.find(p => p.id === piluleId);
  if (!pilule) {
    return { 
      personnageMisAJour: personnage, 
      succes: false, 
      message: "Pilule introuvable." 
    };
  }

  // Vérifier si le personnage a assez de points de contribution
  if (personnage.appartenanceSecte.pointsContribution < pilule.coutContribution) {
    return { 
      personnageMisAJour: personnage, 
      succes: false, 
      message: `Vous n'avez pas assez de points de contribution. Nécessaire: ${pilule.coutContribution}` 
    };
  }

  // Vérifier la limite d'achat si applicable
  if (pilule.limiteAchat) {
    const pilulesAchetees = personnage.pilulesAchetees || {};
    const nombreAchats = pilulesAchetees[piluleId] || 0;
    
    if (nombreAchats >= pilule.limiteAchat) {
      return { 
        personnageMisAJour: personnage, 
        succes: false, 
        message: `Vous avez atteint la limite d'achat pour cette pilule (${pilule.limiteAchat}).` 
      };
    }
  }

  // Copie profonde du personnage pour éviter les mutations directes
  const personnageMisAJour = JSON.parse(JSON.stringify(personnage));
  
  // Mettre à jour les points de contribution
  personnageMisAJour.appartenanceSecte.pointsContribution -= pilule.coutContribution;
  
  // Mettre à jour le compteur d'achats de pilules
  if (!personnageMisAJour.pilulesAchetees) {
    personnageMisAJour.pilulesAchetees = {};
  }
  personnageMisAJour.pilulesAchetees[piluleId] = (personnageMisAJour.pilulesAchetees[piluleId] || 0) + 1;
  
  // Ajouter la pilule à l'inventaire
  if (!personnageMisAJour.inventairePilules) {
    personnageMisAJour.inventairePilules = {};
  }
  personnageMisAJour.inventairePilules[piluleId] = (personnageMisAJour.inventairePilules[piluleId] || 0) + 1;
  
  return { 
    personnageMisAJour, 
    succes: true, 
    message: `Vous avez acheté une ${pilule.nom} avec succès! Elle a été ajoutée à votre inventaire.` 
  };
};

// Fonction pour utiliser une pilule depuis l'inventaire
export const utiliserPilule = (personnage: Personnage, piluleId: string): { 
  personnageMisAJour: Personnage, 
  succes: boolean, 
  message: string 
} => {
  // Vérifier si le personnage a la pilule dans son inventaire
  if (!personnage.inventairePilules || !personnage.inventairePilules[piluleId] || personnage.inventairePilules[piluleId] <= 0) {
    return { 
      personnageMisAJour: personnage, 
      succes: false, 
      message: "Vous n'avez pas cette pilule dans votre inventaire." 
    };
  }

  // Trouver la pilule
  const pilule = PILULES.find(p => p.id === piluleId);
  if (!pilule) {
    return { 
      personnageMisAJour: personnage, 
      succes: false, 
      message: "Pilule introuvable." 
    };
  }

  // Copie profonde du personnage pour éviter les mutations directes
  const personnageMisAJour = JSON.parse(JSON.stringify(personnage));
  
  // Retirer la pilule de l'inventaire
  personnageMisAJour.inventairePilules[piluleId] -= 1;
  
  // Appliquer les effets de la pilule
  if (pilule.effets.gainQi) {
    personnageMisAJour.pointsQi += pilule.effets.gainQi;
    personnageMisAJour.pointsQiTotal += pilule.effets.gainQi;
  }
  
  if (pilule.effets.bonusStats) {
    // Appliquer les bonus aux statistiques
    Object.entries(pilule.effets.bonusStats).forEach(([stat, value]) => {
      personnageMisAJour.stats[stat as keyof Stats] += value;
    });
  }
  
  if (pilule.effets.bonusLongevite) {
    // Stocker le bonus de longévité
    if (!personnageMisAJour.bonusLongevite) {
      personnageMisAJour.bonusLongevite = 0;
    }
    personnageMisAJour.bonusLongevite += pilule.effets.bonusLongevite;
  }
  
  if (pilule.effets.bonusPercee) {
    // Stocker le bonus de percée
    if (!personnageMisAJour.bonusPercee) {
      personnageMisAJour.bonusPercee = 0;
    }
    personnageMisAJour.bonusPercee += pilule.effets.bonusPercee;
  }
  
  // Mettre à jour les statistiques de combat
  personnageMisAJour.stats = {
    ...personnageMisAJour.stats,
    ...calculerStatsCombat(personnageMisAJour.stats, personnageMisAJour.royaumeCultivation)
  };
  
  return { 
    personnageMisAJour, 
    succes: true, 
    message: `Vous avez utilisé une ${pilule.nom} avec succès!` 
  };
}; 
