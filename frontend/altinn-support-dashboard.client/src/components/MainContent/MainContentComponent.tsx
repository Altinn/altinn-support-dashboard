import React, { useState } from 'react';
import { Organization, Subunit, PersonalContact, ERRole } from '../../models/models';
import { Skeleton, Button, Search, Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

const MainContent: React.FC<{
    baseUrl: string,
    isLoading: boolean,
    organizations: Organization[],
    subUnits: Subunit[],
    selectedOrg: { Name: string, OrganizationNumber: string } | null,
    moreInfo: PersonalContact[],
    rolesInfo: ERRole[],
    expandedOrg: string | null,
    handleSelectOrg: (organizationNumber: string, name: string) => void,
    handleExpandToggle: (orgNumber: string) => void,
    error: { message: string, response?: string | null }
}> = ({
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
    error
}) => {
        const [selectedContact, setSelectedContact] = useState<PersonalContact | null>(null);
        const [roleInfo, setRoleInfo] = useState<any[]>([]);
        const [isRoleView, setIsRoleView] = useState(false);
        const [showOrgList, setShowOrgList] = useState(true);
        const [searchQuery, setSearchQuery] = useState('');

        const handleViewRoles = async (subject: string, reportee: string) => {
            try {
                const res = await fetch(`${baseUrl}/serviceowner/${subject}/roles/${reportee}`);
                if (!res.ok) {
                    throw new Error(`Error fetching roles: ${res.status}`);
                }
                const data = await res.json();
                setRoleInfo(data);
                setIsRoleView(true);
                setShowOrgList(false);
            } catch (error) {
                console.error(error);
            }
        };

        const filterContacts = (contacts: PersonalContact[]) => {
            if (searchQuery.length < 3) return contacts;
            return contacts.filter(contact =>
                contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.socialSecurityNumber?.includes(searchQuery) ||
                contact.mobileNumber?.includes(searchQuery) ||
                contact.eMailAddress?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        };

        return (
            <div className="results-section">
                {showOrgList && (
                    <div className={`org-list ${isRoleView ? 'hidden' : ''}`}>
                        {isLoading ? (
                            <div>
                                {error.message ? (
                                    <Alert severity="danger">
                                        <Heading
                                            level={2}
                                            role="alert"
                                            size="xs"
                                            spacing
                                        >
                                            {error.message}
                                        </Heading>
                                        {error.response && (
                                            <Paragraph>
                                                {error.response}
                                            </Paragraph>
                                        )}
                                    </Alert>
                                ) : (
                                    <>
                                        <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" data-testid="skeleton"/>
                                        <br />
                                        <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" data-testid="skeleton"/>
                                        <br />
                                        <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" data-testid="skeleton"/>
                                    </>
                                )}
                            </div>
                        ) : error.message ? (
                            <Alert severity="danger">
                                <Heading
                                    level={2}
                                    role="alert"
                                    size="xs"
                                    spacing
                                >
                                    {error.message}
                                </Heading>
                                {error.response && (
                                    <Paragraph>
                                        {error.response}
                                    </Paragraph>
                                )}
                            </Alert>
                        ) : (
                            organizations.map((org) => (
                                <div key={org?.organizationNumber} className="org-card-container">
                                    <div
                                        className={`org-card ${selectedOrg?.OrganizationNumber === org?.organizationNumber ? 'selected' : ''}`}
                                        onClick={() => handleSelectOrg(org.organizationNumber, org.name)}
                                    >
                                        <h3>{org?.name}</h3>
                                        <p>Org Nr: {org?.organizationNumber}</p>
                                        <p>Type: {org?.type}</p>

                                        {subUnits.some(sub => sub.overordnetEnhet === org.organizationNumber) && (
                                            <Button
                                                variant='secondary'
                                                className="expand-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleExpandToggle(org.organizationNumber);
                                                }}
                                            >
                                                {expandedOrg === org.organizationNumber ? <ChevronUpIcon title="a11y-title" fontSize="1.5rem" /> : <ChevronDownIcon title="a11y-title" fontSize="1.5rem" />}
                                            </Button>
                                        )}
                                    </div>

                                    {expandedOrg === org.organizationNumber && (
                                        <div className="subunits">
                                            {subUnits
                                                .filter(sub => sub.overordnetEnhet === org.organizationNumber)
                                                .map(sub => (
                                                    <div
                                                        key={sub.organisasjonsnummer}
                                                        className="subunit-card"
                                                        onClick={() => handleSelectOrg(sub.organisasjonsnummer, sub.navn)}
                                                    >
                                                        <h4>{sub.navn}</h4>
                                                        <p>Org Nr: {sub.organisasjonsnummer}</p>
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
                        <h2>{selectedOrg.Name}</h2>

                        {!isRoleView ? (
                            <>
                                <br />

                                <h3>Organisasjonsoversikt</h3>
                                <div style={{ width: '400px', display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto', marginTop: '-55px', textAlign: 'center' }}>
                                    <Search
                                        label="Søk i kontakter"
                                        size="sm"
                                        placeholder="Navn / SSN / Telefon / E-post"
                                        clearButtonLabel='Empty'
                                        variant="simple"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <table className="contact-table">
                                    <thead>
                                        <tr>
                                            <th>Navn</th>
                                            <th>Fødselsnummer</th>
                                            <th>Mobilnummer</th>
                                            <th>E-post</th>
                                            <th>Roller</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterContacts(moreInfo).map((contact) => (
                                            <tr key={contact.personalContactId}>
                                                <td>{contact.name}</td>
                                                <td>{contact.socialSecurityNumber}</td>
                                                <td>{contact.mobileNumber}</td>
                                                <td>{contact.eMailAddress}</td>
                                                <td>
                                                    <Button
                                                        variant='tertiary'
                                                        onClick={() => {
                                                            setSelectedContact(contact);
                                                            handleViewRoles(contact.socialSecurityNumber, selectedOrg.OrganizationNumber);
                                                        }}
                                                    >
                                                        Vis
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <br />
                                <h3>ER-Roller</h3>
                                <table className="roles-table">
                                    <thead>
                                        <tr>
                                            <th>Rolltype</th>
                                            <th>Person</th>
                                            <th>Dato Endret</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rolesInfo.map((roleGroup, index) => (
                                            roleGroup.roller.map((role, roleIndex) => (
                                                <tr key={`${index}-${roleIndex}`}>
                                                    <td>{role?.type?.beskrivelse}</td>
                                                    <td>{role?.person?.navn.fornavn} {role?.person?.navn.etternavn}</td>
                                                    <td>{roleGroup.sistEndret}</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <>
                                <h3>Roller knyttet til {selectedContact?.name}</h3>
                                <Button variant="tertiary" onClick={() => {
                                    setIsRoleView(false);
                                    setShowOrgList(true);
                                }}>
                                    Tilbake til oversikt
                                </Button>
                                <br />
                                <table className="roles-table">
                                    <thead>
                                        <tr>
                                            <th>Rolletype</th>
                                            <th>Rollenavn</th>
                                            <th>Rollebeskrivelse</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleInfo.map((role, index) => (
                                            <tr key={index}>
                                                <td>{role.RoleType}</td>
                                                <td>{role.RoleName}</td>
                                                <td>{role.RoleDescription}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

export default MainContent;
