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
    <Card className={classes.container}>
      <Button
        variant="secondary"
        onClick={handleReload}
        style={{ marginRight: "12px" }}
      >
        Last inn på nytt
      </Button>
      <Button variant="secondary" onClick={handleLogout}>
        Logg ut
      </Button>
    </Card>
  );
};

export default SettingsActionButtons;
