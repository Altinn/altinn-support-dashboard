// src/components/Sidebar/SidebarComponent.tsx

import React from 'react';
import { Box, Typography, Button, Menu, MenuItem, Divider } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import logo from '../../assets/logo.png';

interface SidebarProps {
    environment: string;
    isEnvDropdownOpen: boolean;
    toggleEnvDropdown: () => void;
    handleEnvChange: (env: string) => void;
    currentPage: 'dashboard' | 'settings';
    setCurrentPage: (page: 'dashboard' | 'settings') => void;
    userName: string;
    userEmail: string;
    formattedTime: string;
    formattedDate: string;
    isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    environment,
    handleEnvChange,
    currentPage,
    setCurrentPage,
    userName,
    userEmail,
    formattedTime,
    formattedDate,
    isDarkMode,
}) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEnvironmentChange = (env: string) => {
        handleEnvChange(env);
        handleMenuClose();
    };

    return (
        <Box
            sx={{
                width: 250,
                minWidth: 250,
                bgcolor: isDarkMode ? theme.palette.background.paper : 'primary.main',
                color: isDarkMode ? theme.palette.text.primary : '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
                boxShadow: 3,
                height: '100vh',
            }}
        >
            <Box>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <img src={logo} alt="Logo" width="150px" />
                </Box>

                <nav className="nav">
                    <button
                        className={`nav-button ${currentPage === 'dashboard' ? 'selected' : ''}`}
                        onClick={() => setCurrentPage('dashboard')}
                        style={{
                            color: currentPage === 'dashboard' ? theme.palette.secondary.main : '#fff',
                        }}
                    >
                        Oppslag
                    </button>
                    <button
                        className={`nav-button ${currentPage === 'settings' ? 'selected' : ''}`}
                        onClick={() => setCurrentPage('settings')}
                        style={{
                            color: currentPage === 'settings' ? theme.palette.secondary.main : '#fff',
                        }}
                    >
                        Innstillinger
                    </button>
                </nav>
            </Box>

            <Box>
                <Divider sx={{ bgcolor: isDarkMode ? 'grey.700' : 'grey.500', my: 2 }} />
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6">{formattedTime}</Typography>
                    <Typography variant="body2">{formattedDate}</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleMenuClick}
                        endIcon={<ExpandMore />}
                        sx={{
                            // Change the border color based on the selected environment
                            borderColor:
                                environment === 'TT02'
                                    ? theme.palette.warning.main // Orange color for TT02
                                    : theme.palette.secondary.main, // Blue color for PROD
                            color: isDarkMode ? theme.palette.text.primary : '#fff',
                            '&:hover': {
                                borderColor:
                                    environment === 'TT02'
                                        ? theme.palette.warning.light // Lighter orange on hover
                                        : theme.palette.secondary.light, // Lighter blue on hover
                                backgroundColor: isDarkMode ? theme.palette.action.hover : 'secondary.dark',
                            },
                        }}
                    >
                        {environment}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <MenuItem onClick={() => handleEnvironmentChange('PROD')}>PROD</MenuItem>
                        <MenuItem onClick={() => handleEnvironmentChange('TT02')}>TT02</MenuItem>
                    </Menu>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1">{userName}</Typography>
                    <Typography variant="body2">{userEmail}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Sidebar;
