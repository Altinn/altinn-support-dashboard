import React, { useState } from 'react';
import {
    Typography,
    Container,
    Paper,
    Box,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Select
} from '@mui/material';
import '@digdir/designsystemet-css/index.css';
import '@digdir/designsystemet-theme';
import { Button, Alert, Heading, Paragraph, Textfield } from '@digdir/designsystemet-react'

type GiteaEnvironment = 'development' | 'staging' | 'production' | 'local';

interface GiteaComponentProps {}

const getGiteaBaseUrl = (env: GiteaEnvironment): string => {
    switch (env) {
        case 'development':
            return 'https://dev.altinn.studio/repos';
        case 'staging':
            return 'https://staging.altinn.studio/repos';
        case 'production':
            return 'https://altinn.studio/repos';
        case 'local':
            return 'http://studio.localhost/repos';
        default:
            return 'https://dev.altinn.studio/repos';
    }
};

const GiteaComponent: React.FC<GiteaComponentProps> = () => {
    const [shortName, setShortName] = useState('');
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [patToken, setPatToken] = useState('');
    const [environment, setEnvironment] = useState<GiteaEnvironment>('development');
    const [giteaBaseUrl, setGiteaBaseUrl] = useState(getGiteaBaseUrl('development'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const handleEnvironmentChange = (env: GiteaEnvironment) => {
        setEnvironment(env);
        setGiteaBaseUrl(getGiteaBaseUrl(env));
    };

    const handleCreateOrganization = async () => {
        if (!shortName || !fullName || !patToken) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Use the backend API endpoint with the configured base URL
            const response = await fetch('https://localhost:7174/api/gitea/create/orgwithteams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patToken,
                    giteaBaseUrl,
                    shortName,
                    fullname: fullName,
                    website: website || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to create organization');
            } else {
                setSuccess(`Successfully created organization ${shortName} with default teams and repository`);
                // Reset form fields after successful creation
                setShortName('');
                setFullName('');
                setWebsite('');
            }
        } catch (err) {
            setError('An error occurred while communicating with the server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gitea Organization Management
                </Typography>
                <Typography variant="body1" paragraph>
                    Create a new organization in Gitea with default teams and repository.
                </Typography>

                {error && (
                    <Alert data-color="danger" style={{ marginBottom: '1.5rem' }}>
                        <Heading
                            data-size="xs"
                            level={3}
                            style={{ marginBottom: 'var(--ds-size-2)' }}
                        >
                            Det har skjedd en feil
                        </Heading>
                        <Paragraph>
                            {error}
                        </Paragraph>
                    </Alert>
                )}

                {success && (
                    <Alert data-color="success" style={{ marginBottom: '1.5rem' }}>
                        <Heading
                            data-size="xs"
                            level={3}
                            style={{ marginBottom: 'var(--ds-size-2)' }}
                        >
                            Organisasjon opprettet
                        </Heading>
                        <Paragraph>
                            {success}
                        </Paragraph>
                    </Alert>
                )}

                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Textfield
                                required
                                label="Organization Short Name"
                                description="Short name of the organization"
                                type="text"
                                value={shortName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShortName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Textfield
                                required
                                label="Organization Full Name"
                                description="Full name of the organization"
                                type="text"
                                value={fullName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textfield
                                label="Website"
                                description="Website of the organization"
                                type="url"
                                value={website}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textfield
                                required
                                label="Personal Access Token (PAT)"
                                description="Personal Access Token (PAT) for the Gitea"
                                value={patToken}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatToken(e.target.value)}
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="environment-select-label">Environment</InputLabel>
                                <Select
                                    labelId="environment-select-label"
                                    value={environment}
                                    label="Environment"
                                    onChange={(e) => handleEnvironmentChange(e.target.value as GiteaEnvironment)}
                                >
                                    <MenuItem value="development">Development</MenuItem>
                                    <MenuItem value="staging">Staging</MenuItem>
                                    <MenuItem value="production">Production</MenuItem>
                                    <MenuItem value="local">Local</MenuItem>
                                </Select>
                                <FormHelperText>Select the Gitea environment to use</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Textfield
                                label="Gitea Base URL"
                                description="Base URL of the Gitea instance"
                                value={giteaBaseUrl}
                                onChange={(e) => setGiteaBaseUrl(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="primary"
                                onClick={handleCreateOrganization}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Create Organization'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default GiteaComponent;
