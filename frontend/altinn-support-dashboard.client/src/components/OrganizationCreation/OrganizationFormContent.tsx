import React, { useCallback } from 'react';
import { 
    Heading, 
    Paragraph
} from '@digdir/designsystemet-react';
import { OrganizationFormData, OrganizationFormErrors } from './models/organizationTypes';
import { ShortNameField } from './form-fields/ShortNameField';
import { FullNameField } from './form-fields/FullNameField';
import { WebsiteUrlField } from './form-fields/WebsiteUrlField';
import { EmailDomainField } from './form-fields/EmailDomainField';
import { OrgNumberField } from './form-fields/OrgNumberField';
import { LogoUploadField } from './form-fields/LogoUploadField';
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
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <Heading level={3} data-size="xs" style={{ marginBottom: '16px' }}>
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
                
                <WebsiteUrlField 
                    value={formData.websiteUrl}
                    onChange={(value: string) => handleInputChange('websiteUrl', value)}
                    error={errors.websiteUrl}
                />
                
                <EnvironmentInfoField 
                    activeEnvironment={activeEnvironment}
                    hasValidPatToken={hasValidPatToken()}
                />
                
                <EmailDomainField 
                    value={formData.emailDomain}
                    onChange={(value: string) => handleInputChange('emailDomain', value)}
                    error={errors.emailDomain}
                />
                
                <OrgNumberField 
                    value={formData.orgNumber}
                    onChange={(value: string) => handleInputChange('orgNumber', value)}
                    error={errors.orgNumber}
                />
                
                <LogoUploadField 
                    value={formData.logoFile}
                    onChange={(value: File | null) => handleInputChange('logoFile', value)}
                    error={errors.logoFile}
                />
            </div>
        </div>
    );
};
