import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Snackbar
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
  TypeEvenement
} from '../models/types';
import Layout, { MenuType } from './Layout';
import { 
  ProfileMenu, 
  CultivationMenu, 
  InventoryMenu, 
  QuestsMenu, 
  StatsMenu 
} from './menus';

const GameScreen: React.FC = () => {
  const [personnage, setPersonnage] = useState<Personnage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meditationActive, setMeditationActive] = useState<boolean>(false);
  const [gainQiParSeconde, setGainQiParSeconde] = useState<number>(0);
  const [openPerceeDialog, setOpenPerceeDialog] = useState<boolean>(false);
  const [tempsTotalMeditation, setTempsTotalMeditation] = useState<number>(0);
  const [tempsMeditationCumule, setTempsMeditationCumule] = useState<number>(0);
  const [ageActuel, setAgeActuel] = useState<number>(0);
  const [esperanceVie, setEsperanceVie] = useState<number>(0);
  const [tempsJeuFormate, setTempsJeuFormate] = useState<string>("00:00:00");
  const [openMortDialog, setOpenMortDialog] = useState<boolean>(false);
  const [openResetDialog, setOpenResetDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<MenuType>(MenuType.PROFILE);
  
  // Nouvel état pour les événements aléatoires
  const [evenementActuel, setEvenementActuel] = useState<Evenement | null>(null);
  const [openEvenementDialog, setOpenEvenementDialog] = useState<boolean>(false);
  const [derniereAnneeEvenement, setDerniereAnneeEvenement] = useState<number>(0);
  const [historiqueEvenements, setHistoriqueEvenements] = useState<Evenement[]>([]);
  
  // Référence pour le timer d'âge
  const ageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tempsJeuTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sauvegardeAutoTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      
      // Mettre à jour le dernier temps de jeu
      personnageData.dernierTempsJeu = Date.now();
      
      setPersonnage(personnageData);
      setTempsMeditationCumule(tempsMeditationCumuleSauvegarde);
      setDerniereAnneeEvenement(derniereAnneeEvenementSauvegarde);
      setHistoriqueEvenements(historiqueEvenementsSauvegarde);
      
      // Calculer l'âge actuel en fonction du temps de méditation cumulé
      const anneesMeditation = Math.floor(tempsMeditationCumuleSauvegarde / 60);
      const ageCalcule = personnageData.age + anneesMeditation;
      setAgeActuel(ageCalcule);
      
      const esperanceVieCalculee = calculerEsperanceVie(personnageData.race, personnageData.royaumeCultivation);
      setEsperanceVie(esperanceVieCalculee);
      
      // Formater le temps de jeu total
      setTempsJeuFormate(formaterTempsJeu(personnageData.tempsJeuTotal));
      
      // Calculer le gain de Qi par seconde basé sur les statistiques
      const qiBase = personnageData.stats.qi;
      const intelligenceBonus = personnageData.stats.intelligence * 0.08;
      const perceptionBonus = personnageData.stats.perception * 0.04;
      const gainCalcule = Math.max(1, Math.floor(qiBase * (1 + (intelligenceBonus + perceptionBonus) / 25)));
      setGainQiParSeconde(gainCalcule);
      
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement du personnage. Veuillez en créer un nouveau.");
      setLoading(false);
      console.error("Erreur lors du chargement du personnage:", err);
    }
  }, []);

  // Sauvegarder le personnage dans le localStorage
  const sauvegarderPersonnage = useCallback((personnageToSave?: Personnage | null) => {
    try {
      // Utiliser le personnage passé en paramètre ou celui du state
      const personnageActuel = personnageToSave || personnage;
      
      if (!personnageActuel) return false;
      
      // Mettre à jour le dernier temps de jeu et l'âge actuel
      const personnageAJour = {
        ...personnageActuel,
        dernierTempsJeu: Date.now(),
        age: personnage ? personnage.age : ageActuel, // Conserver l'âge initial du personnage
        tempsJeuTotal: personnageActuel.tempsJeuTotal + 10 // Ajouter 10 secondes (intervalle de sauvegarde)
      };
      
      // Créer un objet de sauvegarde contenant toutes les données
      const sauvegarde = {
        personnage: personnageAJour,
        tempsMeditationCumule: tempsMeditationCumule,
        derniereAnneeEvenement: derniereAnneeEvenement,
        historiqueEvenements: historiqueEvenements
      };
      
      // Convertir en JSON puis en base64
      const sauvegardeJSON = JSON.stringify(sauvegarde);
      const sauvegardeBase64 = btoa(sauvegardeJSON);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('wuxiaWorldSauvegarde', sauvegardeBase64);
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      return false;
    }
  }, [personnage, ageActuel, tempsMeditationCumule, derniereAnneeEvenement, historiqueEvenements]);

  // Fonction pour sauvegarder manuellement
  const sauvegarderManuellement = () => {
    const resultat = sauvegarderPersonnage(personnage);
    if (resultat) {
      setSnackbarMessage("Personnage sauvegardé avec succès !");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Erreur lors de la sauvegarde !");
      setSnackbarOpen(true);
    }
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
      const nouvelleEsperanceVie = Math.max(ageActuel + 1, esperanceVie + evenementActuel.effets.esperanceVie);
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
  }, [personnage, evenementActuel, ageActuel, esperanceVie]);

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
        
        setAgeActuel(nouvelAge);
        
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

  // Effet pour la méditation
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (meditationActive && personnage) {
      intervalId = setInterval(() => {
        setPersonnage(prev => {
          if (!prev) return prev;
          
          const nouveauxPointsQi = prev.pointsQi + gainQiParSeconde;
          const nouveauxPointsQiTotal = prev.pointsQiTotal + gainQiParSeconde;
          
          // Vérifier si une percée est possible
          const perceeAtteinte = nouveauxPointsQi >= prev.qiRequis;
          
          if (perceeAtteinte) {
            setOpenPerceeDialog(true);
            setMeditationActive(false);
            // Ne pas réinitialiser le compteur de temps de méditation
            // setTempsTotalMeditation(0);
            // Jouer un son ou ajouter une animation ici si nécessaire
          }
          
          // Mettre à jour les points de Qi, même si une percée est atteinte
          // La fonction effectuerPercee s'occupera de gérer les points excédentaires
          return {
            ...prev,
            pointsQi: nouveauxPointsQi,
            pointsQiTotal: nouveauxPointsQiTotal
          };
        });
        
        // Incrémenter le temps total de méditation (pour l'affichage de la session en cours)
        setTempsTotalMeditation(prev => prev + 1);
        
        // Incrémenter le temps de méditation cumulé (pour le calcul de l'âge)
        setTempsMeditationCumule(prev => prev + 1);
      }, 1000); // Mise à jour chaque seconde
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [meditationActive, personnage, gainQiParSeconde]);

  // Effectuer une percée
  const effectuerPercee = () => {
    if (!personnage) return;
    
    const prochainNiveau = getProchainNiveau(personnage.royaumeCultivation, personnage.niveauPercee);
    
    // Calculer les points de Qi excédentaires après la percée
    const pointsQiExcedentaires = Math.max(0, personnage.pointsQi - personnage.qiRequis);
    
    const nouveauPersonnage = {
      ...personnage,
      pointsQi: pointsQiExcedentaires, // Conserver uniquement les points excédentaires
      royaumeCultivation: prochainNiveau.royaume,
      niveauPercee: prochainNiveau.niveau,
      qiRequis: prochainNiveau.qiRequis
    };
    
    // Mettre à jour l'état du personnage
    setPersonnage(nouveauPersonnage);
    
    // Recalculer l'espérance de vie après la percée
    const nouvelleEsperanceVie = calculerEsperanceVie(nouveauPersonnage.race, nouveauPersonnage.royaumeCultivation);
    setEsperanceVie(nouvelleEsperanceVie);
    
    // Afficher un message de succès avec les points excédentaires si applicable
    const messageExcedent = pointsQiExcedentaires > 0 
      ? ` ${pointsQiExcedentaires.toLocaleString()} points de Qi excédentaires conservés.` 
      : '';
    
    setSnackbarMessage(`Percée réussie ! Vous avez atteint ${getNomCompletCultivation(prochainNiveau.royaume, prochainNiveau.niveau)}.${messageExcedent}`);
    setSnackbarOpen(true);
    
    setOpenPerceeDialog(false);
    sauvegarderPersonnage(nouveauPersonnage);
  };

  // Activer/désactiver la méditation
  const toggleMeditation = () => {
    const nouvelEtat = !meditationActive;
    setMeditationActive(nouvelEtat);
    console.log(`Méditation ${nouvelEtat ? 'activée' : 'désactivée'}`);
    
    // Ne pas réinitialiser le compteur de temps si on désactive la méditation
    // Cela empêche l'exploitation qui consiste à arrêter/reprendre la méditation
    
    // Afficher un message à l'utilisateur
    setSnackbarMessage(`Méditation ${nouvelEtat ? 'activée' : 'désactivée'}`);
    setSnackbarOpen(true);
  };

  // Fonction pour réinitialiser le personnage
  const reinitialiserPersonnage = () => {
    setOpenResetDialog(true);
  };
  
  // Fonction pour confirmer la réinitialisation
  const confirmerReinitialisation = () => {
    localStorage.removeItem('wuxiaWorldSauvegarde');
    setOpenResetDialog(false);
    window.location.href = "/";
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

  // Changer de menu
  const handleMenuChange = (menu: MenuType) => {
    setActiveMenu(menu);
  };

  // Obtenir le titre du menu actif
  const getMenuTitle = () => {
    switch (activeMenu) {
      case MenuType.PROFILE:
        return personnage ? personnage.nom : 'Profil';
      case MenuType.CULTIVATION:
        return 'Cultivation';
      case MenuType.INVENTORY:
        return 'Inventaire';
      case MenuType.QUESTS:
        return 'Quêtes';
      case MenuType.STATS:
        return 'Statistiques';
      default:
        return 'Wuxia Idle';
    }
  };

  // Fonction pour rendre le contenu en fonction du menu actif
  const renderContent = () => {
    if (!personnage) return null;
    
    switch (activeMenu) {
      case MenuType.PROFILE:
        return (
          <ProfileMenu 
            personnage={personnage} 
            ageActuel={ageActuel} 
            esperanceVie={esperanceVie} 
            tempsJeuFormate={tempsJeuFormate}
            historiqueEvenements={historiqueEvenements}
          />
        );
      case MenuType.CULTIVATION:
        return (
          <CultivationMenu 
            personnage={personnage} 
            gainQiParSeconde={gainQiParSeconde}
            meditationActive={meditationActive}
            toggleMeditation={toggleMeditation}
            tempsTotalMeditation={tempsTotalMeditation}
            tempsMeditationCumule={tempsMeditationCumule}
          />
        );
      case MenuType.INVENTORY:
        return <InventoryMenu personnage={personnage} />;
      case MenuType.QUESTS:
        return <QuestsMenu personnage={personnage} />;
      case MenuType.STATS:
        return <StatsMenu personnage={personnage} />;
      default:
        return null;
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
        onReset={confirmerReinitialisation}
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
            {personnage.nom} a atteint la fin de sa vie à l'âge de {ageActuel} ans. Son voyage sur le chemin de l'immortalité s'achève ici.
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

      {/* Dialogue de confirmation de réinitialisation */}
      <Dialog
        open={openResetDialog}
        onClose={() => setOpenResetDialog(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Confirmer la réinitialisation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Êtes-vous sûr de vouloir réinitialiser votre personnage ? Cette action est irréversible et toutes vos données seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmerReinitialisation} color="error" variant="contained">
            Réinitialiser
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