import { createTheme } from "@mui/material";

export const getPalleteTheme = (isDarkMode: Boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#4dabff" : "#004a70",
      },
      secondary: {
        main: isDarkMode ? "#66b3ff" : "#0163ba",
      },
      background: {
        default: isDarkMode ? "#121212" : "#f0f2f5",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#e0e0e0" : "rgba(0, 0, 0, 0.87)",
        secondary: isDarkMode ? "#b0b0b0" : "rgba(0, 0, 0, 0.6)",
      },
      divider: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      error: {
        main: isDarkMode ? "#ff5c5c" : "#d32f2f",
      },
      warning: {
        main: isDarkMode ? "#ffb74d" : "#ed6c02",
      },
      info: {
        main: isDarkMode ? "#4dabff" : "#0288d1",
      },
      success: {
        main: isDarkMode ? "#66bb6a" : "#2e7d32",
      },
      action: {
        active: isDarkMode ? "#fff" : "rgba(0, 0, 0, 0.54)",
        hover: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        selected: isDarkMode
          ? "rgba(255, 255, 255, 0.16)"
          : "rgba(0, 0, 0, 0.08)",
        disabled: isDarkMode
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(0, 0, 0, 0.26)",
        disabledBackground: isDarkMode
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(224, 224, 224, 1)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: isDarkMode ? "rgba(255, 255, 255, 0.3)" : undefined,
            },
          },
        },
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  });
