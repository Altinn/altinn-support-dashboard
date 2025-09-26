import { SxProps, Theme } from "@mui/material";

export const dashboardContainer: SxProps<Theme> = {
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
};

export const orgListBox: SxProps<Theme> = {
  flex: "1 1 35%",
  maxWidth: "35%",
};

export const detailedOrgBox: SxProps<Theme> = {
  flex: "1 1 65%",
  maxWidth: "65%",
};
