export interface SidebarProps {
    environment: string;
    isEnvDropdownOpen: boolean;
    toggleEnvDropdown: () => void;
    handleEnvChange: (env: string) => void;
    userName: string;
    userEmail: string;
    isDarkMode: boolean;
}
