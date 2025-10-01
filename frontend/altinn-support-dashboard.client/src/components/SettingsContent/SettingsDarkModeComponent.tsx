import classes from "./styles/SettingsDarkModeComponent.module.css";

import { Card, Switch, Heading } from "@digdir/designsystemet-react";

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
      <Heading level={6}>Darkmode</Heading>
      <Switch label="" onChange={toggleDarkMode} />
    </Card>
  );
};

export default SettingsDarkModeComponent;
