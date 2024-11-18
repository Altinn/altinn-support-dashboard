// src/components/MainContent/MainContentComponent.tsx

import React, { useState, useMemo } from 'react';
import { Organization, Subunit, PersonalContact, ERRole } from '../../models/models';
import {
    Skeleton,
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
    TextField,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface MainContentProps {
    baseUrl: string;
    isLoading: boolean;
    organizations: Organization[];
    subUnits: Subunit[];
    selectedOrg: { Name: string; OrganizationNumber: string } | null;
    moreInfo: PersonalContact[];
    rolesInfo: ERRole[];
    expandedOrg: string | null;
    handleSelectOrg: (organizationNumber: string, name: string) => void;
    handleExpandToggle: (orgNumber: string) => void;
    error: { message: string; response?: string | null };
    erRolesError: string | null;
    formattedTime: string;
    formattedDate: string;
}

type SortDirection = 'asc' | 'desc' | undefined;

const MainContentComponent: React.FC<MainContentProps> = ({
    baseUrl,
    isLoading,
    organizations,
    subUnits,
    selectedOrg,
    moreInfo,
    rolesInfo,
    expandedOrg,
    handleSelectOrg,
    handleExpandToggle,
    error,
    erRolesError,
}) => {
    const [selectedContact, setSelectedContact] = useState<PersonalContact | null>(null);
    const [roleInfo, setRoleInfo] = useState<any[]>([]);
    const [isRoleView, setIsRoleView] = useState(false);
    const [showOrgList, setShowOrgList] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof PersonalContact | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);
    const [erRoleSortField, setERRoleSortField] = useState<'type' | 'person' | 'sistEndret' | null>(null);
    const [erRoleSortDirection, setERRoleSortDirection] = useState<SortDirection>(undefined);
    const [roleViewError, setRoleViewError] = useState<string | null>(null);

    // Quotes array in Norwegian
    const quotes = useMemo(
        () => [
            "Dette er en fin dag.",
            "Husk at hver dag er en gave.",
            "Gjør det beste ut av det du har.",
            "Livet er fullt av muligheter.",
            "Sammen er vi sterke.",
            "Ta vare på øyeblikket.",
            "Smil til verden, og verden smiler til deg.",
            "Gi aldri opp.",
            "Livet er hva som skjer mens du planlegger noe annet.",
        ],
        []
    );

    // Get a random quote
    const randomQuote = useMemo(() => {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, [quotes]);

    const authorizedFetch = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const headers = {
            ...options.headers,
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.statusText}: ${errorText}`);
        }
        return response;
    };

    const handleViewRoles = async (subject: string, reportee: string) => {
        try {
            const res = await authorizedFetch(`${baseUrl}/serviceowner/${subject}/roles/${reportee}`);
            const data = await res.json();
            setRoleInfo(data);
            setIsRoleView(true);
            setShowOrgList(false);
            setRoleViewError(null);
        } catch (error) {
            console.error(error);
            setRoleViewError('Roller kunne ikke hentes.');
        }
    };

    const filterContacts = (contacts: PersonalContact[]) => {
        if (searchQuery.length < 3) return contacts;
        return contacts.filter(
            (contact) =>
                contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.socialSecurityNumber?.includes(searchQuery) ||
                contact.mobileNumber?.includes(searchQuery) ||
                contact.eMailAddress?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const sortContacts = (contacts: PersonalContact[]) => {
        return [...contacts].sort((a, b) => {
            if (sortField === null) return 0;
            const aValue = a[sortField] || '';
            const bValue = b[sortField] || '';
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (field: keyof PersonalContact) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? undefined : 'asc');
            if (sortDirection === 'desc') {
                setSortField(null);
            } else {
                setSortField(field);
            }
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleERRoleSort = (field: 'type' | 'person' | 'sistEndret') => {
        if (erRoleSortField === field) {
            setERRoleSortDirection(erRoleSortDirection === 'asc' ? 'desc' : erRoleSortDirection === 'desc' ? undefined : 'asc');
            if (erRoleSortDirection === 'desc') {
                setERRoleSortField(null);
            } else {
                setERRoleSortField(field);
            }
        } else {
            setERRoleSortField(field);
            setERRoleSortDirection('asc');
        }
    };

    return (
        <div className="results-section">
            {error.message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div">
                        {error.message}
                    </Typography>
                    {error.response && (
                        <Typography variant="body2" component="div">
                            {error.response}
                        </Typography>
                    )}
                </Alert>
            )}

            {showOrgList && (
                <div className={`org-list ${isRoleView ? 'hidden' : ''}`}>
                    {isLoading ? (
                        <>
                            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                        </>
                    ) : organizations.length === 0 ? (
                        <div className="no-search-message">
                            <Typography variant="h6">"{randomQuote}"</Typography>
                        </div>
                    ) : (
                        organizations.map((org) => (
                            <div key={org.organizationNumber} className="org-card-container">
                                <Paper
                                    elevation={selectedOrg?.OrganizationNumber === org.organizationNumber ? 6 : 2}
                                    sx={{
                                        p: 2,
                                        mb: 1,
                                        cursor: 'pointer',
                                        backgroundColor:
                                            selectedOrg?.OrganizationNumber === org.organizationNumber
                                                ? 'primary.light'
                                                : 'background.paper',
                                        border:
                                            selectedOrg?.OrganizationNumber === org.organizationNumber
                                                ? '2px solid'
                                                : 'none',
                                        borderColor:
                                            selectedOrg?.OrganizationNumber === org.organizationNumber
                                                ? 'primary.main'
                                                : 'transparent',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                    onClick={() => handleSelectOrg(org.organizationNumber, org.name)}
                                >
                                    <Typography variant="h6">{org.name}</Typography>
                                    <Typography variant="body2">Org Nr: {org.organizationNumber}</Typography>
                                    <Typography variant="body2">Type: {org.type}</Typography>

                                    {subUnits.some((sub) => sub.overordnetEnhet === org.organizationNumber) && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExpandToggle(org.organizationNumber);
                                            }}
                                            aria-expanded={expandedOrg === org.organizationNumber}
                                            aria-label={`${expandedOrg === org.organizationNumber ? 'Collapse' : 'Expand'
                                                } subunits for ${org.name}`}
                                        >
                                            {expandedOrg === org.organizationNumber ? <ExpandLess /> : <ExpandMore />}
                                        </Button>
                                    )}
                                </Paper>

                                {expandedOrg === org.organizationNumber && (
                                    <div className="subunits">
                                        {subUnits
                                            .filter((sub) => sub.overordnetEnhet === org.organizationNumber)
                                            .map((sub) => (
                                                <Paper
                                                    key={sub.organisasjonsnummer}
                                                    elevation={selectedOrg?.OrganizationNumber === sub.organisasjonsnummer ? 6 : 1}
                                                    sx={{
                                                        p: 2,
                                                        mb: 1,
                                                        ml: 4,
                                                        cursor: 'pointer',
                                                        backgroundColor:
                                                            selectedOrg?.OrganizationNumber === sub.organisasjonsnummer
                                                                ? 'secondary.light'
                                                                : 'background.paper',
                                                        border:
                                                            selectedOrg?.OrganizationNumber === sub.organisasjonsnummer
                                                                ? '2px solid'
                                                                : 'none',
                                                        borderColor:
                                                            selectedOrg?.OrganizationNumber === sub.organisasjonsnummer
                                                                ? 'secondary.main'
                                                                : 'transparent',
                                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                                        '&:hover': {
                                                            transform: 'translateY(-5px)',
                                                            boxShadow: 4,
                                                        },
                                                    }}
                                                    onClick={() => handleSelectOrg(sub.organisasjonsnummer, sub.navn)}
                                                >
                                                    <Typography variant="subtitle1">{sub.navn}</Typography>
                                                    <Typography variant="body2">Org Nr: {sub.organisasjonsnummer}</Typography>
                                                </Paper>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedOrg && (
                <div className={`org-details ${isRoleView ? 'full-width' : ''}`}>
                    <Typography variant="h4" gutterBottom>
                        {selectedOrg.Name}
                    </Typography>

                    {!isRoleView ? (
                        <>
                            <div className="search-ssn">
                                <TextField
                                    label="Søk i kontakter"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Navn / SSN / Telefon / E-post"
                                    sx={{ mb: 2 }}
                                />
                            </div>
                            <Typography variant="h6" gutterBottom>
                                Organisasjonsoversikt
                            </Typography>

                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <MuiTable>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sortDirection={sortField === 'name' ? sortDirection : false}
                                                onClick={() => handleSort('name')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">Navn</Typography>
                                            </TableCell>
                                            <TableCell
                                                sortDirection={sortField === 'socialSecurityNumber' ? sortDirection : false}
                                                onClick={() => handleSort('socialSecurityNumber')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">Fødselsnummer</Typography>
                                            </TableCell>
                                            <TableCell
                                                sortDirection={sortField === 'mobileNumber' ? sortDirection : false}
                                                onClick={() => handleSort('mobileNumber')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">Mobilnummer</Typography>
                                            </TableCell>
                                            <TableCell
                                                sortDirection={sortField === 'eMailAddress' ? sortDirection : false}
                                                onClick={() => handleSort('eMailAddress')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">E-post</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">Roller</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortContacts(filterContacts(moreInfo || [])).map((contact) => (
                                            <TableRow key={contact.personalContactId}>
                                                <TableCell>{contact.name}</TableCell>
                                                <TableCell>{contact.socialSecurityNumber}</TableCell>
                                                <TableCell>{contact.mobileNumber}</TableCell>
                                                <TableCell>{contact.eMailAddress}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedContact(contact);
                                                            handleViewRoles(
                                                                contact.socialSecurityNumber,
                                                                selectedOrg.OrganizationNumber
                                                            );
                                                        }}
                                                    >
                                                        Vis
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </MuiTable>
                            </TableContainer>

                            <Typography variant="h6" gutterBottom>
                                ER-Roller
                            </Typography>

                            <TableContainer component={Paper} sx={{ mb: 2 }}>
                                <MuiTable>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sortDirection={erRoleSortField === 'type' ? erRoleSortDirection : false}
                                                onClick={() => handleERRoleSort('type')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">Rolletype</Typography>
                                            </TableCell>
                                            <TableCell
                                                sortDirection={erRoleSortField === 'person' ? erRoleSortDirection : false}
                                                onClick={() => handleERRoleSort('person')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">Person</Typography>
                                            </TableCell>
                                            <TableCell
                                                sortDirection={erRoleSortField === 'sistEndret' ? erRoleSortDirection : false}
                                                onClick={() => handleERRoleSort('sistEndret')}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="subtitle1">Dato Endret</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rolesInfo
                                            ?.flatMap((roleGroup) =>
                                                roleGroup?.roller?.map((role: any) => ({
                                                    ...role,
                                                    sistEndret: roleGroup.sistEndret,
                                                }))
                                            )
                                            ?.sort((a, b) => {
                                                if (erRoleSortField === null) return 0;
                                                if (erRoleSortField === 'type') {
                                                    const aType = a.type?.beskrivelse || '';
                                                    const bType = b.type?.beskrivelse || '';
                                                    return erRoleSortDirection === 'asc'
                                                        ? aType.localeCompare(bType)
                                                        : bType.localeCompare(aType);
                                                }
                                                if (erRoleSortField === 'person') {
                                                    const aName = `${a.person?.navn?.fornavn || ''} ${a.person?.navn?.etternavn || ''}`.trim();
                                                    const bName = `${b.person?.navn?.fornavn || ''} ${b.person?.navn?.etternavn || ''}`.trim();
                                                    return erRoleSortDirection === 'asc'
                                                        ? aName.localeCompare(bName)
                                                        : bName.localeCompare(aName);
                                                }
                                                if (erRoleSortField === 'sistEndret') {
                                                    const aDate = new Date(a.sistEndret || 0).getTime();
                                                    const bDate = new Date(b.sistEndret || 0).getTime();
                                                    return erRoleSortDirection === 'asc' ? aDate - bDate : bDate - aDate;
                                                }
                                                return 0;
                                            })
                                            ?.map((role, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{role.type?.beskrivelse || ''}</TableCell>
                                                    <TableCell>
                                                        {`${role.person?.navn?.fornavn || ''} ${role.person?.navn?.etternavn || ''}`.trim()}
                                                    </TableCell>
                                                    <TableCell>{role.sistEndret || ''}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </MuiTable>
                            </TableContainer>
                            {erRolesError && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {erRolesError}
                                </Alert>
                            )}
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Roller knyttet til {selectedContact?.name}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setIsRoleView(false);
                                    setShowOrgList(true);
                                }}
                                sx={{ mb: 2 }}
                            >
                                Tilbake til oversikt
                            </Button>
                            <TableContainer component={Paper} sx={{ mb: 2 }}>
                                <MuiTable>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="subtitle1">Rolletype</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">Rollenavn</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roleInfo?.map((role, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{role.RoleType}</TableCell>
                                                <TableCell>{role.RoleName}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </MuiTable>
                            </TableContainer>
                            {roleViewError && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {roleViewError}
                                </Alert>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MainContentComponent;
