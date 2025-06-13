import React, { useState, useRef } from 'react';
import { Button, Paragraph, Tooltip, Alert } from '@digdir/designsystemet-react';
import { UploadIcon, TrashIcon } from '@navikt/aksel-icons';

interface LogoUploadFieldProps {
    value: File | null | undefined;
    onChange: (file: File | null) => void;
    error?: string;
}

export const LogoUploadField: React.FC<LogoUploadFieldProps> = ({
    value,
    onChange,
    error
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                onChange(null);
                return;
            }
            
            // Check file size (1MB max)
            if (file.size > 1024 * 1024) {
                onChange(null);
                return;
            }
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
        
        onChange(file);
    };
    
    const clearFile = () => {
        onChange(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Logo
                </Paragraph>
                <Tooltip content="Last opp en logo for organisasjonen (valgfritt). Støttede formater: JPG, PNG, SVG. Maks 1MB." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            {error && (
                <Alert data-color="danger" style={{ marginBottom: '16px' }}>
                    {error}
                </Alert>
            )}
            
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/svg+xml"
                    style={{ display: 'none' }}
                />
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Button
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <UploadIcon aria-hidden title="Last opp" />
                        Last opp logo
                    </Button>
                    
                    {value && (
                        <Button
                            variant="tertiary"
                            onClick={clearFile}
                            color="danger"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <TrashIcon aria-hidden title="Fjern" />
                            Fjern
                        </Button>
                    )}
                </div>
                
                {preview && (
                    <div style={{ 
                        marginTop: '16px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <img 
                            src={preview} 
                            alt="Forhåndsvisning av logo" 
                            style={{ 
                                maxHeight: '100px', 
                                maxWidth: '100%', 
                                objectFit: 'contain' 
                            }} 
                        />
                    </div>
                )}
                
                {!error && (
                    <Paragraph data-size="xs" style={{ marginTop: '8px', color: '#666' }}>
                        Støttede formater: JPG, PNG, SVG. Maks størrelse: 1MB.
                    </Paragraph>
                )}
            </div>
        </div>
    );
};
