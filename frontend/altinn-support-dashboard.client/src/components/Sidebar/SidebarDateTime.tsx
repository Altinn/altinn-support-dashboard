import { Box, Typography } from "@mui/material";
import { useCurrentDateTime } from "../../hooks/hooks";

const SideBareDateTime: React.FC = () => {
  const { formattedDate, formattedTime } = useCurrentDateTime();
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="h6">{formattedTime}</Typography>
      <Typography variant="body2">{formattedDate}</Typography>
    </Box>
  );
};

export default SideBareDateTime;
