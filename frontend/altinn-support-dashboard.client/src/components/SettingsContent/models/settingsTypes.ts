import React from 'react';

export interface SettingsContentProps {
    environment: string;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PatTokenValidationResponse {
    isValid: boolean;
    message: string;
}

export interface PatTokenState {
    token: string;
    isValid: boolean;
    username?: string;
    isValidating: boolean;
    errorMessage?: string;
}
