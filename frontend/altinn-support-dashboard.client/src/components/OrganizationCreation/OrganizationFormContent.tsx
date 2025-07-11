import React, { useCallback } from 'react';
import { 
    Heading, 
    Paragraph,
    Divider
} from '@digdir/designsystemet-react';
import { OrganizationFormData, OrganizationFormErrors, BrregEnhetsdetaljer } from './models/organizationTypes';
import { ShortNameField } from './form-fields/ShortNameField';
import { FullNameField } from './form-fields/FullNameField';
import { WebsiteUrlField } from './form-fields/WebsiteUrlField';
import { OrgNumberField } from './form-fields/OrgNumberField';
import { DescriptionField } from './form-fields/DescriptionField';
import { EnvironmentInfoField } from './form-fields/EnvironmentInfoField';
import { useOrganizationCreation } from './hooks/useOrganizationCreation';

interface OrganizationFormContentProps {
    formData: OrganizationFormData;
    setFormData: React.Dispatch<React.SetStateAction<OrganizationFormData>>;
    errors: OrganizationFormErrors;
    environment: string;
}

export const OrganizationFormContent: React.FC<OrganizationFormContentProps> = ({
    formData,
    setFormData,
    errors,
    environment
}) => {
    // Bruk én instans av useOrganizationCreation-hooken for hele skjemaet
    const { 
        activeEnvironment,
        isCheckingName, 
        nameExists,
        hasValidPatToken,
        checkNameExists 
    } = useOrganizationCreation(environment);
    
    // Memoiser checkNameExists-funksjonen for å redusere unødvendige API-kall
    const debouncedCheckNameExists = useCallback(
        async (name: string): Promise<boolean> => {
            // Kjør bare API-kall hvis navnet er langt nok
            if (name && name.length >= 2) {
                return await checkNameExists(name);
            }
            return false;
        },
        [checkNameExists]
    );
    
    const handleInputChange = (field: keyof OrganizationFormData, value: string | string[] | File | null) => {
        setFormData((prev: OrganizationFormData) => ({ ...prev, [field]: value }));
    };
    
    // Reset organisasjonsdata når brukeren trykker på fjern-knappen
    const handleResetOrgData = () => {
        setFormData((prev: OrganizationFormData) => ({
            ...prev,
            fullName: '',
            websiteUrl: '',
            description: '',
            orgNumber: ''
        }));
    };

    return (
        <div>
            <Heading level={3} data-size="xs" style={{ marginBottom: '16px' }}>
                Slå opp organisasjon
            </Heading>
            
            <Paragraph data-size="sm" style={{ marginBottom: '24px' }}>
                Fyll inn organisasjonsnummer for å automatisk hente informasjon fra Brønnøysundregistrene.
                Dette vil forenkle utfyllingen av skjemaet ved å automatisk fylle ut organisasjonens navn, 
                nettside og beskrivelse hvis tilgjengelig.
            </Paragraph>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <OrgNumberField 
                    value={formData.orgNumber}
                    onChange={(value: string) => handleInputChange('orgNumber', value)}
                    error={errors.orgNumber}
                    onReset={handleResetOrgData}
                    onFetchOrgDetails={useCallback((orgDetails: BrregEnhetsdetaljer) => {
                        const updates: Partial<OrganizationFormData> = {};
                        
                        // Hjelpefunksjon for å konvertere tekst til 'Proper Case' (første bokstav stor, resten små)
                        const toProperCase = (text: string): string => {
                            if (!text) return '';
                            const words = text.toLowerCase().split(' ');
                            const properWords = words.map(word => 
                                word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ''
                            );
                            return properWords.join(' ');
                        };
                        
                        // Auto-fill navn (fullName) - konverter til Proper Case for å unngå STORE BOKSTAVER
                        if (orgDetails.navn && orgDetails.navn !== 'null') {
                            updates.fullName = toProperCase(orgDetails.navn);
                            console.log('Converted name from:', orgDetails.navn, 'to:', updates.fullName);
                        }
                        
                        // Auto-fill hjemmeside (websiteUrl)
                        // Ensure it has the correct protocol prefix
                        if (orgDetails.hjemmeside && orgDetails.hjemmeside !== 'null') {
                            let website = orgDetails.hjemmeside;
                            if (!website.startsWith('http://') && !website.startsWith('https://')) {
                                website = 'https://' + website;
                            }
                            updates.websiteUrl = website;
                        }
                        
                        // Auto-fill description with aktivitet from Brreg
                        let description = '';
                        
                        // Legg til aktivitetsbeskrivelse hvis tilgjengelig
                        if (orgDetails.aktivitet && orgDetails.aktivitet.length > 0) {
                            description = orgDetails.aktivitet.join(' ').trim();
                        }
                        
                        updates.description = description;
                        
                        // Update form data with all collected fields
                        setFormData((prev: OrganizationFormData) => ({ ...prev, ...updates }));
                        
                        console.log('Auto-filled form data from Brreg API:', updates);
                    }, [setFormData])}
                />
            </div>
            
            <Divider />
            
            <Heading level={3} data-size="xs" style={{ marginTop: '32px', marginBottom: '16px' }}>
                Informasjon om organisasjonen
            </Heading>
            
            <Paragraph data-size="sm" style={{ marginBottom: '24px' }}>
                Fyll ut informasjonen nedenfor for å opprette en ny organisasjon i Altinn Studio.
                Felt merket med * er obligatoriske.
            </Paragraph>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ShortNameField 
                    value={formData.shortName}
                    onChange={(value: string) => handleInputChange('shortName', value)}
                    error={errors.shortName}
                    isCheckingName={isCheckingName}
                    nameExists={nameExists}
                    checkNameExists={debouncedCheckNameExists}
                />
                
                <FullNameField 
                    value={formData.fullName}
                    onChange={(value: string) => handleInputChange('fullName', value)}
                    error={errors.fullName}
                />
                
                <DescriptionField 
                    value={formData.description}
                    onChange={(value: string) => handleInputChange('description', value)}
                    error={errors.description}
                />
                
                <WebsiteUrlField 
                    value={formData.websiteUrl}
                    onChange={(value: string) => handleInputChange('websiteUrl', value)}
                    error={errors.websiteUrl}
                />
                
                <EnvironmentInfoField 
                    activeEnvironment={activeEnvironment}
                    hasValidPatToken={hasValidPatToken()}
                />
            </div>
        </div>
    );
};
