// MainContent/MainContentComponent.tsx
import React, { useState, useMemo, useEffect } from 'react';
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

import {
    MainContentProps,
    OfficialContact,
    SortDirection,
    PersonalContact,
} from './models/mainContentTypes';
import authorizedFetch from './hooks/useAuthorizedFetch';
import { formatDate } from './utils/dateUtils';
import { filterContacts, sortContacts, sortERRoles } from './utils/contactUtils';
import { ERRolesSortField } from './models/mainContentTypes';

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
    hasSearched,
}) => {
    const [selectedContact, setSelectedContact] = useState<PersonalContact | null>(null);
    const [roleInfo, setRoleInfo] = useState<any[]>([]);
    const [isRoleView, setIsRoleView] = useState(false);
    const [showOrgList, setShowOrgList] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof PersonalContact | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);
    const [erRoleSortField, setERRoleSortField] = useState<ERRolesSortField>(null);
    const [erRoleSortDirection, setERRoleSortDirection] = useState<SortDirection>(undefined);
    const [roleViewError, setRoleViewError] = useState<string | null>(null);
    const [officialContacts, setOfficialContacts] = useState<OfficialContact[]>([]);
    const [officialContactsError, setOfficialContactsError] = useState<string | null>(null);

    const quotes = useMemo(
        () => [
            'Dette er en fin dag.',
            'Husk at hver dag er en gave.',
            'Gjør det beste ut av det du har.',
            'Livet er fullt av muligheter.',
            'Sammen er vi sterke.',
            'Ta vare på øyeblikket.',
            'Smil til verden, og verden smiler til deg.',
            'Gi aldri opp.',
            'Livet er hva som skjer mens du planlegger noe annet.',
        ],
        []
    );

    const randomQuote = useMemo(() => {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, [quotes]);

    const handleViewRoles = async (subject: string, reportee: string) => {
        try {
            const res = await authorizedFetch(`${baseUrl}/serviceowner/${subject}/roles/${reportee}`);
            const data = await res.json();
            setRoleInfo(data);
            setIsRoleView(true);
            setShowOrgList(false);
            setRoleViewError(null);
        } catch (error) {
            setRoleViewError('Roller kunne ikke hentes.');
        }
    };

    useEffect(() => {
        setSearchQuery('');
    }, [selectedOrg]);

    useEffect(() => {
        const fetchOfficialContacts = async () => {
            if (!selectedOrg) return;
            try {
                const res = await authorizedFetch(
                    `${baseUrl}/serviceowner/organizations/${selectedOrg.OrganizationNumber}/officialcontacts`
                );
                const data = await res.json();
                setOfficialContacts(data);
                setOfficialContactsError(null);
            } catch (error) {
                setOfficialContactsError('Offisielle kontakter kunne ikke hentes.');
            }
        };
        fetchOfficialContacts();
    }, [selectedOrg, baseUrl]);

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
            setERRoleSortDirection(
                erRoleSortDirection === 'asc' ? 'desc' : erRoleSortDirection === 'desc' ? undefined : 'asc'
            );
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

    const filteredContacts = filterContacts(moreInfo || [], searchQuery);
    const sortedContacts = sortContacts(filteredContacts, sortField, sortDirection);

    const flatERRoles =
        rolesInfo?.flatMap((roleGroup) =>
            roleGroup?.roller?.map((role: any) => ({
                ...role,
                sistEndret: roleGroup.sistEndret,
            }))
        ) || [];
    const sortedERRoles = sortERRoles(flatERRoles, erRoleSortField, erRoleSortDirection);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSortField(null);
        setSortDirection(undefined);
        setSelectedContact(null);
        setIsRoleView(false);
        setRoleViewError(null);
    };

    return (
        <div className="results-section">
            {error.message ? (
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
            ) : (
                <>
                    {showOrgList && (
                        <div className={`org-list ${isRoleView ? 'hidden' : ''}`}>
                            {isLoading ? (
                                <div role="progressbar">
                                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                                </div>
                            ) : organizations.length === 0 ? (
                                hasSearched ? (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <Typography variant="h6">Ingen organisasjoner funnet</Typography>
                                    </Alert>
                                ) : (
                                    <div className="no-search-message">
                                        <Typography variant="h6">"{randomQuote}"</Typography>
                                    </div>
                                )
                            ) : (
                                organizations
                                    .filter((org) => {
                                        if (
                                            (org.type === 'BEDR' || org.type === 'AAFY') &&
                                            subUnits.some((sub) => sub.organisasjonsnummer === org.organizationNumber)
                                        ) {
                                            return false;
                                        }
                                        return true;
                                    })
                                    .map((org) => (
                                        <div key={org.organizationNumber} className="org-card-container">
                                            <Paper
                                                elevation={selectedOrg?.OrganizationNumber === org.organizationNumber ? 6 : 2}
                                                sx={{
                                                    p: 2,
                                                    mb: 1,
                                                    cursor: 'pointer',
                                                    backgroundColor:
                                                        selectedOrg?.OrganizationNumber === org.organizationNumber
                                                            ? 'secondary'
                                                            : 'background.paper',
                                                    border:
                                                        selectedOrg?.OrganizationNumber === org.organizationNumber ? '2px solid' : 'none',
                                                    borderColor:
                                                        selectedOrg?.OrganizationNumber === org.organizationNumber ? 'secondary' : 'transparent',
                                                    transition: 'transform 0.3s, boxShadow 0.3s',
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
                                                                            ? 'secondary'
                                                                            : 'background.paper',
                                                                    border:
                                                                        selectedOrg?.OrganizationNumber === sub.organisasjonsnummer ? '2px solid' : 'none',
                                                                    borderColor:
                                                                        selectedOrg?.OrganizationNumber === sub.organisasjonsnummer ? 'secondary' : 'transparent',
                                                                    transition: 'transform 0.3s, boxShadow 0.3s',
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
                            <Typography variant="subtitle1" gutterBottom>
                                Org Nr: {selectedOrg.OrganizationNumber}
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                {selectedOrg.Name}
                            </Typography>
                            {!isRoleView ? (
                                <>
                                    <div className="search-ssn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                        {searchQuery.trim() !== '' && (
                                            <Button variant="outlined" onClick={handleClearSearch} sx={{ height: 'fit-content', mb: 2 }}>
                                                Clear Search
                                            </Button>
                                        )}
                                    </div>
                                    <Typography variant="h6" gutterBottom>
                                        Din kontaktinformasjon
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
                                                {sortedContacts.length > 0 ? (
                                                    sortedContacts.map((contact) => (
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
                                                                        handleViewRoles(contact.socialSecurityNumber, selectedOrg.OrganizationNumber);
                                                                    }}
                                                                >
                                                                    Vis
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5}>
                                                            <Typography variant="body2" color="textSecondary" align="center">
                                                                {searchQuery.trim().length >= 3
                                                                    ? `Fant ingen resultater for '${searchQuery}'`
                                                                    : 'Her var det tomt'}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </MuiTable>
                                    </TableContainer>
                                    <Typography variant="h6" gutterBottom>
                                        Varslingsadresser for virksomheten
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                        <MuiTable>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Mobilnummer</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Endret Mobilnummer</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">E-post</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Endret E-post</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Status</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {officialContacts.length > 0 ? (
                                                    officialContacts.map((contact, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{contact.MobileNumber || '-'}</TableCell>
                                                            <TableCell>{formatDate(contact.MobileNumberChanged)}</TableCell>
                                                            <TableCell>{contact.EMailAddress || '-'}</TableCell>
                                                            <TableCell>{formatDate(contact.EMailAddressChanged)}</TableCell>
                                                            <TableCell>
                                                                {(contact.fratraadt || contact.erDoed) ? (
                                                                    <>
                                                                        {contact.fratraadt && 'Fratrådt'}
                                                                        {contact.fratraadt && contact.erDoed && ', '}
                                                                        {contact.erDoed && 'Død'}
                                                                    </>
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5}>
                                                            <Typography variant="body2" color="textSecondary" align="center">
                                                                Her var det tomt
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </MuiTable>
                                    </TableContainer>
                                    <Typography variant="h6" gutterBottom>
                                        ER-roller
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
                                                        <Typography variant="subtitle1">Person/Virksomhet</Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sortDirection={erRoleSortField === 'sistEndret' ? erRoleSortDirection : false}
                                                        onClick={() => handleERRoleSort('sistEndret')}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <Typography variant="subtitle1">Dato Endret</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">Status</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sortedERRoles.length > 0 ? (
                                                    sortedERRoles.map((role, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{role.type?.beskrivelse || ''}</TableCell>
                                                            <TableCell>
                                                                {role.person
                                                                    ? `${role.person?.navn?.fornavn || ''} ${role.person?.navn?.etternavn || ''}`.trim()
                                                                    : role.enhet
                                                                    ? `${role.enhet.navn?.[0] || ''} (${role.enhet.organisasjonsnummer})`
                                                                    : ''}
                                                            </TableCell>
                                                            <TableCell>
                                                                {role.sistEndret ? formatDate(role.sistEndret) : ''}
                                                            </TableCell>
                                                            <TableCell>
                                                                {role.fratraadt ? 'Fratrådt' : 'Aktiv'}
                                                                {role.person?.erDoed ? ' (Død)' : ''}
                                                                {role.enhet?.erSlettet ? ' (Slettet)' : ''}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4}>
                                                            <Typography variant="body2" color="textSecondary" align="center">
                                                                Ingen roller funnet
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </MuiTable>
                                    </TableContainer>
                                    {erRolesError && (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            {erRolesError}
                                        </Alert>
                                    )}

                                    {officialContactsError && (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            {officialContactsError}
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
                                                {roleInfo && roleInfo.length > 0 ? (
                                                    roleInfo.map((role, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{role.RoleType}</TableCell>
                                                            <TableCell>{role.RoleName}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="body2" color="textSecondary" align="center">
                                                                Her var det tomt
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
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
                </>
            )}
        </div>
    );
};

export default MainContentComponent;
