import React from 'react';
import type { VersionInfo } from '../../hooks/useVersionCheck';
import VersionDialogBox from './VersionDialogBox';

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
  
  return (
    <VersionDialogBox
      versionInfo={versionInfo}
      open={open}
      onClose={onClose}/>
  );
};
