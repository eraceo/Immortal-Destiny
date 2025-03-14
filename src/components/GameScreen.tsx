import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  LinearProgress, 
  Button, 
  Card, 
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Slider,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { 
  Personnage, 
  getRaceInfo, 
  getOrigineInfo, 
  getRareteColor, 
  getNomCompletCultivation, 
  getDescriptionRoyaume,
  getProchainNiveau,
  getRoyaumeColor,
  calculerEsperanceVie,
  calculerAgeActuel,
  formaterTempsJeu,
  TEMPS_REEL_PAR_ANNEE_JEU,
  Evenement,
  obtenirEvenementAleatoire,
  appliquerEffetsEvenement,
  TypeEvenement,
  getSecteById,
  calculerBonusSecte,
  ElementCultivation,
  RangSecte,
  TypeSecte,
  RoyaumeCultivation,
  NiveauPercee,
  Genre,
  Race,
  Origine,
  Stats,
  Secte,
  rejoindreSecte,
  getSecteDisponibles,
  appliquerBonusSecte,
  QI_REQUIS_PERCEE,
  STAT_MAX_JEU,
  calculerStatsCombat,
  MULTIPLICATEUR_COMBAT_ROYAUME,
  estNiveauMaximumAtteint
} from '../models/types';
import Layout, { MenuType } from './Layout';
import { 
  ProfileMenu, 
  CultivationMenu, 
  InventoryMenu, 
  QuestsMenu, 
  StatsMenu,
  SecteMenu,
  TechniquesMenu,
  Settings,
  CombatMenu
} from './menus';
import { GameSettings, defaultSettings } from './menus/Settings';

const GameScreen: React.FC = () => {
  const [personnage, setPersonnage] = useState<Personnage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meditationActive, setMeditationActive] = useState<boolean>(false);
  const [gainQiParSeconde, setGainQiParSeconde] = useState<number>(0);
  const [openPerceeDialog, setOpenPerceeDialog] = useState<boolean>(false);
  const [tempsTotalMeditation, setTempsTotalMeditation] = useState<number>(0);
  const [tempsMeditationCumule, setTempsMeditationCumule] = useState<number>(0);
  const [esperanceVie, setEsperanceVie] = useState<number>(0);
  const [tempsJeuFormate, setTempsJeuFormate] = useState<string>("00:00:00");
  const [openMortDialog, setOpenMortDialog] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>(MenuType.PROFILE);
  
  // Nouvel état pour les événements aléatoires
  const [evenementActuel, setEvenementActuel] = useState<Evenement | null>(null);
  const [openEvenementDialog, setOpenEvenementDialog] = useState<boolean>(false);
  const [derniereAnneeEvenement, setDerniereAnneeEvenement] = useState<number>(0);
  const [historiqueEvenements, setHistoriqueEvenements] = useState<Evenement[]>([]);
  
  // Référence pour les timers
  const ageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const qiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tempsJeuTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sauvegardeAutoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moisTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // État pour suivre les mois écoulés
  const [moisActuel, setMoisActuel] = useState<number>(0);
  // Ajout de l'état pour vérifier si une percée est disponible
  const [perceeDisponible, setPerceeDisponible] = useState<boolean>(false);

  // Ajout de l'état pour les paramètres du jeu
  const [gameSettings, setGameSettings] = useState<GameSettings>(
    JSON.parse(localStorage.getItem('gameSettings') || JSON.stringify(defaultSettings))
  );

  // Fonction pour calculer les buffs de cultivation
  const calculerBuffsCultivation = useCallback((personnageData: Personnage): {
    baseQi: number,
    bonusIntelligence: number,
    bonusPerception: number,
    multiplicateurRoyaume: number,
    bonusSecte: number,
    bonusTechniques: { nom: string, valeur: number }[],
    bonusOrigine: number,
    total: number
  } => {
    if (!personnageData) return {
      baseQi: 0,
      bonusIntelligence: 0,
      bonusPerception: 0,
      multiplicateurRoyaume: 0,
      bonusSecte: 0,
      bonusTechniques: [],
      bonusOrigine: 0,
      total: 0
    };
    
    // Calcul de base à partir des statistiques
    const qiBase = personnageData.stats.qi;
    const intelligenceBonus = personnageData.stats.intelligence * 0.08;
    const perceptionBonus = personnageData.stats.perception * 0.04;
    const gainBase = Math.max(0.01, parseFloat((qiBase * (1 + (intelligenceBonus + perceptionBonus) / 25)).toFixed(2)));
    
    // Multiplicateur du royaume de cultivation
    let multiplicateurRoyaume = 1;
    switch (personnageData.royaumeCultivation) {
      case RoyaumeCultivation.MORTEL:
        multiplicateurRoyaume = 1;
        break;
      case RoyaumeCultivation.INITIATION:
        multiplicateurRoyaume = 1.5;
        break;
      case RoyaumeCultivation.QI_CONDENSE:
        multiplicateurRoyaume = 2;
        break;
      case RoyaumeCultivation.FONDATION:
        multiplicateurRoyaume = 3;
        break;
      case RoyaumeCultivation.CORE_OR:
        multiplicateurRoyaume = 5;
        break;
      case RoyaumeCultivation.NASCENT_SOUL:
        multiplicateurRoyaume = 8;
        break;
      case RoyaumeCultivation.TRANSCENDANCE:
        multiplicateurRoyaume = 12;
        break;
      case RoyaumeCultivation.SAINT_MARTIAL:
        multiplicateurRoyaume = 20;
        break;
      case RoyaumeCultivation.DEMI_DIEU:
        multiplicateurRoyaume = 35;
        break;
      case RoyaumeCultivation.DIVIN_SUPREME:
        multiplicateurRoyaume = 50;
        break;
    }
    
    // Bonus de secte
    const bonusSecte = calculerBonusSecte(personnageData);
    const multiplicateurSecte = bonusSecte.multiplicateurQi;
    
    // Bonus des techniques
    const bonusTechniques = personnageData.techniquesApprises
      .filter(technique => technique.effets.multiplicateurQi)
      .map(technique => ({
        nom: technique.nom,
        valeur: technique.effets.multiplicateurQi || 1
      }));
    
    // Bonus de l'origine
    const bonusOrigine = personnageData.bonusQi ? (1 + personnageData.bonusQi / 100) : 1;
    
    // Calcul du gain total
    let gainTotal = gainBase * multiplicateurRoyaume * multiplicateurSecte;
    bonusTechniques.forEach(bonus => {
      gainTotal *= bonus.valeur;
    });
    gainTotal *= bonusOrigine;
    
    return {
      baseQi: gainBase,
      bonusIntelligence: intelligenceBonus,
      bonusPerception: perceptionBonus,
      multiplicateurRoyaume,
      bonusSecte: multiplicateurSecte,
      bonusTechniques,
      bonusOrigine,
      total: parseFloat(gainTotal.toFixed(2))
    };
  }, []);

  // Fonction pour calculer le gain de Qi par seconde
  const calculerGainQiParSeconde = useCallback((personnageData: Personnage): number => {
    if (!personnageData) return 0;
    
    // Utiliser la fonction calculerBuffsCultivation pour obtenir le gain total
    const buffs = calculerBuffsCultivation(personnageData);
    return buffs.total;
  }, [calculerBuffsCultivation]);

  // Charger le personnage depuis le localStorage
  useEffect(() => {
    try {
      const sauvegardeBase64 = localStorage.getItem('wuxiaWorldSauvegarde');
      if (!sauvegardeBase64) {
        setError("Aucun personnage trouvé. Veuillez en créer un nouveau.");
        setLoading(false);
        return;
      }

      // Décoder le base64 en JSON
      const sauvegardeJSON = atob(sauvegardeBase64);
      const sauvegarde = JSON.parse(sauvegardeJSON);
      
      // Extraire les données de la sauvegarde
      const personnageData = sauvegarde.personnage;
      const tempsMeditationCumuleSauvegarde = sauvegarde.tempsMeditationCumule || 0;
      const derniereAnneeEvenementSauvegarde = sauvegarde.derniereAnneeEvenement || 0;
      const historiqueEvenementsSauvegarde = sauvegarde.historiqueEvenements || [];
      
      // Initialiser tempsEcoule s'il n'existe pas
      if (personnageData.tempsEcoule === undefined) {
        personnageData.tempsEcoule = 0;
      }
      
      // Mettre à jour le dernier temps de jeu
      personnageData.dernierTempsJeu = Date.now();
      
      // S'assurer que l'âge est correctement initialisé
      // Si l'âge n'est pas défini, l'initialiser à partir du temps de méditation
      if (personnageData.age === undefined) {
        const anneesMeditation = Math.floor(tempsMeditationCumuleSauvegarde / 60);
        personnageData.age = (personnageData.age || 0) + anneesMeditation;
      }
      
      // Réinitialiser le temps de méditation cumulé pour éviter de compter deux fois les années
      const nouveauTempsMeditationCumule = tempsMeditationCumuleSauvegarde % 60;
      
      setPersonnage(personnageData);
      setTempsMeditationCumule(nouveauTempsMeditationCumule);
      setDerniereAnneeEvenement(derniereAnneeEvenementSauvegarde);
      setHistoriqueEvenements(historiqueEvenementsSauvegarde);
      
      // Définir l'âge actuel pour l'affichage
      // setAgeActuel(personnageData.age);
      
      const esperanceVieCalculee = calculerEsperanceVie(personnageData.race, personnageData.royaumeCultivation);
      setEsperanceVie(esperanceVieCalculee);
      
      // Formater le temps de jeu total
      setTempsJeuFormate(formaterTempsJeu(personnageData.tempsJeuTotal));
      
      // Calculer le gain de Qi par seconde
      const gainCalcule = calculerGainQiParSeconde(personnageData);
      setGainQiParSeconde(gainCalcule);
      
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement du personnage. Veuillez en créer un nouveau.");
      setLoading(false);
      console.error("Erreur lors du chargement du personnage:", err);
    }
  }, [calculerGainQiParSeconde]);

  // Sauvegarder le personnage dans le localStorage
  const sauvegarderPersonnage = useCallback((personnageToSave?: Personnage | null) => {
    try {
      const personnageASauvegarder = personnageToSave || personnage;
      if (!personnageASauvegarder) return false;
      
      // Créer l'objet de sauvegarde
      const sauvegarde = {
        personnage: personnageASauvegarder,
        tempsMeditationCumule,
        derniereAnneeEvenement,
        historiqueEvenements
      };
      
      // Convertir en JSON puis en base64
      const sauvegardeJSON = JSON.stringify(sauvegarde);
      const sauvegardeBase64 = btoa(sauvegardeJSON);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('wuxiaWorldSauvegarde', sauvegardeBase64);
      
      // Afficher un message de succès si c'est une sauvegarde manuelle
      if (!personnageToSave) {
        setSnackbarMessage("Personnage sauvegardé avec succès !");
        setSnackbarOpen(true);
      }
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setSnackbarMessage("Erreur lors de la sauvegarde !");
      setSnackbarOpen(true);
      return false;
    }
  }, [personnage, tempsMeditationCumule, derniereAnneeEvenement, historiqueEvenements]);

  // Fonction pour sauvegarder manuellement
  const sauvegarderManuellement = () => {
    sauvegarderPersonnage(personnage);
  };

  // Mettre en place la sauvegarde automatique toutes les 5 secondes
  useEffect(() => {
    if (personnage) {
      // Démarrer le timer pour la sauvegarde automatique
      sauvegardeAutoTimerRef.current = setInterval(() => {
        const resultat = sauvegarderPersonnage(personnage);
        if (resultat) {
          console.log("Sauvegarde automatique effectuée");
        }
      }, 5000); // Sauvegarde toutes les 5 secondes
    }
    
    return () => {
      // Nettoyer le timer de sauvegarde automatique
      if (sauvegardeAutoTimerRef.current) {
        clearInterval(sauvegardeAutoTimerRef.current);
        sauvegardeAutoTimerRef.current = null;
      }
    };
  }, [personnage, sauvegarderPersonnage]);

  // Fonction pour déclencher un événement aléatoire
  const declencherEvenementAleatoire = useCallback(() => {
    if (!personnage) return;
    
    const evenement = obtenirEvenementAleatoire(personnage.royaumeCultivation);
    if (evenement) {
      setEvenementActuel(evenement);
      setOpenEvenementDialog(true);
      
      // Ajouter l'événement à l'historique
      setHistoriqueEvenements(prev => [...prev, evenement]);
    }
  }, [personnage]);

  // Fonction pour appliquer les effets de l'événement actuel
  const appliquerEvenement = useCallback(() => {
    if (!personnage || !evenementActuel) return;
    
    // Appliquer les effets de l'événement au personnage
    const personnageModifie = appliquerEffetsEvenement(personnage, evenementActuel);
    
    // Mettre à jour l'espérance de vie si nécessaire
    if (evenementActuel.effets.esperanceVie) {
      const nouvelleEsperanceVie = Math.max(personnage.age + 1, esperanceVie + evenementActuel.effets.esperanceVie);
      setEsperanceVie(nouvelleEsperanceVie);
    }
    
    // Mettre à jour le personnage
    setPersonnage(personnageModifie);
    
    // Fermer la boîte de dialogue
    setOpenEvenementDialog(false);
    setEvenementActuel(null);
    
    // Afficher un message de confirmation
    setSnackbarMessage(`Les effets de l'événement "${evenementActuel.titre}" ont été appliqués !`);
    setSnackbarOpen(true);
  }, [personnage, evenementActuel, esperanceVie]);

  // Gérer le vieillissement du personnage
  useEffect(() => {
    // Le timer d'âge ne doit être actif que pendant la méditation
    if (personnage && meditationActive) {
      // Démarrer le timer pour mettre à jour l'âge uniquement pendant la méditation
      ageTimerRef.current = setInterval(() => {
        // Calculer l'âge en fonction du temps de méditation cumulé
        // Un an par minute (60 secondes)
        const anneesMeditation = Math.floor(tempsMeditationCumule / 60);
        const nouvelAge = personnage.age + anneesMeditation;
        
        // Vérifier si une année s'est écoulée depuis le dernier événement
        const anneeActuelle = Math.floor(tempsMeditationCumule / 60);
        if (anneeActuelle > derniereAnneeEvenement) {
          // Mettre à jour la dernière année d'événement
          setDerniereAnneeEvenement(anneeActuelle);
          
          // Déclencher un événement aléatoire
          declencherEvenementAleatoire();
        }
        
        // Vérifier si le personnage a dépassé son espérance de vie
        if (nouvelAge >= esperanceVie) {
          setMeditationActive(false);
          setOpenMortDialog(true);
          
          // Arrêter le timer
          if (ageTimerRef.current) {
            clearInterval(ageTimerRef.current);
            ageTimerRef.current = null;
          }
        }
      }, 1000); // Mettre à jour l'âge chaque seconde pendant la méditation
    } else {
      // Si la méditation est désactivée, arrêter le timer d'âge
      if (ageTimerRef.current) {
        clearInterval(ageTimerRef.current);
        ageTimerRef.current = null;
      }
    }
    
    // Démarrer le timer pour mettre à jour le temps de jeu (indépendant de la méditation)
    if (personnage && !tempsJeuTimerRef.current) {
      tempsJeuTimerRef.current = setInterval(() => {
        if (personnage) {
          setPersonnage(prev => {
            if (!prev) return prev;
            const nouveauTempsJeuTotal = prev.tempsJeuTotal + 1;
            setTempsJeuFormate(formaterTempsJeu(nouveauTempsJeuTotal));
            return {
              ...prev,
              tempsJeuTotal: nouveauTempsJeuTotal
            };
          });
        }
      }, 1000); // Mettre à jour le temps de jeu chaque seconde
    }
    
    return () => {
      // Nettoyer les timers
      if (ageTimerRef.current) {
        clearInterval(ageTimerRef.current);
        ageTimerRef.current = null;
      }
      
      if (tempsJeuTimerRef.current) {
        clearInterval(tempsJeuTimerRef.current);
        tempsJeuTimerRef.current = null;
      }
    };
  }, [personnage, esperanceVie, meditationActive, tempsMeditationCumule, derniereAnneeEvenement, declencherEvenementAleatoire]); // Ajouter tempsMeditationCumule comme dépendance

  // Fonction pour activer/désactiver la méditation
  const toggleMeditation = () => {
    if (meditationActive) {
      // Arrêter la méditation
      setMeditationActive(false);
      if (ageTimerRef.current) {
        clearInterval(ageTimerRef.current);
        ageTimerRef.current = null;
      }
      if (qiTimerRef.current) {
        clearInterval(qiTimerRef.current);
        qiTimerRef.current = null;
      }
      if (moisTimerRef.current) {
        clearInterval(moisTimerRef.current);
        moisTimerRef.current = null;
      }
    } else {
      // Vérifier si le personnage a atteint le niveau maximum de cultivation
      if (personnage && estNiveauMaximumAtteint(personnage.royaumeCultivation, personnage.niveauPercee)) {
        // Afficher un message indiquant que le niveau maximum est atteint
        setSnackbarMessage("Vous avez atteint le niveau maximum de cultivation. Aucune progression supplémentaire n'est possible.");
        setSnackbarOpen(true);
        return;
      }
      
      // Démarrer la méditation
      setMeditationActive(true);
      
      // Calculer le gain de Qi par seconde
      if (personnage) {
        const gainCalcule = calculerGainQiParSeconde(personnage);
        setGainQiParSeconde(gainCalcule);
      }
      
      // Timer pour mettre à jour les points de Qi chaque seconde
      qiTimerRef.current = setInterval(() => {
        setPersonnage(prevPersonnage => {
          if (!prevPersonnage) return null;
          
          // Calculer le gain de Qi en utilisant directement calculerBuffsCultivation
          const buffs = calculerBuffsCultivation(prevPersonnage);
          const gainReel = buffs.total;
          
          // Incrémenter les points de Qi avec le gain réel calculé
          const nouveauxPointsQi = prevPersonnage.pointsQi + gainReel;
          const nouveauxPointsQiTotal = prevPersonnage.pointsQiTotal + gainReel;
          
          // Vérifier si le personnage a atteint le Qi requis pour une percée
          if (nouveauxPointsQi >= prevPersonnage.qiRequis) {
            // Arrêter la méditation pour effectuer la percée
            setMeditationActive(false);
            if (qiTimerRef.current) {
              clearInterval(qiTimerRef.current);
              qiTimerRef.current = null;
            }
            if (ageTimerRef.current) {
              clearInterval(ageTimerRef.current);
              ageTimerRef.current = null;
            }
            if (moisTimerRef.current) {
              clearInterval(moisTimerRef.current);
              moisTimerRef.current = null;
            }
            setOpenPerceeDialog(true);
            setPerceeDisponible(true);
          }
          
          return {
            ...prevPersonnage,
            pointsQi: nouveauxPointsQi,
            pointsQiTotal: nouveauxPointsQiTotal
          };
        });
      }, 1000);
      
      // Timer pour mettre à jour les mois plus fréquemment (environ 5 secondes = 1 mois)
      moisTimerRef.current = setInterval(() => {
        // Incrémenter le mois actuel
        setMoisActuel(prevMois => {
          const nouveauMois = (prevMois + 1) % 12;
          
          // Si on a fait un tour complet (12 mois = 1 an), on ne fait rien de spécial ici
          // car l'âge est géré par le timer d'âge
          
          return nouveauMois;
        });
        
        // Incrémenter le temps total de méditation (fraction d'une seconde)
        setTempsTotalMeditation(prev => prev + (1/12));
        
        // Incrémenter le temps écoulé
        setPersonnage(prevPersonnage => {
          if (!prevPersonnage) return null;
          
          // Ajouter 1/12 d'année au temps écoulé (1 mois)
          const nouveauTempsEcoule = (prevPersonnage.tempsEcoule || 0) + (1/12);
          
          // Vérifier si une année complète s'est écoulée
          const anneesPrecedentes = Math.floor(prevPersonnage.tempsEcoule || 0);
          const anneesActuelles = Math.floor(nouveauTempsEcoule);
          
          // Si une nouvelle année complète s'est écoulée, incrémenter l'âge
          if (anneesActuelles > anneesPrecedentes) {
            const nouvelAge = prevPersonnage.age + 1;
            // setAgeActuel(nouvelAge);
            
            // Vérifier si le personnage a dépassé son espérance de vie
            const esperanceVieActuelle = calculerEsperanceVie(prevPersonnage.race, prevPersonnage.royaumeCultivation);
            
            // Appliquer les bonus de secte à l'espérance de vie
            let esperanceVieFinale = esperanceVieActuelle;
            if (prevPersonnage.appartenanceSecte) {
              const bonusSecte = calculerBonusSecte(prevPersonnage);
              esperanceVieFinale += (esperanceVieActuelle * bonusSecte.bonusLongevite / 100);
            }
            
            if (nouvelAge >= esperanceVieFinale) {
              // Le personnage est mort de vieillesse
              setMeditationActive(false);
              if (ageTimerRef.current) {
                clearInterval(ageTimerRef.current);
                ageTimerRef.current = null;
              }
              if (qiTimerRef.current) {
                clearInterval(qiTimerRef.current);
                qiTimerRef.current = null;
              }
              if (moisTimerRef.current) {
                clearInterval(moisTimerRef.current);
                moisTimerRef.current = null;
              }
              setOpenMortDialog(true);
              return prevPersonnage;
            }
            
            // Vérifier si un événement aléatoire doit se produire (tous les 10 ans de jeu)
            if (nouvelAge > derniereAnneeEvenement && nouvelAge % 10 === 0) {
              setDerniereAnneeEvenement(nouvelAge);
              
              // Tenter de générer un événement aléatoire
              const evenement = obtenirEvenementAleatoire(prevPersonnage.royaumeCultivation);
              if (evenement) {
                setEvenementActuel(evenement);
                setOpenEvenementDialog(true);
                
                // Ajouter l'événement à l'historique
                setHistoriqueEvenements(prev => [...prev, evenement]);
              }
            }
            
            return {
              ...prevPersonnage,
              age: nouvelAge,
              tempsEcoule: nouveauTempsEcoule
            };
          }
          
          // Si aucune année complète ne s'est écoulée, mettre à jour uniquement le temps écoulé
          return {
            ...prevPersonnage,
            tempsEcoule: nouveauTempsEcoule
          };
        });
      }, 5000); // Mise à jour toutes les 5 secondes (1 minute / 12)
    }
  };

  // Effectuer une percée
  const effectuerPercee = () => {
    if (!personnage) return;
    
    // Obtenir les informations sur le prochain niveau
    const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
    
    // Calculer les points de Qi excédentaires
    const pointsQiExcedentaires = personnage.pointsQi - personnage.qiRequis;
    
    // Créer une copie du personnage avec les nouvelles valeurs
    const nouveauPersonnage: Personnage = {
      ...personnage,
      royaumeCultivation: prochainNiveau.royaume,
      niveauPercee: prochainNiveau.niveau,
      qiRequis: prochainNiveau.qiRequis,
      pointsQi: pointsQiExcedentaires > 0 ? pointsQiExcedentaires : 0,
      // Assurons-nous que l'âge est correctement conservé
      age: personnage.age
    };
    
    // Appliquer les bonus de secte pour la réduction du coût de percée
    if (personnage.appartenanceSecte) {
      const bonusSecte = calculerBonusSecte(personnage);
      
      // Ajouter un message pour informer le joueur des bonus appliqués
      const messageBonus = `Grâce à votre appartenance à la secte, vous bénéficiez d'une réduction de ${bonusSecte.reductionCoutPercee.toFixed(1)}% du coût de percée.`;
      setSnackbarMessage(messageBonus);
      setSnackbarOpen(true);
      
      // Réduire le Qi requis pour la prochaine percée en fonction du bonus de secte
      nouveauPersonnage.qiRequis = Math.floor(nouveauPersonnage.qiRequis * (1 - bonusSecte.reductionCoutPercee / 100));
    }
    
    // Recalculer les statistiques de combat avec le multiplicateur du nouveau royaume
    // Seulement si le royaume a changé
    if (nouveauPersonnage.royaumeCultivation !== personnage.royaumeCultivation) {
      // Calculer les nouvelles statistiques de combat
      const statsCombat = calculerStatsCombat(nouveauPersonnage.stats, nouveauPersonnage.royaumeCultivation);
      nouveauPersonnage.stats.hp = statsCombat.hp;
      nouveauPersonnage.stats.degat = statsCombat.degat;
      nouveauPersonnage.stats.esquive = statsCombat.esquive;
      nouveauPersonnage.stats.resistance = statsCombat.resistance;
      
      // Ajouter un message pour informer le joueur de l'augmentation des statistiques de combat
      const ancienMultiplicateur = MULTIPLICATEUR_COMBAT_ROYAUME[personnage.royaumeCultivation];
      const nouveauMultiplicateur = MULTIPLICATEUR_COMBAT_ROYAUME[nouveauPersonnage.royaumeCultivation];
      const messageStatsCombat = `Vos statistiques de combat ont été multipliées par ${(nouveauMultiplicateur / ancienMultiplicateur).toFixed(1)} grâce à votre progression dans le royaume ${nouveauPersonnage.royaumeCultivation}.`;
      
      // Afficher le message après un court délai pour ne pas écraser le message précédent
      setTimeout(() => {
        setSnackbarMessage(messageStatsCombat);
        setSnackbarOpen(true);
      }, 3000);
    }
    
    // Vérifier si le personnage a atteint le niveau maximum de cultivation
    if (estNiveauMaximumAtteint(nouveauPersonnage.royaumeCultivation, nouveauPersonnage.niveauPercee)) {
      // Afficher un message indiquant que le niveau maximum est atteint
      setTimeout(() => {
        setSnackbarMessage("Félicitations ! Vous avez atteint le niveau maximum de cultivation. Vous êtes maintenant au sommet du monde !");
        setSnackbarOpen(true);
      }, 6000);
    }
    
    // Mettre à jour l'état du personnage
    setPersonnage(nouveauPersonnage);
    
    // Mettre à jour l'âge affiché pour s'assurer qu'il est synchronisé
    // setAgeActuel(nouveauPersonnage.age);
    
    // Mettre à jour l'espérance de vie
    const nouvelleEsperanceVie = calculerEsperanceVie(nouveauPersonnage.race, nouveauPersonnage.royaumeCultivation);
    setEsperanceVie(nouvelleEsperanceVie);
    
    // Fermer la boîte de dialogue
    setOpenPerceeDialog(false);
  };

  // Fonction pour retourner à la création de personnage
  const retourCreation = () => {
    localStorage.removeItem('wuxiaWorldSauvegarde');
    window.location.href = "/";
  };

  // Fonction pour gérer la mort du personnage
  const handleMortPersonnage = () => {
    setOpenMortDialog(false);
    localStorage.removeItem('wuxiaWorldSauvegarde');
    window.location.href = "/";
  };

  // Fonction pour mettre à jour le personnage
  const handleUpdatePersonnage = (personnageModifie: Personnage) => {
    setPersonnage(personnageModifie);
  };

  // Changer de menu
  const handleMenuChange = (menu: MenuType) => {
    setActiveMenu(menu);
  };

  // Fonction pour sauvegarder les paramètres
  const saveSettings = useCallback((newSettings: GameSettings) => {
    setGameSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    setSnackbarMessage("Paramètres sauvegardés avec succès !");
    setSnackbarOpen(true);
    
    // Pas besoin d'émettre un événement ici car il est déjà émis dans le composant Settings
  }, []);

  // Fonction pour réinitialiser les paramètres
  const resetSettings = useCallback(() => {
    setGameSettings(defaultSettings);
    localStorage.setItem('gameSettings', JSON.stringify(defaultSettings));
    
    // Émettre un événement personnalisé pour le changement de thème
    const themeChangeEvent = new CustomEvent('themeChange', {
      detail: { darkMode: defaultSettings.darkMode }
    });
    window.dispatchEvent(themeChangeEvent);
  }, []);

  // Obtenir le titre du menu actif
  const getMenuTitle = () => {
    switch (activeMenu) {
      case MenuType.PROFILE:
        return "Profil";
      case MenuType.CULTIVATION:
        return "Cultivation";
      case MenuType.INVENTORY:
        return "Inventaire";
      case MenuType.QUESTS:
        return "Quêtes";
      case MenuType.STATS:
        return "Statistiques";
      case MenuType.SECTE:
        return "Secte";
      case MenuType.TECHNIQUES:
        return "Techniques";
      case MenuType.COMBAT:
        return "Combat";
      case MenuType.SETTINGS:
        return "Paramètres";
      default:
        return "Profil";
    }
  };

  // Fonction pour rendre le contenu en fonction du menu actif
  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>;
    }
    
    if (error || !personnage) {
      return <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Erreur lors du chargement du personnage"}</Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={retourCreation}
          sx={{ mt: 2 }}
        >
          Retour à la création de personnage
        </Button>
      </Box>;
    }
    
    switch (activeMenu) {
      case MenuType.PROFILE:
        return <ProfileMenu 
          personnage={personnage} 
          ageActuel={personnage.age}
          esperanceVie={esperanceVie}
          tempsJeuFormate={tempsJeuFormate}
          historiqueEvenements={historiqueEvenements}
        />;
      case MenuType.CULTIVATION:
        return <CultivationMenu 
          personnage={personnage} 
          meditationActive={meditationActive}
          gainQiParSeconde={gainQiParSeconde}
          tempsTotalMeditation={tempsTotalMeditation}
          tempsMeditationCumule={tempsMeditationCumule}
          toggleMeditation={toggleMeditation}
          onPercee={effectuerPercee}
          perceeDisponible={perceeDisponible}
          moisActuel={moisActuel}
          buffsCultivation={calculerBuffsCultivation(personnage)}
        />;
      case MenuType.INVENTORY:
        return <InventoryMenu personnage={personnage} />;
      case MenuType.QUESTS:
        return <QuestsMenu personnage={personnage} />;
      case MenuType.STATS:
        return <StatsMenu personnage={personnage} />;
      case MenuType.SECTE:
        return <SecteMenu personnage={personnage} onUpdatePersonnage={handleUpdatePersonnage} />;
      case MenuType.TECHNIQUES:
        return <TechniquesMenu personnage={personnage} onUpdatePersonnage={handleUpdatePersonnage} />;
      case MenuType.COMBAT:
        return <CombatMenu personnage={personnage} onUpdatePersonnage={handleUpdatePersonnage} />;
      case MenuType.SETTINGS:
        return <Settings 
          settings={gameSettings} 
          onSettingsChange={saveSettings} 
          onReset={resetSettings} 
        />;
      default:
        return <ProfileMenu 
          personnage={personnage} 
          ageActuel={personnage.age}
          esperanceVie={esperanceVie}
          tempsJeuFormate={tempsJeuFormate}
          historiqueEvenements={historiqueEvenements}
        />;
    }
  };

  // Ajouter la boîte de dialogue d'événement dans le rendu
  const renderEvenementDialog = () => {
    if (!evenementActuel) return null;
    
    // Déterminer la couleur en fonction du type d'événement
    const getEvenementColor = (type: TypeEvenement): string => {
      switch (type) {
        case TypeEvenement.POSITIF:
          return '#4caf50'; // Vert
        case TypeEvenement.NEUTRE:
          return '#2196f3'; // Bleu
        case TypeEvenement.NEGATIF:
          return '#f44336'; // Rouge
        case TypeEvenement.SPECIAL:
          return '#9c27b0'; // Violet
        default:
          return '#ffffff';
      }
    };
    
    return (
      <Dialog
        open={openEvenementDialog}
        onClose={() => appliquerEvenement()}
        aria-labelledby="evenement-dialog-title"
        aria-describedby="evenement-dialog-description"
        PaperProps={{
          style: {
            border: `2px solid ${getEvenementColor(evenementActuel.type)}`,
            background: '#1a1a1a'
          }
        }}
      >
        <DialogTitle id="evenement-dialog-title" style={{ color: getEvenementColor(evenementActuel.type) }}>
          {evenementActuel.titre}
          <Chip 
            label={evenementActuel.type} 
            size="small" 
            style={{ 
              marginLeft: '10px', 
              backgroundColor: getEvenementColor(evenementActuel.type),
              color: '#000000'
            }} 
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="evenement-dialog-description" style={{ color: '#ffffff' }}>
            {evenementActuel.description}
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="h6" style={{ color: '#ffffff' }}>Effets:</Typography>
            <Box mt={1}>
              {evenementActuel.effets.qi && (
                <Typography style={{ color: evenementActuel.effets.qi > 0 ? '#4caf50' : '#f44336' }}>
                  Qi: {evenementActuel.effets.qi > 0 ? '+' : ''}{evenementActuel.effets.qi}
                </Typography>
              )}
              {evenementActuel.effets.stats && Object.entries(evenementActuel.effets.stats).map(([stat, valeur]) => (
                <Typography key={stat} style={{ color: (valeur as number) > 0 ? '#4caf50' : '#f44336' }}>
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}: {(valeur as number) > 0 ? '+' : ''}{valeur}
                </Typography>
              ))}
              {evenementActuel.effets.age && (
                <Typography style={{ color: '#f44336' }}>
                  Âge: +{evenementActuel.effets.age} an(s)
                </Typography>
              )}
              {evenementActuel.effets.esperanceVie && (
                <Typography style={{ color: evenementActuel.effets.esperanceVie > 0 ? '#4caf50' : '#f44336' }}>
                  Espérance de vie: {evenementActuel.effets.esperanceVie > 0 ? '+' : ''}{evenementActuel.effets.esperanceVie} an(s)
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={appliquerEvenement} color="primary" variant="contained">
            Accepter
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Mettre à jour l'état perceeDisponible lorsque les points de Qi changent
  useEffect(() => {
    if (personnage) {
      setPerceeDisponible(personnage.pointsQi >= personnage.qiRequis);
    }
  }, [personnage?.pointsQi, personnage?.qiRequis]);

  // Mettre à jour le gain de Qi par seconde à chaque changement du personnage
  useEffect(() => {
    if (personnage) {
      const buffs = calculerBuffsCultivation(personnage);
      setGainQiParSeconde(buffs.total);
    }
  }, [personnage, calculerBuffsCultivation]);

  // Mettre à jour l'espérance de vie lorsque le personnage change
  useEffect(() => {
    if (personnage) {
      // Calculer l'espérance de vie de base
      const esperanceVieBase = calculerEsperanceVie(personnage.race, personnage.royaumeCultivation);
      
      // Appliquer les bonus de secte à l'espérance de vie si applicable
      let esperanceVieFinale = esperanceVieBase;
      if (personnage.appartenanceSecte) {
        const bonusSecte = calculerBonusSecte(personnage);
        esperanceVieFinale += Math.floor(esperanceVieBase * bonusSecte.bonusLongevite / 100);
      }
      
      // Mettre à jour l'état de l'espérance de vie
      setEsperanceVie(esperanceVieFinale);
    }
  }, [personnage]);

  // Nettoyer les timers lors du démontage du composant
  useEffect(() => {
    return () => {
      if (ageTimerRef.current) {
        clearInterval(ageTimerRef.current);
        ageTimerRef.current = null;
      }
      if (qiTimerRef.current) {
        clearInterval(qiTimerRef.current);
        qiTimerRef.current = null;
      }
      if (tempsJeuTimerRef.current) {
        clearInterval(tempsJeuTimerRef.current);
        tempsJeuTimerRef.current = null;
      }
      if (sauvegardeAutoTimerRef.current) {
        clearInterval(sauvegardeAutoTimerRef.current);
        sauvegardeAutoTimerRef.current = null;
      }
      if (moisTimerRef.current) {
        clearInterval(moisTimerRef.current);
        moisTimerRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Chargement de votre aventure...</Typography>
      </Box>
    );
  }

  if (error || !personnage) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 2 }}>
        <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" color="primary" onClick={retourCreation}>
          Créer un nouveau personnage
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Layout 
        activeMenu={activeMenu} 
        onMenuChange={handleMenuChange} 
        onSave={sauvegarderManuellement} 
        onReset={resetSettings}
        title={getMenuTitle()}
      >
        {renderContent()}
      </Layout>
      
      {/* Dialogue de percée */}
      <Dialog
        open={openPerceeDialog}
        onClose={() => setOpenPerceeDialog(false)}
        aria-labelledby="percee-dialog-title"
        aria-describedby="percee-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            border: `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}`,
            boxShadow: `0 0 20px ${getRoyaumeColor(personnage.royaumeCultivation)}`
          }
        }}
      >
        <DialogTitle id="percee-dialog-title" sx={{ textAlign: 'center', fontFamily: "'Cinzel', serif" }}>
          <Typography variant="h5" component="div" sx={{ color: getRoyaumeColor(personnage.royaumeCultivation) }}>
            Percée Atteinte !
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="percee-dialog-description" sx={{ mb: 2 }}>
            Vous avez accumulé suffisamment de Qi pour atteindre un nouveau niveau de cultivation.
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            border: `1px solid ${getRoyaumeColor(personnage.royaumeCultivation)}`, 
            borderRadius: 1,
            mb: 2,
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <Typography variant="body1" gutterBottom>
              Niveau actuel: <strong>{personnage.royaumeCultivation} - {getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee)}</strong>
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              Points de Qi accumulés: <strong>{personnage.pointsQi.toLocaleString()}</strong> / {personnage.qiRequis.toLocaleString()}
            </Typography>
            
            {(() => {
              const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
              const prochainNomComplet = getNomCompletCultivation(prochainNiveau.royaume, prochainNiveau.niveau);
              const nouvelleEsperanceVie = calculerEsperanceVie(personnage.race, prochainNiveau.royaume);
              const pointsQiExcedentaires = Math.max(0, personnage.pointsQi - personnage.qiRequis);
              
              return (
                <>
                  <Typography variant="body1" sx={{ color: getRoyaumeColor(prochainNiveau.royaume) }}>
                    Prochain niveau: <strong>{prochainNiveau.royaume} - {prochainNomComplet}</strong>
                  </Typography>
                  
                  {pointsQiExcedentaires > 0 && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Points de Qi excédentaires conservés: <strong>{pointsQiExcedentaires.toLocaleString()}</strong>
                    </Typography>
                  )}
                  
                  {nouvelleEsperanceVie > esperanceVie && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Espérance de vie: <strong>{esperanceVie} → {nouvelleEsperanceVie} ans</strong> 
                      <span style={{ color: '#2ecc71' }}> (+{nouvelleEsperanceVie - esperanceVie})</span>
                    </Typography>
                  )}
                </>
              );
            })()}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Effectuer une percée vous permettra d'accéder à un niveau de cultivation supérieur. Les points de Qi excédentaires au-delà du seuil requis seront conservés.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPerceeDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button 
            onClick={effectuerPercee} 
            variant="contained" 
            color="primary"
            sx={{ 
              boxShadow: `0 0 10px ${getRoyaumeColor(personnage.royaumeCultivation)}`,
            }}
          >
            Effectuer la Percée
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de mort */}
      <Dialog
        open={openMortDialog}
        aria-labelledby="mort-dialog-title"
        aria-describedby="mort-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            border: '1px solid #e74c3c',
            boxShadow: '0 0 20px #e74c3c'
          }
        }}
      >
        <DialogTitle id="mort-dialog-title" sx={{ textAlign: 'center', fontFamily: "'Cinzel', serif" }}>
          <Typography variant="h5" component="div" sx={{ color: '#e74c3c' }}>
            Votre Personnage Est Mort
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="mort-dialog-description" sx={{ mb: 2 }}>
            {personnage.nom} a atteint la fin de sa vie à l'âge de {personnage.age} ans. Son voyage sur le chemin de l'immortalité s'achève ici.
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e74c3c', 
            borderRadius: 1,
            mb: 2,
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <Typography variant="body1" gutterBottom>
              Niveau final: <strong>{personnage.royaumeCultivation} - {getNomCompletCultivation(personnage.royaumeCultivation, personnage.niveauPercee)}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Points de Qi accumulés: <strong>{personnage.pointsQiTotal.toLocaleString()}</strong>
            </Typography>
            <Typography variant="body1">
              Temps de jeu total: <strong>{tempsJeuFormate}</strong>
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Vous devez créer un nouveau personnage pour continuer votre aventure.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleMortPersonnage} 
            variant="contained" 
            color="error"
          >
            Créer un Nouveau Personnage
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {renderEvenementDialog()}
    </>
  );
};

export default GameScreen; 