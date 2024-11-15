import React, { useEffect, useState } from 'react';
import { Button } from '@digdir/designsystemet-react';
import logo from '../../assets/logo.png';

interface SidebarProps {
    environment: string;
    isEnvDropdownOpen: boolean;
    toggleEnvDropdown: () => void;
    handleEnvChange: (env: string) => void;
    currentPage: 'dashboard' | 'settings'; // Add currentPage prop
    setCurrentPage: (page: 'dashboard' | 'settings') => void; // Add setCurrentPage prop
}

const Sidebar: React.FC<SidebarProps> = ({
    environment,
    isEnvDropdownOpen,
    toggleEnvDropdown,
    handleEnvChange,
    currentPage,
    setCurrentPage
}) => {
    const [userName, setUserName] = useState('Testbruker');
    const [userEmail, setUserEmail] = useState('support@altinn.no');

    useEffect(() => {
        // Fetch user details from Azure App Service
        fetch('/.auth/me')
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    const user = data[0];
                    const nameClaim = user.user_claims.find((claim: any) => claim.typ === 'name');
                    const emailClaim = user.user_claims.find((claim: any) => claim.typ === 'emails');

                    setUserName(nameClaim ? nameClaim.val : 'Unknown User');
                    setUserEmail(emailClaim ? emailClaim.val : 'No Email Found');
                }
            })
            .catch((error) => console.error('Error fetching user info:', error));
    }, []);

    return (
        <aside className={`sidebar ${environment === 'TT02' ? 'sidebar-tt02' : 'sidebar-prod'}`}>
            <div className="logo">
                <img width="150px" src={logo} alt="Logo" />
            </div>
            <br />
            <nav className="nav">
                <Button
                    variant="secondary"
                    className={`nav-button ${currentPage === 'dashboard' ? 'selected' : ''}`}
                    onClick={() => setCurrentPage('dashboard')}
                >
                    Oppslag
                </Button>
                <Button
                    variant="secondary"
                    className={`nav-button ${currentPage === 'settings' ? 'selected' : ''}`}
                    onClick={() => setCurrentPage('settings')}
                >
                    Innstillinger
                </Button>
            </nav>
            <div className="environment-selector-container">
                <button
                    className={`environment-selector ${isEnvDropdownOpen ? 'open' : ''}`}
                    onClick={toggleEnvDropdown}
                >
                    {environment} &#9662;
                </button>
                <div className={`env-dropdown ${isEnvDropdownOpen ? 'open' : ''}`}>
                    <button className="env-dropdown-item" onClick={() => handleEnvChange('PROD')}>
                        PROD
                    </button>
                    <button className="env-dropdown-item" onClick={() => handleEnvChange('TT02')}>
                        TT02
                    </button>
                </div>
            </div>
            <div className="profile">
                <span className="profile-name">
                    <strong>{userName}</strong>
                    <br />
                    <span className="profile-email">{userEmail}</span>
                </span>
            </div>
        </aside>
    );
};

export default Sidebar;
