import React from 'react';
import { Box, Typography, Button, Menu, MenuItem, Divider } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import logo from '../../assets/logo.png';

interface SidebarProps {
    environment: string;
    isEnvDropdownOpen: boolean; // Added this line
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
}) => {
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
                bgcolor: 'primary.main',
                color: '#fff',
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
                    >
                        Oppslag
                    </button>
                    <button
                        className={`nav-button ${currentPage === 'settings' ? 'selected' : ''}`}
                        onClick={() => setCurrentPage('settings')}
                    >
                        Innstillinger
                    </button>
                </nav>
            </Box>

            <Box>
                <Divider sx={{ bgcolor: 'grey.500', my: 2 }} />
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6">{formattedTime}</Typography>
                    <Typography variant="body2">{formattedDate}</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleMenuClick}
                        endIcon={<ExpandMore />}
                        sx={{
                            borderColor: 'secondary.main',
                            color: '#fff',
                            '&:hover': {
                                borderColor: 'secondary.light',
                                backgroundColor: 'secondary.dark',
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
