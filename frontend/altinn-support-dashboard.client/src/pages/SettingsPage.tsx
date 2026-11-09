import classes from "./styles/SettingsPage.module.css";
import { Heading } from "@digdir/designsystemet-react";
import SettingsDarkModeComponent from "../components/SettingsContent/SettingsDarkModeComponent";
import SettingsLanguageComponent from "../components/SettingsContent/SettingsLanguageComponent";
import SettingsActionButtons from "../components/SettingsContent/SettingsActionButtons";

const SettingsPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <Heading level={2} data-size="md">
        Innstillinger
      </Heading>

      <SettingsDarkModeComponent />
      <SettingsLanguageComponent />
      <SettingsActionButtons />
    </div>
  );
};

export default SettingsPage;
