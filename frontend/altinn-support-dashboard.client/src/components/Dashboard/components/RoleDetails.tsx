import React from "react";
import {
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
import { useRoles } from "../../../hooks/hooks";
import { PersonalContact } from "../models/mainContentTypes";
import { useAppStore } from "../../../stores/Appstore";
import RoleTypeCell from "../../RoleTypeCell";

interface RoleDetailsProps {
  selectedContact: PersonalContact;
  organizationNumber: string;
  onBack: () => void;
}

export const RoleDetails: React.FC<RoleDetailsProps> = ({
  selectedContact,
  organizationNumber,
  onBack,
}) => {
  const environment = useAppStore((state) => state.environment);

  const roleInfo = useRoles(
    environment,
    selectedContact.socialSecurityNumber,
    organizationNumber,
  ).data;

  const handleBack = () => {
    onBack();
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Roller knyttet til {selectedContact.name}
      </Typography>

      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
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
                  <RoleTypeCell roleType={role.RoleType} />
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
    </div>
  );
};
