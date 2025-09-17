import { Paper, Box } from "@mui/material";
// Digdir Designsystem imports
import {
  Button,
  Textfield,
  Heading,
  Paragraph,
  Alert,
  Tooltip,
  Select,
} from "@digdir/designsystemet-react";
import { useEffect, useState } from "react";
import { usePatTokenValidation } from "./hooks/usePatTokenValidation";
import { EyeClosedIcon, EyeIcon } from "@navikt/aksel-icons";
import * as styles from "./styles//SettingsPATComponent.styles";

const SettingsPATComponent: React.FC = () => {
  const [giteaEnv, setGiteaEnv] = useState<string>("development");
  const { patState, validateToken, clearToken } =
    usePatTokenValidation(giteaEnv);

  const [patInput, setPatInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Last inn lagret PAT token fra sessionStorage ved oppstart
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
    <Paper sx={{ p: 3, mb: 4 }}>
      <Heading level={3} data-size="sm">
        Organisasjonsoppsett
      </Heading>

      <Paragraph data-size="md">
        For å opprette nye organisasjoner i Altinn Studio må du angi en gyldig
        Personal Access Token (PAT). Denne brukes til å autentisere API-kall mot
        Gitea.
      </Paragraph>

      <Box sx={{ mb: 3, mt: 2 }}>
        <Paragraph data-size="sm" style={styles.boldLabel}>
          Altinn Studio Miljø
        </Paragraph>
        <Select
          id="gitea-environment-select"
          value={giteaEnv}
          onChange={(e) => {
            setGiteaEnv(e.target.value);
            clearToken();
            setPatInput("");
          }}
          style={styles.fullWidth}
        >
          <option value="development">Development (dev.altinn.studio)</option>
        </Select>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paragraph data-size="sm" style={styles.boldLabel}>
          Personal Access Token (PAT)
        </Paragraph>
        <div style={styles.tokenInputWrapper}>
          <Textfield
            value={patInput}
            onChange={handlePatInputChange}
            type={showPassword ? "text" : "password"}
            style={styles.flexGrow}
            error={patState.errorMessage}
            disabled={patState.isValidating}
            aria-labelledby="pat-input-label"
          />
          <span id="pat-input-label" style={styles.hiddenLabel}>
            Personal Access Token
          </span>
          <Button
            variant="tertiary"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}
            aria-label={showPassword ? "Skjul passord" : "Vis passord"}
          >
            {showPassword ? (
              <EyeIcon title="Skjul passord" fontSize="1.2rem" />
            ) : (
              <EyeClosedIcon title="Vis passord" fontSize="1.2rem" />
            )}
          </Button>
        </div>

        <div style={styles.infoLinksWrapper}>
          <Tooltip
            content="PAT-token brukes for å opprette organisasjoner, teams og repositories i Gitea. Denne må opprettes med admin-tilgang."
            placement="top"
          >
            <Button variant="tertiary" style={styles.linkButton}>
              Hva er en PAT-token?
            </Button>
          </Tooltip>
          <Button
            variant="tertiary"
            style={styles.linkButton}
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
        </div>

        {patState.isValid && (
          <Alert data-color="success" style={styles.alertSpacing}>
            PAT-token er validert.
          </Alert>
        )}
        {!patState.isValid && patState.errorMessage && (
          <Alert data-color="danger" style={styles.alertSpacing}>
            {patState.errorMessage}
          </Alert>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: "16px" }}>
        <Button
          onClick={handleValidateToken}
          disabled={patState.isValidating || !patInput}
        >
          {patState.isValidating ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>{" "}
              Validerer...
            </>
          ) : (
            "Valider token"
          )}
        </Button>

        <Button
          variant="secondary"
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
