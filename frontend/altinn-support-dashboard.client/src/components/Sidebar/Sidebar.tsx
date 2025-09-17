import React from "react";
import { Box, Typography, Button, Divider, useTheme } from "@mui/material";
import {
  Dashboard,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Add,
} from "@mui/icons-material";
import logo from "../../assets/logo.png";
import whiteLogo from "/asd_128_white.png";
import { SidebarProps } from "./models/sidebarTypes";
import { useSidebarDrag } from "./hooks/useSidebarDrag";
import NavItem from "./NavItem";
import SideBarDateTime from "./SidebarDateTime";
import SidebarEnvToggle from "./SidebarEnvToggle";
import * as styles from "./styles/SidebarComponent.style";

const Sidebar: React.FC<
  Omit<SidebarProps, "isEnvDropdownOpen" | "toggleEnvDropdown">
> = ({ userName, userEmail, isDarkMode }) => {
  const theme = useTheme();
  const { isCollapsed, toggleCollapse, handleDragStart } = useSidebarDrag();

  return (
    <Box sx={styles.sidebarContainer(isCollapsed, isDarkMode, theme)}>
      {/* Drag handle */}
      <Box
        onMouseDown={handleDragStart}
        sx={styles.dragHandle(isDarkMode, theme)}
      />

      <Box>
        {/* Logo */}
        <Box sx={styles.logoBox}>
          <Box
            component="img"
            src={isCollapsed ? whiteLogo : logo}
            alt="logo"
            sx={styles.logoImg(isCollapsed)}
          />
        </Box>

        {/* Navigation */}
        <nav className="nav">
          <NavItem
            to="/dashboard"
            title="Oppslag"
            icon={<Dashboard />}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/manualrolesearch"
            title="Manuelt rollesøk"
            icon={<Search />}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/new-org"
            title="Ny Organisasjon"
            icon={<Add />}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/settings"
            title="Innstillinger"
            icon={<Settings />}
            isCollapsed={isCollapsed}
          />
        </nav>
      </Box>

      <Box>
        {/* Collapse button */}
        <Box sx={styles.collapseContainer}>
          <Button
            onClick={toggleCollapse}
            startIcon={!isCollapsed ? <ChevronLeft /> : undefined}
            sx={styles.collapseButton(isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : "Minimer sidepanel"}
          </Button>
        </Box>

        <Divider sx={styles.dividerStyle(isDarkMode)} />

        {/* Extra info when expanded */}
        {!isCollapsed && (
          <>
            <SideBarDateTime />
            <SidebarEnvToggle />
            <Box sx={styles.userInfoBox}>
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
