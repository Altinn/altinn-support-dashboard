import { Theme } from "@mui/material";

export const SidebarEnvToggleStyles = (
  theme: Theme,
  environment: string,
  isDarkMode: boolean,
) => ({
  height: 36,
  textAlign: "center",
  borderRadius: "18px",
  borderColor:
    environment === "TT02"
      ? theme.palette.warning.main
      : theme.palette.secondary.main,
  color: isDarkMode ? theme.palette.text.primary : "#fff",
  backgroundColor: "transparent",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor:
      environment === "TT02"
        ? theme.palette.warning.main
        : theme.palette.secondary.main,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor:
      environment === "TT02"
        ? theme.palette.warning.main
        : theme.palette.secondary.main,
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor:
      environment === "TT02"
        ? theme.palette.warning.main
        : theme.palette.secondary.main,
  },

  "& .MuiSelect-icon": {
    color: isDarkMode ? theme.palette.text.primary : "#fff",
  },
});
