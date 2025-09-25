import React from "react";
import { Alert, Box, Typography } from "@mui/material";
import { Role } from "./models/manualRoleSearchTypes";
import RoleTable from "./ManualRoleSearchTable";

type ManualRoleSearchResultProps = {
    error: Error | null;
    isLoading: boolean;
    hasSearched: boolean;
    roles: Role[];
};


const ManualRoleSearchResult: React.FC<ManualRoleSearchResultProps> = ({
    error,
    isLoading,
    hasSearched,
    roles,
  }) => {

    return (
        <Box>
        {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      {isLoading && <Typography variant="body1"> Laster roller...</Typography>}
      {!isLoading && hasSearched && roles.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ingen roller funnet.
        </Alert>
      )}
      {roles.length > 0 && !error && <RoleTable roles={roles} />}
      </Box>
    );
};


export default ManualRoleSearchResult;