import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Personnage } from '../../models/types';

interface QuestsMenuProps {
  personnage: Personnage;
}

const QuestsMenu: React.FC<QuestsMenuProps> = ({ personnage }) => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Quêtes
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quêtes Actives
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Les quêtes vous permettent de gagner des récompenses et de progresser dans votre aventure.
        </Typography>
        
        <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)', mb: 3 }}>
          <CardContent>
            <Typography variant="body1" align="center" color="text.secondary">
              Aucune quête active pour le moment.
            </Typography>
          </CardContent>
        </Card>
        
        <Typography variant="h6" gutterBottom>
          Quêtes à Venir
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          <ListItem sx={{ 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            mb: 1, 
            borderRadius: 1,
            opacity: 0.7
          }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Le Chemin du Cultivateur" 
              secondary="Atteignez le royaume de Fondation pour débloquer cette quête."
            />
          </ListItem>
          
          <ListItem sx={{ 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            mb: 1, 
            borderRadius: 1,
            opacity: 0.7
          }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Secrets des Anciens" 
              secondary="Explorez le monde pour découvrir des connaissances perdues."
            />
          </ListItem>
          
          <ListItem sx={{ 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            borderRadius: 1,
            opacity: 0.7
          }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText 
              primary="La Voie du Combat" 
              secondary="Prouvez votre valeur dans l'arène des cultivateurs."
            />
          </ListItem>
        </List>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Progression
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Votre progression dans le monde de la cultivation débloquera de nouvelles quêtes et opportunités.
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: 1,
          border: '1px solid #a8dadc'
        }}>
          <Typography variant="body2" gutterBottom>
            <strong>À venir:</strong> Continuez à méditer et à progresser dans votre cultivation pour débloquer de nouvelles quêtes et aventures.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuestsMenu; 