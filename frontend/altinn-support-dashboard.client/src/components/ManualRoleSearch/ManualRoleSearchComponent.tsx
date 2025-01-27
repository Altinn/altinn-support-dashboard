// src/components/ManualRoleSearch/ManualRoleSearchComponent.tsx

import React, { useState } from 'react';
import {
    TextField,
    Button,
    Alert,
    Typography,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    IconButton,
    Box,
    InputAdornment,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface Role {
    RoleId?: number;
    RoleType: string;
    RoleDefinitionId: number;
    RoleName: string;
    RoleDescription: string;
    RoleDefinitionCode: string;
    _links?: any;
}

interface ManualRoleSearchComponentProps {
    baseUrl: string;
    authorizedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const ManualRoleSearchComponent: React.FC<ManualRoleSearchComponentProps> = ({
    baseUrl,
    authorizedFetch,
}) => {
    const [rollehaver, setRollehaver] = useState('');
    const [rollegiver, setRollegiver] = useState('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        setError(null);
        setIsLoading(true);
        setHasSearched(true);
        setRoles([]);

        try {
            const res = await authorizedFetch(
                `${baseUrl}/serviceowner/${rollehaver}/roles/${rollegiver}`
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Ukjent feil oppstod.');
            }

            const data = await res.json();
            let rolesArray: Role[] = [];

            if (Array.isArray(data)) {
                rolesArray = data;
            } else if (data && data._embedded) {
                const embeddedKeys = Object.keys(data._embedded);
                if (embeddedKeys.length > 0) {
                    const firstKey = embeddedKeys[0];
                    rolesArray = data._embedded[firstKey];
                }
            }

            if (rolesArray.length > 0) {
                setRoles(rolesArray);
            } else {
                setRoles([]);
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'Noe gikk galt ved henting av roller.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Manuelt Rollesøk
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                    label="Rollehaver"
                    variant="outlined"
                    value={rollehaver}
                    onChange={(e) => setRollehaver(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Fødselsnummer til personen som har rollen">
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                />
                <TextField
                    label="Rollegiver"
                    variant="outlined"
                    value={rollegiver}
                    onChange={(e) => setRollegiver(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Organisasjonsnummer til enheten som gir rollen">
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={isLoading || !rollehaver || !rollegiver}
                >
                    Søk
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isLoading && (
                <Typography variant="body1">Laster roller...</Typography>
            )}

            {!isLoading && hasSearched && roles.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Ingen roller funnet.
                </Alert>
            )}

            {roles.length > 0 && (
                <TableContainer
                    component={Paper}
                    sx={{
                        maxHeight: '80vh', // Adjust the height as needed
                        overflowY: 'auto',
                    }}
                >
                    <MuiTable stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1">Rolletype</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Rollenavn</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Beskrivelse</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Rolledefinisjonskode</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roles.map((role, index) => (
                                <TableRow key={index}>
                                    <TableCell>{role.RoleType}</TableCell>
                                    <TableCell>{role.RoleName}</TableCell>
                                    <TableCell>{role.RoleDescription}</TableCell>
                                    <TableCell>{role.RoleDefinitionCode}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </MuiTable>
                </TableContainer>
            )}
        </Box>
    );
};

export default ManualRoleSearchComponent;
