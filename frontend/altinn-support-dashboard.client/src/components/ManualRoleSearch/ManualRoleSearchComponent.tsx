import React, { useState } from 'react';
import { UseManualRoleSearch } from '../../hooks/hooks';
import { Role } from '../../models/models'
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

interface ManualRoleSearchComponentProps {
    baseUrl: string;
}

const ManualRoleSearchComponent: React.FC<ManualRoleSearchComponentProps> = ({
    baseUrl,
}) => {
    const [rollehaver, setRollehaver] = useState('');
    const [rollegiver, setRollegiver] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const { fetchRoles, roles, isLoading, error } = UseManualRoleSearch(baseUrl);

    const handleSearch = async () => {
        setHasSearched(true);
        await fetchRoles(rollehaver, rollegiver);
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

            {roles.length > 0 &&
                <RoleTable roles={roles} />
            }
        </Box>
    );
};

export default ManualRoleSearchComponent;

interface RoleTableProps {
    roles: Role[]
}

const RoleTable: React.FC<RoleTableProps> = ({ roles })  => {
    return (
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
    )
}