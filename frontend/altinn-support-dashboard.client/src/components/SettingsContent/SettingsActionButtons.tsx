import { Card, Button } from "@digdir/designsystemet-react";
import classes from "./styles/SettingsActionsButtons.module.css";

const SettingsActionButtons: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    window.location.href = "/.auth/logout?post_logout_redirect_uri=/signout";
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
