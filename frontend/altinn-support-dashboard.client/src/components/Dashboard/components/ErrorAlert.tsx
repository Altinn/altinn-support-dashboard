import { Alert, Typography } from "@mui/material";

interface ErrorAlertProps {
  error: {
    message: string;
    response?: string;
  };
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error?.message) return null;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <Typography variant="h6" component="div">
        {error.message}
      </Typography>
      {error.response && (
        <Typography variant="body2" component="div">
          {error.response}
        </Typography>
      )}
    </Alert>
  );
};
