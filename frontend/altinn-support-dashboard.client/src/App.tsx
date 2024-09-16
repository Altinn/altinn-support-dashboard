import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import SearchComponent from './components/Searchcomponent';
import MainContent from './components/MainContent';
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
            <Sidebar
                environment={environment}
                isEnvDropdownOpen={isEnvDropdownOpen}
                toggleEnvDropdown={toggleEnvDropdown}
                handleEnvChange={handleEnvChange}
            />
            <main className="main-content">
                <SearchComponent query={query} setQuery={setQuery} handleSearch={handleSearch} />
                <MainContent
                    isLoading={isLoading}
                    organizations={organizations}
                    subUnits={subUnits}
                    selectedOrg={selectedOrg}
                    moreInfo={moreInfo}
                    rolesInfo={rolesInfo}
                    expandedOrg={expandedOrg}
                    handleSelectOrg={handleSelectOrg}
                    handleExpandToggle={handleExpandToggle}
                />
            </main>
        </div>
    );
};

export default App;
