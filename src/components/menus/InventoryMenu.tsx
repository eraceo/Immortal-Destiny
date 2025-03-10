import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import { Personnage } from '../../models/types';

interface InventoryMenuProps {
  personnage: Personnage;
}

const InventoryMenu: React.FC<InventoryMenuProps> = ({ personnage }) => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Inventaire
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Objets
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Votre inventaire contient les objets que vous avez collectés au cours de votre aventure.
        </Typography>
        
        <Grid container spacing={2}>
          {/* Placeholder pour les objets futurs */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body1" align="center" color="text.secondary">
                  Votre inventaire est vide pour le moment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Équipement
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Les objets équipés améliorent vos statistiques et vous confèrent des capacités spéciales.
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Arme
                </Typography>
                <Typography variant="body1" align="center">
                  -
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Armure
                </Typography>
                <Typography variant="body1" align="center">
                  -
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accessoire
                </Typography>
                <Typography variant="body1" align="center">
                  -
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ 
          p: 2, 
          mt: 3,
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: 1,
          border: '1px solid #a8dadc'
        }}>
          <Typography variant="body2" gutterBottom>
            <strong>À venir:</strong> Explorez le monde pour trouver des objets rares et des équipements qui vous aideront dans votre quête d'immortalité.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryMenu; 