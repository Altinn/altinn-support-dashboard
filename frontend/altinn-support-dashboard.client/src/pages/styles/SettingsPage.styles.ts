import { SxProps, Theme } from "@mui/material";

export const containerBox: SxProps<Theme> = {
  p: 2,
  height: "100%",
  overflow: "auto",
  maxHeight: "calc(100vh - 80px)", // Subtract header height
  overflowX: "hidden",
};
