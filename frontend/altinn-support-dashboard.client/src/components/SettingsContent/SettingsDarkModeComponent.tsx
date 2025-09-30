import classes, {
  textWrapper,
} from "./styles/SettingsDarkModeComponent.module.css";

import { Card, Switch } from "@digdir/designsystemet-react";

import { useAppStore } from "../../stores/Appstore";

const SettingsDarkModeComponent: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const setIsDarkMode = useAppStore((state) => state.setIsDarkMode);

  const toggleDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDarkModeState = event.target.checked;
    setIsDarkMode(newDarkModeState);
  };

  return (
    <Card className={classes.container}>
      <h3>Darkmode</h3>
      <Switch label="" onChange={toggleDarkMode} />
    </Card>
  );
};

export default SettingsDarkModeComponent;
