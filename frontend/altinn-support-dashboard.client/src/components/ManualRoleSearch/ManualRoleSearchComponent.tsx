import React, { useState } from "react";
import { UseManualRoleSearch } from "../../hooks/hooks";
import { Role } from "./models/manualRoleSearchTypes";
import {
  TextField,
  Button,
  Alert,
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "./utils/storageUtils";
import { getBaseUrl } from "../../utils/utils";

const ManualRoleSearchComponent: React.FC = () => {
  const [rollehaver, setRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver"),
  );
  const [rollegiver, setRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver"),
  );
  const [hasSearched, setHasSearched] = useState(false);
  const { fetchRoles, roles, isLoading, error, clearRoles } =
    UseManualRoleSearch();

  const handleSearch = async () => {
    setHasSearched(true);
    const cleanRollehaver = rollehaver.replace(/\s/g, "");
    const cleanRollegiver = rollegiver.replace(/\s/g, "");
    await fetchRoles(cleanRollehaver, cleanRollegiver);
  };

  const handleClearSearch = () => {
    setRollehaver("");
    setRollegiver("");
    setLocalStorageValue("rollehaver", "");
    setLocalStorageValue("rollegiver", "");
    setHasSearched(false);
    clearRoles();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manuelt Rollesøk
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          label="Tilganger fra"
          variant="outlined"
          value={rollegiver}
          onChange={(e) => {
            setRollegiver(e.target.value);
            setLocalStorageValue("rollegiver", e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Organisasjonsnummer til enheten som gir rollen">
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <TextField
          label="Tilganger til"
          variant="outlined"
          value={rollehaver}
          onChange={(e) => {
            setRollehaver(e.target.value);
            setLocalStorageValue("rollehaver", e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Fødselsnummer til personen som har rollen">
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={isLoading || !rollehaver || !rollegiver}
        >
          Søk
        </Button>
      </Box>
      {(hasSearched ||
        rollehaver.trim() !== "" ||
        rollegiver.trim() !== "") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="outlined" onClick={handleClearSearch}>
            Tøm søk
          </Button>
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {isLoading && <Typography variant="body1">Laster roller...</Typography>}
      {!isLoading && hasSearched && roles.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ingen roller funnet.
        </Alert>
      )}
      {roles.length > 0 && !error && <RoleTable roles={roles} />}
    </Box>
  );
};

export default ManualRoleSearchComponent;

interface RoleTableProps {
  roles: Role[];
}

const RoleTable: React.FC<RoleTableProps> = ({ roles }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <MuiTable stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">Rolletype</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Rollenavn</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Beskrivelse</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Rolledefinisjonskode</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={index}>
              <TableCell>{role.RoleType}</TableCell>
              <TableCell>{role.RoleName}</TableCell>
              <TableCell>{role.RoleDescription}</TableCell>
              <TableCell>{role.RoleDefinitionCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
