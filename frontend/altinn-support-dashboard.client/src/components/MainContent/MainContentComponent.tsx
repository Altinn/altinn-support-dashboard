
'use client';

import  { useState } from 'react';

import { Organization, Subunit, PersonalContact, ERRole } from '../../models/models';
import {
    Skeleton,
    Button,
    Search,
    Alert,
    Heading,
    Paragraph,
    Table,
} from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

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
}


type SortDirection = 'ascending' | 'descending' | undefined;

export default function MainContentComponent({
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
}: MainContentProps) {
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
            if (aValue < bValue) return sortDirection === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'ascending' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (field: keyof PersonalContact) => {
        if (sortField === field && sortDirection === 'descending') {
            setSortField(null);
            setSortDirection(undefined);
        } else {
            setSortField(field);
            setSortDirection(
                sortField === field && sortDirection === 'ascending' ? 'descending' : 'ascending'
            );
        }
    };

    const handleERRoleSort = (field: 'type' | 'person' | 'sistEndret') => {
        if (erRoleSortField === field && erRoleSortDirection === 'descending') {
            setERRoleSortField(null);
            setERRoleSortDirection(undefined);
        } else {
            setERRoleSortField(field);
            setERRoleSortDirection(
                erRoleSortField === field && erRoleSortDirection === 'ascending' ? 'descending' : 'ascending'
            );
        }
    };

    return (
        <div className="results-section">
            {error.message && (
                <Alert severity="danger" className="error-alert">
                    <Heading level={2} role="alert" size="xs" spacing>
                        {error.message}
                    </Heading>
                    {error.response && <Paragraph>{error.response}</Paragraph>}
                </Alert>
            )}

            {showOrgList && (
                <div className={`org-list ${isRoleView ? 'hidden' : ''}`}>
                    {isLoading ? (
                        <>
                            <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" data-testid="skeleton" />
                            <br />
                            <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" data-testid="skeleton" />
                            <br />
                            <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" data-testid="skeleton" />
                        </>
                    ) : (
                        organizations?.map((org) => (
                            <div key={org?.organizationNumber} className="org-card-container">
                                <div
                                    className={`org-card ${selectedOrg?.OrganizationNumber === org?.organizationNumber ? 'selected' : ''
                                        }`}
                                    onClick={() => handleSelectOrg(org?.organizationNumber, org?.name)}
                                >
                                    <h3>{org?.name}</h3>
                                    <p>Org Nr: {org?.organizationNumber}</p>
                                    <p>Type: {org?.type}</p>

                                    {subUnits?.some((sub) => sub?.overordnetEnhet === org?.organizationNumber) && (
                                        <Button
                                            variant="secondary"
                                            className="expand-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExpandToggle(org?.organizationNumber);
                                            }}
                                            aria-expanded={expandedOrg === org?.organizationNumber}
                                            aria-label={`${expandedOrg === org?.organizationNumber ? 'Collapse' : 'Expand'
                                                } subunits for ${org?.name}`}
                                        >
                                            {expandedOrg === org?.organizationNumber ? (
                                                <ChevronUpIcon title="Collapse subunits" fontSize="1.5rem" />
                                            ) : (
                                                <ChevronDownIcon title="Expand subunits" fontSize="1.5rem" />
                                            )}
                                        </Button>
                                    )}
                                </div>

                                {expandedOrg === org?.organizationNumber && (
                                    <div className="subunits">
                                        {subUnits
                                            ?.filter((sub) => sub?.overordnetEnhet === org?.organizationNumber)
                                            ?.map((sub) => (
                                                <div
                                                    key={sub?.organisasjonsnummer}
                                                    className={`subunit-card ${selectedOrg?.OrganizationNumber === sub?.organisasjonsnummer
                                                            ? 'selected'
                                                            : ''
                                                        }`}
                                                    onClick={() =>
                                                        handleSelectOrg(sub?.organisasjonsnummer, sub?.navn)
                                                    }
                                                >
                                                    <h4>{sub?.navn}</h4>
                                                    <p>Org Nr: {sub?.organisasjonsnummer}</p>
                                                </div>
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
                    <h2>{selectedOrg?.Name}</h2>

                    {!isRoleView ? (
                        <>

                            <div className="search-ssn">

                                <Search
                                    label="Søk i kontakter"
                                    size="sm"
                                    placeholder="Navn / SSN / Telefon / E-post"
                                    clearButtonLabel="Empty"
                                    variant="simple"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onClear={() => setSearchQuery('')}
                                />
                            </div>
                            <h3 className="subheading">Organisasjonsoversikt</h3>

                            <Table className="contact-table">
                                <Table.Head>
                                    <Table.Row>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleSort('name')}
                                            sort={sortField === 'name' ? sortDirection : undefined}
                                        >
                                            Navn
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleSort('socialSecurityNumber')}
                                            sort={sortField === 'socialSecurityNumber' ? sortDirection : undefined}
                                        >
                                            Fødselsnummer
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleSort('mobileNumber')}
                                            sort={sortField === 'mobileNumber' ? sortDirection : undefined}
                                        >
                                            Mobilnummer
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleSort('eMailAddress')}
                                            sort={sortField === 'eMailAddress' ? sortDirection : undefined}
                                        >
                                            E-post
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>Roller</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Head>
                                <Table.Body>
                                    {sortContacts(filterContacts(moreInfo || [])).map((contact) => (
                                        <Table.Row key={contact?.personalContactId}>
                                            <Table.Cell>{contact?.name}</Table.Cell>
                                            <Table.Cell>{contact?.socialSecurityNumber}</Table.Cell>
                                            <Table.Cell>{contact?.mobileNumber}</Table.Cell>
                                            <Table.Cell>{contact?.eMailAddress}</Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    variant="tertiary"
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        handleViewRoles(
                                                            contact?.socialSecurityNumber,
                                                            selectedOrg?.OrganizationNumber
                                                        );
                                                    }}
                                                >
                                                    Vis
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>

                            <h3 className="subheading">ER-Roller</h3>

                            <Table className="roles-table">
                                <Table.Head>
                                    <Table.Row>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleERRoleSort('type')}
                                            sort={erRoleSortField === 'type' ? erRoleSortDirection : undefined}
                                        >
                                            Rolletype
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleERRoleSort('person')}
                                            sort={erRoleSortField === 'person' ? erRoleSortDirection : undefined}
                                        >
                                            Person
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sortable
                                            onClick={() => handleERRoleSort('sistEndret')}
                                            sort={erRoleSortField === 'sistEndret' ? erRoleSortDirection : undefined}
                                        >
                                            Dato Endret
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Head>
                                <Table.Body>
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
                                                return erRoleSortDirection === 'ascending'
                                                    ? a.type.beskrivelse.localeCompare(b.type.beskrivelse)
                                                    : b.type.beskrivelse.localeCompare(a.type.beskrivelse);
                                            }
                                            if (erRoleSortField === 'person') {
                                                const aName = `${a.person?.navn?.fornavn} ${a.person?.navn?.etternavn}`;
                                                const bName = `${b.person?.navn?.fornavn} ${b.person?.navn?.etternavn}`;
                                                return erRoleSortDirection === 'ascending'
                                                    ? aName.localeCompare(bName)
                                                    : bName.localeCompare(aName);
                                            }
                                            if (erRoleSortField === 'sistEndret') {
                                                return erRoleSortDirection === 'ascending'
                                                    ? new Date(a.sistEndret).getTime() - new Date(b.sistEndret).getTime()
                                                    : new Date(b.sistEndret).getTime() - new Date(a.sistEndret).getTime();
                                            }
                                            return 0;
                                        })
                                        ?.map((role, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell>{role?.type?.beskrivelse}</Table.Cell>
                                                <Table.Cell>
                                                    {role?.person?.navn?.fornavn} {role?.person?.navn?.etternavn}
                                                </Table.Cell>
                                                <Table.Cell>{role?.sistEndret}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                </Table.Body>
                            </Table>
                            {erRolesError && (
                                <Alert severity="danger" className="error-alert">
                                    <Paragraph>{erRolesError}</Paragraph>
                                </Alert>
                            )}
                        </>
                    ) : (
                        <>
                            <h3>Roller knyttet til {selectedContact?.name}</h3>
                            <Button
                                variant="tertiary"
                                onClick={() => {
                                    setIsRoleView(false);
                                    setShowOrgList(true);
                                }}
                            >
                                Tilbake til oversikt
                            </Button>
                            <Table className="roles-table">
                                <Table.Head>
                                    <Table.Row>
                                        <Table.HeaderCell>Rolletype</Table.HeaderCell>
                                        <Table.HeaderCell>Rollenavn</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Head>
                                <Table.Body>
                                    {roleInfo?.map((role, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{role?.RoleType}</Table.Cell>
                                            <Table.Cell>{role?.RoleName}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            {roleViewError && (
                                <Alert severity="danger" className="error-alert">
                                    <Paragraph>{roleViewError}</Paragraph>
                                </Alert>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}