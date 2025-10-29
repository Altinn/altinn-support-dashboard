import { Card, Button } from "@digdir/designsystemet-react";
import classes from "./styles/SettingsActionsButtons.module.css";
import { initiateSignOut } from "../../utils/ansattportenApi";

const SettingsActionButtons: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    initiateSignOut("/signin");
  };
  return (
    <Card data-color="neutral" className={classes.container}>
      <Button
        data-color="accent"
        variant="primary"
        onClick={handleReload}
        style={{ marginRight: "12px" }}
      >
        Last inn på nytt
      </Button>
      <Button data-color="accent" variant="primary" onClick={handleLogout}>
        Logg ut
      </Button>
    </Card>
  );
};

export default SettingsActionButtons;
