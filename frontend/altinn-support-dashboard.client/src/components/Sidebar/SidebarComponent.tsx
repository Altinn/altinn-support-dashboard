import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import {
  Dashboard,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Add,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo.png";
import whiteLogo from "/asd_128_white.png";
import { SidebarProps } from "./models/sidebarTypes";
import { useSidebarDrag } from "./hooks/useSidebarDrag";
import NavItem from "./NavItem";
import SideBarDateTime from "./SidebarDateTime";
import SidebarEnvToggle from "./SidebarEnvToggle";

const Sidebar: React.FC<
  Omit<SidebarProps, "isEnvDropdownOpen" | "toggleEnvDropdown">
> = ({ userName, userEmail, isDarkMode }) => {
  const theme = useTheme();

  // Use the custom drag hook for collapse functionality.
  const { isCollapsed, toggleCollapse, handleDragStart } = useSidebarDrag();

  return (
    <Box
      sx={{
        width: isCollapsed ? 70 : 250,
        minWidth: isCollapsed ? 70 : 250,
        bgcolor: isDarkMode ? theme.palette.background.paper : "primary.main",
        color: isDarkMode ? theme.palette.text.primary : "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        boxShadow: 3,
        height: "100vh",
        transition: "width 0.3s ease, min-width 0.3s ease",
        position: "relative",
      }}
    >
      {/* Draggable handle for resizing/collapse */}
      <Box
        onMouseDown={handleDragStart}
        sx={{
          position: "absolute",
          right: -6,
          top: "50%",
          transform: `translateY(-50%)`,
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: isDarkMode ? theme.palette.primary.main : "#fff",
          cursor: "ew-resize",
          border: isDarkMode
            ? `2px solid ${theme.palette.background.default}`
            : "2px solid #004a70",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-50%) scale(1.2)",
            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          },
        }}
      />
      <Box>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src={isCollapsed ? whiteLogo : logo}
            alt="Logo"
            style={{
              width: isCollapsed ? "40px" : "150px",
              transition: "width 0.3s ease",
            }}
          />
        </Box>
        <nav
          className="nav"
          style={{
            position: "relative",
            padding: isCollapsed ? "0" : "0 10px",
          }}
        >
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
            title="Instillinger"
            icon={<Settings />}
            isCollapsed={isCollapsed}
          />
        </nav>
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Button
            onClick={toggleCollapse}
            startIcon={!isCollapsed ? <ChevronLeft /> : undefined}
            sx={{
              color: "inherit",
              height: "36px",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "6px",
              minWidth: isCollapsed ? "36px" : "auto",
              width: isCollapsed ? "36px" : "auto",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "none",
              fontSize: "0.9rem",
              px: !isCollapsed ? 2 : 0,
            }}
          >
            {isCollapsed ? (
              <ChevronRight sx={{ fontSize: 24 }} />
            ) : (
              "Minimer sidepanel"
            )}
          </Button>
        </Box>
        <Divider
          sx={{ bgcolor: isDarkMode ? "grey.700" : "grey.500", my: 2 }}
        />
        {!isCollapsed && (
          <>
            <SideBarDateTime />
            <SidebarEnvToggle />
            <Box sx={{ textAlign: "center" }}>
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
