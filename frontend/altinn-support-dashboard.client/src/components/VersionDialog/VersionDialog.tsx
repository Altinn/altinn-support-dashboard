import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import type { VersionInfo } from '../../hooks/useVersionCheck';

interface VersionDialogProps {
  versionInfo: VersionInfo | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Komponent for å vise dialogboks med versjonsinformasjon
 * Brukes når en ny versjon av applikasjonen er tilgjengelig
 */
export const VersionDialog: React.FC<VersionDialogProps> = ({ 
  versionInfo, 
  open, 
  onClose 
}) => {
  if (!versionInfo || !open) return null;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nb-NO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="version-dialog-title"
    >
      <DialogTitle id="version-dialog-title">
        <Typography variant="h5" component="div">
          Ny versjon: {versionInfo.version} 🎉🥳
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Versjon {versionInfo.version} ble lansert {formatDate(versionInfo.releaseDate)}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>

        
        {/* Viser kun den første (nyeste) endringen i listen */}
        {versionInfo.changes.length > 0 && (
          <Box >
            <Typography variant="h6">
              {versionInfo.changes[0].title}
            </Typography>
            
            <Typography variant="body2" paragraph>
              {versionInfo.changes[0].description}
            </Typography>
            
            {versionInfo.changes[0].details.length > 0 && (
              <List dense>
                {versionInfo.changes[0].details.map((detail, detailIndex) => (
                  <ListItem key={detailIndex}>
                    <ListItemText primary={detail} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose} autoFocus>
          Ikke vis igjen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
