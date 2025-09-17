import { SxProps, Theme } from "@mui/material/styles";

// Sidebar container
export const sidebarContainer = (
  isCollapsed: boolean,
  isDarkMode: boolean,
  theme: Theme,
): SxProps<Theme> => ({
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
});

// Drag handle
export const dragHandle = (
  isDarkMode: boolean,
  theme: Theme,
): SxProps<Theme> => ({
  position: "absolute",
  right: -6,
  top: "50%",
  transform: "translateY(-50%)",
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
});

// Logo box
export const logoBox: SxProps<Theme> = {
  textAlign: "center",
  mb: 3,
};

//CollapsContainer
export const collapseContainer: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 2,
};

// Collapse button
export const collapseButton = (isCollapsed: boolean): SxProps<Theme> => ({
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
});

// Divider
export const dividerStyle = (isDarkMode: boolean): SxProps<Theme> => ({
  bgcolor: isDarkMode ? "grey.700" : "grey.500",
  my: 2,
});

// User info box
export const userInfoBox: SxProps<Theme> = {
  textAlign: "center",
};
