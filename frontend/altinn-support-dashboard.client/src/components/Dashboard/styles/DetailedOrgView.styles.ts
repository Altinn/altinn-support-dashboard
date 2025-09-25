import { SxProps } from "@mui/material";

export const officialContactsBoxStyle: SxProps = {
  display: "flex",
  gap: 3,
  mb: 2,
  "& .MuiTableContainer-root": {
    flex: 1,
    maxWidth: "calc(50% - 1.5rem)",
  },
  "& .MuiTableCell-root": {
    padding: "8px 16px",
  },
};
