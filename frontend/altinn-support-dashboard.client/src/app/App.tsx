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
    const [error, setError] = useState<{ message: string, response?: string | null }>({ message: '', response: null });
    const [environment, setEnvironment] = useState('PROD');
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const baseUrl = 'https://localhost:7174/api';

    const handleSearch = async () => {
        const trimmedQuery = query.replace(/\s/g, "");
        setIsLoading(true);
        setError({ message: '', response: null });
        try {
            const res = await fetch(`${baseUrl}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`);
            if (!res.ok) {
                const errorResponse = await res.text();
                throw { message: `Error ${res.status}: ${res.statusText}`, response: errorResponse };
            }
            const data = await res.json();

            const orgData: Organization[] = Array.isArray(data) ? data : [data];

            const allSubUnits: Subunit[] = [];
            for (const org of orgData) {
                try {
                    const subunitRes = await fetch(`${baseUrl}/brreg/${org.organizationNumber}/underenheter`);
                    if (!subunitRes.ok) {
                        console.error(`Failed to fetch subunits for ${org.organizationNumber}: ${subunitRes.statusText}`);
                        continue;
                    }
                    const subunitData = await subunitRes.json();

                    if (subunitData?._embedded?.underenheter) {
                        const subunits = subunitData._embedded.underenheter.map((sub: any) => ({
                            navn: sub.navn,
                            organisasjonsnummer: sub.organisasjonsnummer,
                            overordnetEnhet: sub.overordnetEnhet,
                            type: sub.organisasjonsform?.kode
                        }));
                        allSubUnits.push(...subunits);
                    }
                } catch (error) {
                    console.error(`Error fetching subunits for ${org.organizationNumber}:`, error);
                }
            }

            console.log('All subunits:', allSubUnits);

            setOrganizations(orgData);
            setSubUnits(allSubUnits);
            setSelectedOrg(null);
        } catch (error: any) {
            setError({ message: error.message, response: error.response || null });
            setOrganizations([]);
            setSubUnits([]);
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
            const personalContacts: PersonalContact[] = await resPersonalContacts.json();
            setMoreInfo(personalContacts);

            const subunit = subUnits.find(sub => sub.organisasjonsnummer === organizationNumber);
            const orgNumberForRoles = subunit ? subunit.overordnetEnhet : organizationNumber;

            const resRoles = await fetch(`${baseUrl}/brreg/${orgNumberForRoles}`);
            if (!resRoles.ok) {
                const errorResponse = await resRoles.text();
                throw { message: `Error ${resRoles.status}: ${resRoles.statusText}`, response: errorResponse };
            }
            const roles: { rollegrupper: ERRole[] } = await resRoles.json();
            setRolesInfo(roles.rollegrupper);

        } catch (error: any) {
            setError({ message: error.message, response: error.response || null });
            setMoreInfo([]);
            setRolesInfo([]);
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
                    error={error}
                />
            </main>
        </div>
    );
};

export default App;
