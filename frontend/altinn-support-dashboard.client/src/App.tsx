﻿/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './App.css';
import logo from './assets/logo.png';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';
import { Button, Skeleton, Search } from '@digdir/designsystemet-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Organization, PersonalContact, Subunit, ERRole } from './models/models';

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [subUnits, setSubUnits] = useState<Subunit[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<{ Name: string, OrganizationNumber: string } | null>(null);
    const [moreInfo, setMoreInfo] = useState<PersonalContact[]>([]);
    const [rolesInfo, setRolesInfo] = useState<ERRole[]>([]);
    const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [environment, setEnvironment] = useState('PROD');
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const baseUrl = 'https://localhost:7174/api';
    
    const removewhitespacequery = query.replace(/\s/g, "");
    // removes +47 removewhitespacequery.startsWith("+47") ? removewhitespacequery.slice(3) : removewhitespacequery;


    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseUrl}/serviceowner/organizations/search?query=${encodeURIComponent(removewhitespacequery)}`);
            if (!res.ok) {
                throw new Error(`Feil ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();

            setError(null);

            const orgData: Organization[] = Array.isArray(data) ? data : [data];
            const parentOrgs = orgData.filter(org => org.type !== 'BEDR' && org.type !== 'AAFY');

            const relevantSubUnits: Subunit[] = [];
            for (const org of parentOrgs) {
                const subunitRes = await fetch(`https://data.brreg.no/enhetsregisteret/api/underenheter?overordnetEnhet=${org.organizationNumber}&registrertIMvaregisteret=false`);
                const subunitData = await subunitRes.json();

                if (subunitData?._embedded?.underenheter) {
                    relevantSubUnits.push(...subunitData._embedded.underenheter.filter((sub: any) =>
                        orgData.some(org => org.organizationNumber === sub.organisasjonsnummer)
                    ).map((sub: any) => ({
                        navn: sub.navn,
                        organisasjonsnummer: sub.organisasjonsnummer,
                        overordnetEnhet: sub.overordnetEnhet
                    })));
                }
            }

            const filteredOrganizations = orgData.filter(org => !relevantSubUnits.some(sub => sub.organisasjonsnummer === org.organizationNumber));

            setOrganizations(filteredOrganizations);
            setSubUnits(relevantSubUnits);
            setSelectedOrg(null);
        } catch (error) {
            setError(error.message);
            setOrganizations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOrg = async (organizationNumber: string, name: string) => {
        setSelectedOrg({ Name: name, OrganizationNumber: organizationNumber });
        try {
            const resPersonalContacts = await fetch(`${baseUrl}/serviceowner/organizations/${organizationNumber}/personalcontacts`);
            if (!resPersonalContacts.ok) {
                throw new Error(`Feil ${resPersonalContacts.status}: ${resPersonalContacts.statusText}`);
            }
            const personalContacts = await resPersonalContacts.json();
            setMoreInfo(personalContacts);

            const resRoles = await fetch(`${baseUrl}/brreg/${organizationNumber}`);
            if (!resRoles.ok) {
                throw new Error(`Feil ${resRoles.status}: ${resRoles.statusText}`);
            }
            const roles = await resRoles.json();
            setRolesInfo(roles.rollegrupper);

        } catch (error) {
            setError(error.message);
        }
    };

    const toggleEnvDropdown = () => {
        setIsEnvDropdownOpen(prevState => !prevState);
    };

    const handleEnvChange = (env: string) => {
        setEnvironment(env);
        setIsEnvDropdownOpen(false);
    };

    const handleExpandToggle = (orgNumber: string) => {
        setExpandedOrg(expandedOrg === orgNumber ? null : orgNumber);
    };

    return (
        <div className="app-wrapper">
            <aside className="sidebar">
                <div className="logo"><img width="150px" src={logo} alt="Logo" /></div>
                <br />
                <nav className="nav">
                    <Button variant='secondary' className="nav-button selected">Dashboard</Button>
                    <Button variant='secondary' className="nav-button">Innstillinger</Button>
                </nav>
                <div className="environment-selector" onClick={toggleEnvDropdown}>
                    {environment} &#9662;
                    {isEnvDropdownOpen && (
                        <div className="env-dropdown">
                            <button className="env-dropdown-item" onClick={() => handleEnvChange('PROD')}>PROD</button>
                            <button className="env-dropdown-item" onClick={() => handleEnvChange('TT02')}>TT02</button>
                        </div>
                    )}
                </div>
                <div className="profile">
                    <span className="profile-name"><strong>Halsen,<br />Espen Elstad</strong></span>
                    <div className="profile-pic"></div>
                </div>
            </aside>

            <main className="main-content">

                <div className="search-container">
                    <label htmlFor="query" className="search-label">Mobilnummer / E-post / Organisasjonsnummer:</label>
                    <form onSubmit={e => {
                        e.preventDefault();
                    }}>
                        <Search
                        id="searchbar"
                        label='Søk etter innhold'
                        clearButtonLabel=''
                        searchButtonLabel={<MagnifyingGlassIcon fontSize={'1.5em'} title='Search' />}
                        variant='primary'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onSearchClick={handleSearch}
                        />
                    </form>
                </div>

                <div className="results-section">
                    <div className="org-list">
                        {isLoading ? (
                            <div>
                                <Skeleton.Rectangle height="100px" width="calc(100% - 20px)"  />
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
            </main>
        </div>
    );
};

export default App;
