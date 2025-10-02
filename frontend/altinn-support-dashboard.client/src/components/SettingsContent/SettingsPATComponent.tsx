import {
  EyeIcon,
  EyeSlashIcon,
  InformationSquareIcon,
} from "@navikt/aksel-icons";
import classes from "./styles/SettingsPatComponent.module.css";
import { useEffect, useState } from "react";
import { usePatTokenValidation } from "./hooks/usePatTokenValidation";
import {
  Card,
  Heading,
  Paragraph,
  Select,
  SelectOption,
  Textfield,
  Button,
  Tooltip,
  Alert,
} from "@digdir/designsystemet-react";

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

  const handleGeneratePatToken = () => {
    const baseUrl =
      giteaEnv === "development"
        ? "https://dev.altinn.studio"
        : "https://altinn.studio";
    window.open(
      `${baseUrl}/repos/user/settings/applications`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleClearToken = () => {
    setPatInput("");
    clearToken();
  };

  const handleGiteaEnvChange = (e: string) => {
    setGiteaEnv(e);
    handleClearToken();
  };

  return (
    <Card className={classes.wrapper}>
      <Heading level={6}>Organisasjonsoppsett</Heading>

      <Paragraph className={classes.description} data-size="sm">
        For å opprette nye organisasjoner i Altinn Studio må du angi en gyldig
        Personal Access Token (PAT). Denne brukes til å autentisere API-kall mot
        Gitea.
      </Paragraph>

      {/* Environment selection */}
      <Card className={classes.section}>
        <Heading className={classes.sectionTitle} level={6}>
          Altinn Studio Miljø
        </Heading>
        <Select
          value={giteaEnv}
          onChange={(e) => handleGiteaEnvChange(e.target.value)}
        >
          <SelectOption value="development">
            Development (dev.altinn.studio)
          </SelectOption>
        </Select>
      </Card>

      {/* Token input */}
      <Card className={classes.section}>
        <Heading level={6} className={classes.sectionTitle}>
          Personal Access Token (PAT)
        </Heading>

        <div className={classes.patInputWrapper}>
          <Textfield
            className={classes.patInputField}
            value={patInput}
            onChange={handlePatInputChange}
            type={showPassword ? "text" : "password"}
            disabled={patState.isValidating}
            aria-label="Personal Access Token"
          />
          <Button
            variant="secondary"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Skjul passord" : "Vis passord"}
            icon
          >
            {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
          </Button>
        </div>
        {/* Help links */}
        <div className={classes.patgeneratewrapper}>
          <Button
            variant="secondary"
            data-size="sm"
            onClick={() => handleGeneratePatToken()}
          >
            Generer et nytt PAT-token
          </Button>
          <Tooltip content="PAT-token brukes for å opprette organisasjoner, teams og repositories i Gitea. Denne må opprettes med admin-tilgang.">
            <InformationSquareIcon className={classes.informationIcon} />
          </Tooltip>
        </div>

        {/* Validation alerts */}
        {patState.isValid && (
          <Alert data-color="success">PAT-token er validert.</Alert>
        )}
        {!patState.isValid && patState.errorMessage && (
          <Alert data-color="danger">{patState.errorMessage}</Alert>
        )}

        {/* Action buttons */}
        <div className={classes.patActionButtonsWrapper}>
          <Button
            variant="secondary"
            onClick={handleValidateToken}
            disabled={patState.isValidating || !patInput}
          >
            {patState.isValidating ? "Validerer..." : "Valider token"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleClearToken}
            disabled={patState.isValidating || !patInput}
          >
            Fjern token
          </Button>
        </div>
      </Card>
    </Card>
  );
};

export default SettingsPATComponent;
