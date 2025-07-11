import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Heading, 
    Button, 
    Alert,
    ErrorSummary,
    Paragraph
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
        description: '',
        orgNumber: '',
        emailDomain: ''
    });

    const [errors, setErrors] = useState<OrganizationFormErrors>({});
    // Submit state for tracking form submission attempts
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);
    const [creationMessage, setCreationMessage] = useState<string>('');
    const [validationFailed, setValidationFailed] = useState<boolean>(false);

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
            
            // Setter valideringsfeil-tilstand
            setValidationFailed(true);
            
            // ErrorSummary viser valideringsfeilene basert på errors-objektet
            
            // Scroll til bunnen av skjemaet hvor feilmeldingene vises
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
            
            return;
        }
        
        // Reset validation error state when validation passes
        setValidationFailed(false);
        
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
    
    // Reset form for å opprette en ny organisasjon
    const resetForm = () => {
        setFormData({
            shortName: '',
            fullName: '',
            websiteUrl: '',
            owners: [],
            description: '',
            orgNumber: '',
            emailDomain: ''
        });
        setCreationSuccess(null);
        setCreationMessage('');
        setFormSubmitted(false);
        setErrors({});
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
                        
                        <Heading level={2} data-size="xs" style={{ marginBottom: 'var(--ds-size-2)' }}>
                        Du må ha en gyldig PAT-token for å kunne opprette organisasjoner.
                                            </Heading>
                                            <Paragraph>
                                                For å kunne opprette organisasjoner i Altinn Studio må du sette opp et gyldig PAT-token og velge miljø.
                                            </Paragraph>
                    </Alert>
                    
                    <Button
                        onClick={goToSettings}
                        style={{ marginTop: '16px' }}
                    >
                        Gå til innstillinger
                    </Button>
                </div>
            )}
            
            {hasValidToken && creationSuccess === true && (
                <div style={{ padding: '24px', marginTop: '24px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Heading level={3} data-size="sm">Organisasjon opprettet</Heading>
                        <p style={{ margin: '16px 0' }}>
                            Organisasjonen er nå opprettet i Altinn Studio, og standard teams er konfigurert.
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={resetForm}
                            style={{ minWidth: '180px' }}
                        >
                            Opprett ny organisasjon
                        </Button>
                    </div>
                </div>
            )}
            
            {hasValidToken && creationSuccess !== true && (
                <div style={{ padding: '24px', marginTop: '24px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <form onSubmit={handleSubmit}>
                        <OrganizationFormContent 
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            environment={environment}
                        />
                                                {validationFailed && (
                            <div style={{ marginTop: '24px' }}>
                                <ErrorSummary>
                                    <ErrorSummary.Heading>
                                        For å opprette organisasjon må du fylle inn:
                                    </ErrorSummary.Heading>
                                    <ErrorSummary.List>
                                        {errors.shortName && (
                                            <ErrorSummary.Item>
                                                <ErrorSummary.Link href="#shortName">
                                                    Kortnavn: {errors.shortName}
                                                </ErrorSummary.Link>
                                            </ErrorSummary.Item>
                                        )}
                                        {errors.fullName && (
                                            <ErrorSummary.Item>
                                                <ErrorSummary.Link href="#fullName">
                                                    Fullt navn: {errors.fullName}
                                                </ErrorSummary.Link>
                                            </ErrorSummary.Item>
                                        )}
                                        {errors.websiteUrl && (
                                            <ErrorSummary.Item>
                                                <ErrorSummary.Link href="#websiteUrl">
                                                    Nettside: {errors.websiteUrl}
                                                </ErrorSummary.Link>
                                            </ErrorSummary.Item>
                                        )}
                                        {errors.description && (
                                            <ErrorSummary.Item>
                                                <ErrorSummary.Link href="#description">
                                                    Beskrivelse: {errors.description}
                                                </ErrorSummary.Link>
                                            </ErrorSummary.Item>
                                        )}
                                        {errors.orgNumber && (
                                            <ErrorSummary.Item>
                                                <ErrorSummary.Link href="#orgNumber">
                                                    Organisasjonsnummer: {errors.orgNumber}
                                                </ErrorSummary.Link>
                                            </ErrorSummary.Item>
                                        )}
                                    </ErrorSummary.List>
                                </ErrorSummary>
                            </div>
                        )}
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
