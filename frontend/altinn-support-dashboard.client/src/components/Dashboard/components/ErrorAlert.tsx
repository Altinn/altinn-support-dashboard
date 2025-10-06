import {
  Alert,
  Heading,
  Paragraph
} from "@digdir/designsystemet-react"

interface ErrorAlertProps {
  error: {
    message: string;
    response?: string;
  };
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error?.message) return null;

  return (
    <Alert data-color="danger">
      <Heading>
        {error.message}
      </Heading>
      {error.response && (
        <Heading>
          {error.response}
        </Heading>
      )}
    </Alert>
  );
};
