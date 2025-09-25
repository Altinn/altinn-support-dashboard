import { Box, Button } from "@mui/material";

const SettingsActionButtons: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    window.location.href = "/.auth/logout?post_logout_redirect_uri=/signout";
  };
  return (
    <Box sx={{ mb: 3 }}>
      <Button
        variant="outlined"
        onClick={handleReload}
        style={{ marginRight: "12px" }}
      >
        Last inn på nytt
      </Button>
      <Button onClick={handleLogout}>Logg ut</Button>
    </Box>
  );
};

export default SettingsActionButtons;
