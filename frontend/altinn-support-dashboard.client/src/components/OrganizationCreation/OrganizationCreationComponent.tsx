import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Heading, 
    Button, 
    Alert
} from '@digdir/designsystemet-react';
import { OrganizationFormData, OrganizationFormErrors } from './models/organizationTypes';
import { useOrganizationCreation } from './hooks/useOrganizationCreation';
import { validateForm, hasErrors, requiredFieldsPresent } from './utils/validationUtils';
import { OrganizationFormContent } from './OrganizationFormContent';

interface OrganizationCreationProps {
    environment: string;
}

const OrganizationCreationComponent: React.FC<OrganizationCreationProps> = ({ environment }) => {
    const navigate = useNavigate();
    
    // Hent miljø fra session storage hvis det er lagret fra PAT-validering
    // Dette sikrer at vi bruker samme miljø som ble brukt til å validere PAT-token
    const [activeEnvironment, setActiveEnvironment] = useState<string>(environment);
    
    useEffect(() => {
        const storedEnvironment = sessionStorage.getItem('selected_gitea_environment');
        if (storedEnvironment) {
            setActiveEnvironment(storedEnvironment);
        }
    }, []);
    
    const { 
        isCreating, 
        createOrganization, 
        hasValidPatToken 
    } = useOrganizationCreation(activeEnvironment);
    
    const [formData, setFormData] = useState<OrganizationFormData>({
        shortName: '',
        fullName: '',
        websiteUrl: '',
        owners: [],
        emailDomain: '',
        orgNumber: '',
        logoFile: null
    });

    const [errors, setErrors] = useState<OrganizationFormErrors>({});
    // Submit state for tracking form submission attempts
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);
    const [creationMessage, setCreationMessage] = useState<string>('');

    // Sjekk om PAT-token er gyldig ved lasting
    const hasValidToken = hasValidPatToken();
    
    // Kjør validering når skjemadata endres
    useEffect(() => {
        // Kun valider fullt skjema hvis brukeren har forsøkt å sende inn skjemaet
        const validationErrors = validateForm(formData, formSubmitted);
        setErrors(validationErrors);
    }, [formData, formSubmitted]);

    // Debug funksjon som kan kalles fra konsollen for å feilsøke skjemadata og validering
    React.useEffect(() => {
        // Bruk window som var for å unngå TypeScript-feil med global window
        const win = window as unknown as Record<string, unknown>;
        
        // Legg til debuggingsfunksjon på window-objektet
        win.debugFormState = () => {
            console.group('Organisasjon Form Debug');
            console.log('FormData:', formData);
            console.log('Errors:', errors);
            const validationErrors = validateForm(formData, true);
            console.log('Current validation errors:', validationErrors);
            console.log('Is form submitted:', formSubmitted);
            console.log('Has errors:', hasErrors(validationErrors));
            console.log('Required fields present:', requiredFieldsPresent(formData));
            console.log('Can submit:', !hasErrors(validationErrors) && requiredFieldsPresent(formData));
            console.log('Is creating:', isCreating);
            console.groupEnd();
        };

        // Kjør debuggingsfunksjon ved mounting for å se status
        const debugFn = win.debugFormState as () => void;
        debugFn();
        
        // Logg når component mountes - hjelper med debugging
        console.log('OrganizationCreationComponent mounted/updated');
    }, [formData, errors, formSubmitted, isCreating]);
    
    // Håndter form-innsending
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Form submit attempt');
        // Bruk type-safe metode for å hente debuggingsfunksjon
        const win = window as unknown as Record<string, unknown>;
        const debugFn = win.debugFormState as (() => void) | undefined;
        if (debugFn) debugFn();
        
        // Valider skjemaet
        const validationErrors = validateForm(formData, true);
        setErrors(validationErrors);
        setFormSubmitted(true);
        
        if (hasErrors(validationErrors) || !requiredFieldsPresent(formData)) {
            console.warn('Form submission blocked:', { 
                hasErrors: hasErrors(validationErrors),
                requiredFieldsPresent: requiredFieldsPresent(formData),
                validationErrors
            });
            return;
        }
        
        console.log('Attempting to create organization with:', formData);
        
        // Kall på createOrganization fra useOrganizationCreation hook
        // Denne håndterer isCreating state internt
        try {
            const result = await createOrganization(formData);
            console.log('Organization creation result:', result);
            setCreationSuccess(result.success);
            setCreationMessage(result.message);
            
            // Scroll til toppen ved resultat
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Failed to create organization:', error);
            setCreationSuccess(false);
            setCreationMessage('En feil oppstod under opprettelsen av organisasjonen');
        }
        
        // Scroll til toppen ved resultat
        window.scrollTo(0, 0);
    };

    // Naviger til innstillinger hvis PAT-token mangler
    const goToSettings = () => {
        navigate('/settings');
    };

    return (
        <div style={{ 
            padding: '24px', 
            maxHeight: 'calc(100vh - 80px)', 
            overflowY: 'auto', 
            overflowX: 'hidden'
        }}>
            <Heading level={2} data-size="md">Ny organisasjon</Heading>
            
            {creationSuccess === true && (
                <Alert data-color="success" style={{ marginTop: '16px', marginBottom: '16px' }}>
                    {creationMessage || 'Organisasjonen ble opprettet!'}
                </Alert>
            )}
            
            {creationSuccess === false && (
                <Alert data-color="danger" style={{ marginTop: '16px', marginBottom: '16px' }}>
                    {creationMessage || 'Det oppstod en feil under opprettelse av organisasjonen.'}
                </Alert>
            )}
            
            {!hasValidToken && (
                <div style={{ padding: '24px', marginTop: '24px', marginBottom: '24px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Alert data-color="danger" style={{ marginBottom: '16px' }}>
                        Du må ha en gyldig PAT-token for å kunne opprette organisasjoner.
                    </Alert>
                    <Button
                        onClick={goToSettings}
                        style={{ marginTop: '16px' }}
                    >
                        Gå til innstillinger
                    </Button>
                </div>
            )}
            
            {hasValidToken && (
                <div style={{ padding: '24px', marginTop: '24px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <form onSubmit={handleSubmit}>
                        <OrganizationFormContent 
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            environment={environment}
                        />
                        
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                disabled={isCreating}
                                style={{ minWidth: '120px' }}
                            >
                                {isCreating ? 'Oppretter...' : 'Opprett organisasjon'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrganizationCreationComponent;
