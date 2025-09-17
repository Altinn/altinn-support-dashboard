import { ExpandMore, Menu } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { useAppStore } from "../../hooks/Appstore";
import { SidebarEnvToggleStyles } from "./styles/SidebarEnvToggle.style";

const SidebarEnvToggle: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const theme = useTheme();
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  const handleEnvironmentChange = (env: string) => {
    useAppStore.getState().setEnvironment(env);
  };

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <FormControl fullWidth>
        <Select
          value={environment}
          onChange={(e) => handleEnvironmentChange(e.target.value)}
          IconComponent={ExpandMore}
          sx={SidebarEnvToggleStyles(theme, environment, isDarkMode)}
          variant="outlined"
        >
          <MenuItem value="PROD">PROD</MenuItem>
          <MenuItem value="TT02">TT02</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SidebarEnvToggle;
