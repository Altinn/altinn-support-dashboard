import { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  paper: {
    p: 3,
    mb: 4,
  },
  section: {
    mb: 3,
  },
  label: {
    fontWeight: "bold",
    mb: 1,
  },
  tokenRow: {
    display: "flex",
    gap: 1,
    mb: 2,
  },
  iconButton: {
    alignSelf: "center",
  },
  linksRow: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  alert: {
    mt: 2,
  },
  actionsRow: {
    display: "flex",
    gap: 2,
  },
};
