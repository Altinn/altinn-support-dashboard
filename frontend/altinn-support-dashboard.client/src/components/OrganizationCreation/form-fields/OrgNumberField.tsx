import React, { useState } from 'react';
import { Textfield, Paragraph, Tooltip, Button, Search } from '@digdir/designsystemet-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useOrganizationCreation } from '../hooks/useOrganizationCreation';
import { BrregSearchResult } from '../models/organizationTypes';

interface OrgNumberFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const OrgNumberField: React.FC<OrgNumberFieldProps> = ({ 
    value, 
    onChange, 
    error 
}) => {
    const { isSearchingBrreg, searchBrreg } = useOrganizationCreation('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BrregSearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    
    const handleSearch = async () => {
        if (!searchQuery) return;
        
        const results = await searchBrreg(searchQuery);
        setSearchResults(results.results || []);
        setShowResults(true);
    };
    
    const selectOrganization = (result: BrregSearchResult) => {
        onChange(result.orgNumber);
        setShowResults(false);
    };
    
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Organisasjonsnummer
                </Paragraph>
                <Tooltip content="Organisasjonens organisasjonsnummer i Brønnøysundregistrene (9 siffer)." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Textfield
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
                    size="medium"
                    style={{ flexGrow: 1 }}
                    errorMessage={error}
                    placeholder="9 siffer"
                    maxLength={9}
                />
                
                <Button
                    variant="secondary"
                    title="Søk i Brønnøysundregistrene"
                    onClick={() => setShowResults(true)}
                >
                    <MagnifyingGlassIcon aria-hidden title="Søk" fontSize="1.5rem" />
                </Button>
            </div>
            
            {showResults && (
                <div style={{ 
                    marginTop: '16px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    padding: '16px', 
                    backgroundColor: '#f9f9f9' 
                }}>
                    <Paragraph data-size="sm" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Søk i Brønnøysundregistrene
                    </Paragraph>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <Search 
                            label="Søk etter organisasjon"
                            hideLabel
                            size="medium" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flexGrow: 1 }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        
                        <Button
                            variant="primary"
                            onClick={handleSearch}
                            disabled={isSearchingBrreg || !searchQuery}
                        >
                            {isSearchingBrreg ? 'Søker...' : 'Søk'}
                        </Button>
                    </div>
                    
                    {searchResults.length > 0 ? (
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {searchResults.map((result, index) => (
                                <div 
                                    key={result.orgNumber}
                                    style={{ 
                                        padding: '8px', 
                                        cursor: 'pointer', 
                                        borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                                        borderRadius: '4px',
                                        ':hover': { backgroundColor: '#f0f0f0' }
                                    }}
                                    onClick={() => selectOrganization(result)}
                                >
                                    <Paragraph data-size="sm" style={{ fontWeight: 'bold', margin: 0 }}>
                                        {result.name}
                                    </Paragraph>
                                    <Paragraph data-size="xs" style={{ margin: 0 }}>
                                        Org.nr: {result.orgNumber}
                                    </Paragraph>
                                </div>
                            ))}
                        </div>
                    ) : (
                        searchQuery && !isSearchingBrreg && (
                            <Paragraph data-size="sm">
                                Ingen resultater funnet. Prøv et annet søkeord.
                            </Paragraph>
                        )
                    )}
                    
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="secondary"
                            onClick={() => setShowResults(false)}
                        >
                            Lukk
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
