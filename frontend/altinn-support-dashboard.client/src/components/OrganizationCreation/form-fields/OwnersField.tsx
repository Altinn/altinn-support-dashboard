import React, { useState } from 'react';
import { Textfield, Paragraph, Tooltip, Button } from '@digdir/designsystemet-react';
import { PlusIcon } from '@navikt/aksel-icons';

interface OwnersFieldProps {
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
}

export const OwnersField: React.FC<OwnersFieldProps> = ({
    value,
    onChange,
    error
}) => {
    const [inputValue, setInputValue] = useState('');
    
    const addOwner = () => {
        if (inputValue && !value.includes(inputValue)) {
            onChange([...value, inputValue]);
            setInputValue('');
        }
    };
    
    const removeOwner = (ownerToRemove: string) => {
        onChange(value.filter(owner => owner !== ownerToRemove));
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addOwner();
        }
    };
    
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Eiere (Gitea-brukernavn)
                </Paragraph>
                <Tooltip content="Legg til Gitea-brukernavn for personer som skal ha administratortilgang til organisasjonen." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
                <Textfield
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    size="medium"
                    style={{ flexGrow: 1 }}
                    placeholder="Gitea-brukernavn"
                    onKeyDown={handleKeyPress}
                    errorMessage={error}
                />
                
                <Button
                    variant="secondary"
                    onClick={addOwner}
                    disabled={!inputValue || value.includes(inputValue)}
                >
                    <PlusIcon aria-hidden title="Legg til" fontSize="1.5rem" />
                </Button>
            </div>
            
            {value.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {value.map(owner => (
                        <div 
                            key={owner}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#e6f0ff',
                                border: '1px solid #b3d1ff'
                            }}
                        >
                            <span>{owner}</span>
                            <button 
                                onClick={() => removeOwner(owner)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    padding: '0',
                                    fontSize: '14px',
                                    color: '#0062ba'
                                }}
                                aria-label={`Fjern ${owner}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
