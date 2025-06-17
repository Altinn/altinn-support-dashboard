import React from 'react';
import { Box, Typography, Button, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
import { ExpandMore, Dashboard, Search, Settings, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { useCurrentDateTime } from '../../hooks/hooks';
import logo from '../../assets/logo.png';
import whiteLogo from '/asd_128_white.png';
import { SidebarProps } from './models/sidebarTypes';
import { useSidebarDrag } from './hooks/useSidebarDrag';

const Sidebar: React.FC<Omit<SidebarProps, "isEnvDropdownOpen" | "toggleEnvDropdown">> = ({
    environment,
    handleEnvChange,
    userName,
    userEmail,
    isDarkMode,
}) => {
    const theme = useTheme();
    const { formattedDate, formattedTime } = useCurrentDateTime();

    // Use the custom drag hook for collapse functionality.
    const { isCollapsed, toggleCollapse, handleDragStart } = useSidebarDrag();

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
                width: isCollapsed ? 70 : 250,
                minWidth: isCollapsed ? 70 : 250,
                bgcolor: isDarkMode ? theme.palette.background.paper : 'primary.main',
                color: isDarkMode ? theme.palette.text.primary : '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
                boxShadow: 3,
                height: '100vh',
                transition: 'width 0.3s ease, min-width 0.3s ease',
                position: 'relative',
            }}
        >
            {/* Draggable handle for resizing/collapse */}
            <Box
                onMouseDown={handleDragStart}
                sx={{
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: `translateY(-50%)`,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: isDarkMode ? theme.palette.primary.main : '#fff',
                    cursor: 'ew-resize',
                    border: isDarkMode ? `2px solid ${theme.palette.background.default}` : '2px solid #004a70',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-50%) scale(1.2)',
                        boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                    },
                }}
            />
            <Box>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <img 
                        src={isCollapsed ? whiteLogo : logo} 
                        alt="Logo" 
                        style={{
                            width: isCollapsed ? '40px' : '150px',
                            transition: 'width 0.3s ease'
                        }}
                    />
                </Box>
                <nav className="nav" style={{ position: 'relative', padding: isCollapsed ? '0' : '0 10px' }}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `nav-button ${isActive ? 'selected' : ''}`}
                        style={{
                            textDecoration: 'none',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: isCollapsed ? '0 0 10px 0' : undefined
                        }}
                    >
                        {!isCollapsed ? (
                            'Oppslag'
                        ) : (
                            <Tooltip title="Oppslag" placement="right" arrow>
                                <Dashboard sx={{ color: 'inherit', fontSize: 24 }} />
                            </Tooltip>
                        )}
                    </NavLink>
                    <NavLink
                        to="/manualrolesearch"
                        className={({ isActive }) => `nav-button ${isActive ? 'selected' : ''}`}
                        style={{
                            textDecoration: 'none',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: isCollapsed ? '0 0 10px 0' : undefined
                        }}
                    >
                        {!isCollapsed ? (
                            'Manuelt Rollesøk'
                        ) : (
                            <Tooltip title="Manuelt Rollesøk" placement="right" arrow>
                                <Search sx={{ color: 'inherit', fontSize: 24 }} />
                            </Tooltip>
                        )}
                    </NavLink>
                    <NavLink
                        to="/gitea"
                        className={({ isActive }) => `nav-button ${isActive ? 'selected' : ''}`}
                        style={{
                            textDecoration: 'none',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: isCollapsed ? '0 0 10px 0' : undefined
                        }}
                    >
                        {!isCollapsed ? (
                            'Gitea'
                        ) : (
                            <Tooltip title="Gitea" placement="right" arrow>
                                <Search sx={{ color: 'inherit', fontSize: 24 }} />
                            </Tooltip>
                        )}
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `nav-button ${isActive ? 'selected' : ''}`}
                        style={{
                            textDecoration: 'none',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: isCollapsed ? '0 0 10px 0' : undefined
                        }}
                    >
                        {!isCollapsed ? (
                            'Innstillinger'
                        ) : (
                            <Tooltip title="Innstillinger" placement="right" arrow>
                                <Settings sx={{ color: 'inherit', fontSize: 24 }} />
                            </Tooltip>
                        )}
                    </NavLink>
                </nav>
            </Box>
            <Box>
                <Box 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    <Button
                        onClick={toggleCollapse}
                        startIcon={!isCollapsed ? <ChevronLeft /> : undefined}
                        sx={{ 
                            color: 'inherit',
                            height: '36px',
                            borderRadius: '18px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '6px',
                            minWidth: isCollapsed ? '36px' : 'auto',
                            width: isCollapsed ? '36px' : 'auto',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            px: !isCollapsed ? 2 : 0
                        }}
                    >
                        {isCollapsed ? (
                            <ChevronRight sx={{ fontSize: 24 }} />
                        ) : (
                            'Minimer sidepanel'
                        )}
                    </Button>
                </Box>
                <Divider sx={{ bgcolor: isDarkMode ? 'grey.700' : 'grey.500', my: 2 }} />
                {!isCollapsed && (
                    <>
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
                                    borderColor:
                                        environment === 'TT02'
                                            ? theme.palette.warning.main
                                            : theme.palette.secondary.main,
                                    color: isDarkMode ? theme.palette.text.primary : '#fff',
                                    '&:hover': {
                                        borderColor:
                                            environment === 'TT02'
                                                ? theme.palette.warning.light
                                                : theme.palette.secondary.light,
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
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Sidebar;
