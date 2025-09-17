import {
  Paper,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Tooltip,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePatTokenValidation } from "./hooks/usePatTokenValidation";
import { EyeClosedIcon, EyeIcon } from "@navikt/aksel-icons";
import { styles } from "./styles/SettingsPATComponent.styles";

const SettingsPATComponent: React.FC = () => {
  const [giteaEnv, setGiteaEnv] = useState<string>("development");
  const { patState, validateToken, clearToken } =
    usePatTokenValidation(giteaEnv);

  const [patInput, setPatInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (patState.token) {
      setPatInput(patState.token);
    }
  }, [patState.token]);

  const handlePatInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatInput(event.target.value);
  };

  const handleValidateToken = async () => {
    await validateToken(patInput);
  };

  const handleClearToken = () => {
    setPatInput("");
    clearToken();
  };

  return (
    <Paper sx={styles.paper}>
      {/* Heading */}
      <Typography variant="h6" gutterBottom>
        Organisasjonsoppsett
      </Typography>

      <Typography variant="body1" sx={styles.section}>
        For å opprette nye organisasjoner i Altinn Studio må du angi en gyldig
        Personal Access Token (PAT). Denne brukes til å autentisere API-kall mot
        Gitea.
      </Typography>

      {/* Environment selection */}
      <Box sx={styles.section}>
        <Typography variant="subtitle2" sx={styles.label}>
          Altinn Studio Miljø
        </Typography>
        <Select
          fullWidth
          value={giteaEnv}
          onChange={(e) => {
            setGiteaEnv(e.target.value);
            clearToken();
            setPatInput("");
          }}
        >
          <MenuItem value="development">
            Development (dev.altinn.studio)
          </MenuItem>
        </Select>
      </Box>

      {/* Token input */}
      <Box sx={styles.section}>
        <Typography variant="subtitle2" sx={styles.label}>
          Personal Access Token (PAT)
        </Typography>

        <Box sx={styles.tokenRow}>
          <TextField
            fullWidth
            value={patInput}
            onChange={handlePatInputChange}
            type={showPassword ? "text" : "password"}
            error={!!patState.errorMessage}
            helperText={patState.errorMessage || ""}
            disabled={patState.isValidating}
            label="Personal Access Token"
          />
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Skjul passord" : "Vis passord"}
            sx={styles.iconButton}
          >
            {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
          </IconButton>
        </Box>

        {/* Help links */}
        <Box sx={styles.linksRow}>
          <Tooltip title="PAT-token brukes for å opprette organisasjoner, teams og repositories i Gitea. Denne må opprettes med admin-tilgang.">
            <Button variant="text" size="small">
              Hva er en PAT-token?
            </Button>
          </Tooltip>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              const baseUrl =
                giteaEnv === "development"
                  ? "https://dev.altinn.studio"
                  : "https://altinn.studio";
              window.open(
                `${baseUrl}/repos/user/settings/applications`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            Generer et nytt PAT-token
          </Button>
        </Box>

        {/* Validation alerts */}
        {patState.isValid && (
          <Alert severity="success" sx={styles.alert}>
            PAT-token er validert.
          </Alert>
        )}
        {!patState.isValid && patState.errorMessage && (
          <Alert severity="error" sx={styles.alert}>
            {patState.errorMessage}
          </Alert>
        )}
      </Box>

      {/* Action buttons */}
      <Box sx={styles.actionsRow}>
        <Button
          variant="contained"
          onClick={handleValidateToken}
          disabled={patState.isValidating || !patInput}
        >
          {patState.isValidating ? "Validerer..." : "Valider token"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearToken}
          disabled={patState.isValidating || !patInput}
        >
          Fjern token
        </Button>
      </Box>
    </Paper>
  );
};

export default SettingsPATComponent;
