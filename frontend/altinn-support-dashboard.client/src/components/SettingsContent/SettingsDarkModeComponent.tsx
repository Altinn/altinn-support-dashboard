import { Box, Paper, Typography, Switch } from "@mui/material";
import { useAppStore } from "../../hooks/Appstore";

const SettingsDarkModeComponent: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const setIsDarkMode = useAppStore((state) => state.setIsDarkMode);

  const toggleDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDarkModeState = event.target.checked;
    setIsDarkMode(newDarkModeState);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mørk Modus
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          Aktiver mørk modus
        </Typography>
        <Switch checked={isDarkMode} onChange={toggleDarkMode} />
      </Box>
    </Paper>
  );
};

export default SettingsDarkModeComponent;
