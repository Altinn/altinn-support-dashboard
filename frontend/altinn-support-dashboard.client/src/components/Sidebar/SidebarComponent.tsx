import React from 'react';
import { Button } from '@digdir/designsystemet-react';
import logo from '../../assets/logo.png';

interface SidebarProps {
    environment: string;
    isEnvDropdownOpen: boolean;
    toggleEnvDropdown: () => void;
    handleEnvChange: (env: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    environment,
    isEnvDropdownOpen,
    toggleEnvDropdown,
    handleEnvChange
}) => (
    <aside className={`sidebar ${environment === 'TT02' ? 'sidebar-tt02' : 'sidebar-prod'}`}>
        <div className="logo"><img width="150px" src={logo} alt="Logo" /></div>
        <br />
        <nav className="nav">
            <Button variant='secondary' className="nav-button selected">Dashboard</Button>
            <Button variant='secondary' className="nav-button">Innstillinger</Button>
        </nav>
        <div className="environment-selector-container">
            <button className={`environment-selector ${isEnvDropdownOpen ? 'open' : ''}`} onClick={toggleEnvDropdown}>
                {environment} &#9662;
            </button>
            <div className={`env-dropdown ${isEnvDropdownOpen ? 'open' : ''}`}>
                <button className="env-dropdown-item" onClick={() => handleEnvChange('PROD')}>PROD</button>
                <button className="env-dropdown-item" onClick={() => handleEnvChange('TT02')}>TT02</button>
            </div>
        </div>
        <div className="profile">
            <span className="profile-name"><strong>Digdirsen,<br />Altinn Kenneth</strong></span>
            <div className="profile-pic"></div>
        </div>
    </aside>
);

export default Sidebar;
