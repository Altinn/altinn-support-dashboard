import React from 'react';
import { Organization, Subunit, PersonalContact, ERRole } from '../models/models';
import { Skeleton, Button } from '@digdir/designsystemet-react';

const MainContent: React.FC<{
    isLoading: boolean,
    organizations: Organization[],
    subUnits: Subunit[],
    selectedOrg: { Name: string, OrganizationNumber: string } | null,
    moreInfo: PersonalContact[],
    rolesInfo: ERRole[],
    expandedOrg: string | null,
    handleSelectOrg: (organizationNumber: string, name: string) => void,
    handleExpandToggle: (orgNumber: string) => void
}> = ({ isLoading, organizations, subUnits, selectedOrg, moreInfo, rolesInfo, expandedOrg, handleSelectOrg, handleExpandToggle }) => (
    <div className="results-section">
        <div className="org-list">
            {isLoading ? (
                <div>
                    <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" />
                    <br />
                    <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" />
                    <br />
                    <Skeleton.Rectangle height="100px" width="calc(100% - 20px)" />
                </div>
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
                                    {expandedOrg === org.organizationNumber ? '-' : '+'}
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

        {selectedOrg && (
            <div className="org-details">
                <h2>{selectedOrg.Name}</h2>
                <br />
                <h3>Organisasjonsinfo</h3>
                <table className="contact-table">
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Fødselsnummer</th>
                            <th>Mobilnummer</th>
                            <th>E-post</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moreInfo.map((contact) => (
                            <tr key={contact.personalContactId}>
                                <td>{contact.name}</td>
                                <td>{contact.socialSecurityNumber}</td>
                                <td>{contact.mobileNumber}</td>
                                <td>{contact.eMailAddress}</td>
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
                                    <td>{role?.type.beskrivelse}</td>
                                    <td>{role?.person?.navn.fornavn} {role?.person?.navn.etternavn}</td>
                                    <td>{roleGroup.sistEndret}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default MainContent;
