import { Box } from "@mui/material";
import { Heading } from "@digdir/designsystemet-react";
import SettingsPATComponent from "../components/SettingsContent/SettingsPATComponent";
import SettingsDarkModeComponent from "../components/SettingsContent/SettingsDarkModeComponent";
import SettingsLanguageComponent from "../components/SettingsContent/SettingsLanguageComponent";
import SettingsActionButtons from "../components/SettingsContent/SettingsActionButtons";
import SettingsVersionComponent from "../components/SettingsContent/SettingsVersionComponent";
import { containerBox } from "./styles/SettingsPage.styles";

const SettingsPage: React.FC = () => {
  return (
    <Box sx={containerBox}>
      <Heading level={2} data-size="md">
        Innstillinger
      </Heading>

      <SettingsPATComponent />
      <SettingsDarkModeComponent />
      <SettingsLanguageComponent />
      <SettingsActionButtons />
      <SettingsVersionComponent />
    </Box>
  );
};

export default SettingsPage;
