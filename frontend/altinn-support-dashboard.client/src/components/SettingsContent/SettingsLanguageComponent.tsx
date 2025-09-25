import {
  Select,
  Box,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

const SettingsLanguageComponent: React.FC = () => {
  const [language, setLanguage] = useState<string>("nb");
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value as string);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Språkvalg
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="language-select-label">Velg språk</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            label="Velg språk"
            onChange={handleLanguageChange}
          >
            <MenuItem value="nb">Norsk Bokmål</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default SettingsLanguageComponent;
