import React from 'react';

export interface SettingsContentProps {
    environment: string;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}
