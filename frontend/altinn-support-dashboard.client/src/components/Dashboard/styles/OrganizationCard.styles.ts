import { SxProps, Theme } from "@mui/material";

export const paperStyle = (isSelected: boolean): SxProps<Theme> => ({
  p: 2,
  mb: 1,
  cursor: "pointer",
  backgroundColor: isSelected ? "secondary" : "background.paper",
  border: isSelected ? "2px solid" : "none",
  borderColor: isSelected ? "secondary" : "transparent",
  transition: "transform 0.3s, boxShadow 0.3s",
  "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
});

export const subunitPaperStyle = (
  isSelected: boolean,
  ml: number = 4,
): SxProps<Theme> => ({
  p: 2,
  mb: 1,
  ml,
  cursor: "pointer",
  backgroundColor: isSelected ? "secondary" : "background.paper",
  border: isSelected ? "2px solid" : "none",
  borderColor: isSelected ? "secondary" : "transparent",
  transition: "transform 0.3s, boxShadow 0.3s",
  "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
});
