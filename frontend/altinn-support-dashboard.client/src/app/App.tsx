import React, { useState } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar/SidebarComponent';
import SearchComponent from '../components/TopSearchBar/TopSearchBarComponent';
import MainContent from '../components/MainContent/MainContentComponent';
import { Organization, PersonalContact, Subunit, ERRole } from '../models/models';

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [subUnits, setSubUnits] = useState<Subunit[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<{ Name: string, OrganizationNumber: string } | null>(null);
    const [moreInfo, setMoreInfo] = useState<PersonalContact[]>([]);
    const [rolesInfo, setRolesInfo] = useState<ERRole[]>([]);
    const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
    const [error, setError] = useState<{ message: string, response?: string | null }>({ message: '', response: null }); // Handle both message and response
    const [environment, setEnvironment] = useState('PROD');
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const baseUrl = 'https://localhost:7174/api';

    const handleSearch = async () => {
        const trimmedQuery = query.replace(/\s/g, "");
        setIsLoading(true);
        setError({ message: '', response: null }); // Reset error state
        try {
            const res = await fetch(`${baseUrl}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`);
            if (!res.ok) {
                const errorResponse = await res.text(); // Capture response if available
                throw { message: `Error ${res.status}: ${res.statusText}`, response: errorResponse };
            }
            const data = await res.json();

            const orgData: Organization[] = Array.isArray(data) ? data : [data];
            const parentOrgs = orgData.filter(org => org.type !== 'BEDR' && org.type !== 'AAFY');

            const relevantSubUnits: Subunit[] = [];
            for (const org of parentOrgs) {
                const subunitRes = await fetch(`${baseUrl}/brreg/${org.organizationNumber}/underenheter`);
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
        } catch (error: any) {
            setError({ message: error.message, response: error.response || null });
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
                const errorResponse = await resPersonalContacts.text();
                throw { message: `Error ${resPersonalContacts.status}: ${resPersonalContacts.statusText}`, response: errorResponse };
            }
            const personalContacts = await resPersonalContacts.json();
            setMoreInfo(personalContacts);

            const resRoles = await fetch(`${baseUrl}/brreg/${organizationNumber}`);
            if (!resRoles.ok) {
                const errorResponse = await resRoles.text();
                throw { message: `Error ${resRoles.status}: ${resRoles.statusText}`, response: errorResponse };
            }
            const roles = await resRoles.json();
            setRolesInfo(roles.rollegrupper);

        } catch (error: any) {
            setError({ message: error.message, response: error.response || null });
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
                    baseUrl={baseUrl}
                    isLoading={isLoading}
                    organizations={organizations}
                    subUnits={subUnits}
                    selectedOrg={selectedOrg}
                    moreInfo={moreInfo}
                    rolesInfo={rolesInfo}
                    expandedOrg={expandedOrg}
                    handleSelectOrg={handleSelectOrg}
                    handleExpandToggle={handleExpandToggle}
                    error={error} // Pass the updated error object to MainContent
                />
            </main>
        </div>
    );
};

export default App;
