import React from 'react';
import { 
  Dialog
} from '@digdir/designsystemet-react';
import type { VersionInfo } from '../../hooks/useVersionCheck';
import VersionDialogTitle  from './VersionDialogTitle';
import VersionDialogContent from './VersionDialogContent';
import VersionDialogButton from './VersionDialogButton';


interface VersionDialogBoxProps {
    versionInfo: VersionInfo | null;
    open: boolean;
    onClose: () => void;
}


const VersionDialogBox: React.FC<VersionDialogBoxProps> =({
    versionInfo,
    open,
    onClose
}) => {
    if (!versionInfo || !open) return null;
    return (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="version-dialog-title"
      >
        <VersionDialogTitle versionInfo={versionInfo} />
      <VersionDialogContent versionInfo={versionInfo} />
      <VersionDialogButton onClose={onClose} />
    </Dialog>
  );
}

export default VersionDialogBox;