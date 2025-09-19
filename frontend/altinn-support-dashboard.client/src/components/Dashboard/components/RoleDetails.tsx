import React from "react";
import {
  Alert,
  Button,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface RoleDetailsProps {
  selectedContactName?: string;
  roleInfo: { RoleType: string; RoleName: string }[];
  roleViewError?: string | null;
  onBack: () => void;
}

export const RoleDetails: React.FC<RoleDetailsProps> = ({
  selectedContactName,
  roleInfo,
  roleViewError,
  onBack,
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Roller knyttet til {selectedContactName}
      </Typography>

      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        Tilbake til oversikt
      </Button>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <MuiTable>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1">Rolletype</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Rollenavn</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roleInfo && roleInfo.length > 0 ? (
              roleInfo.map((role, index) => (
                <TableRow key={index}>
                  <TableCell>{role.RoleType}</TableCell>
                  <TableCell>{role.RoleName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    Ingen roller funnet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {roleViewError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {roleViewError}
        </Alert>
      )}
    </div>
  );
};
