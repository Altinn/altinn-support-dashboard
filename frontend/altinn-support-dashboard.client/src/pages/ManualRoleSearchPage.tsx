import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import { UseManualRoleSearch } from "../hooks/hooks";
import { Box, Typography } from "@mui/material";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
import SearchButton from "../components/ManualRoleSearch/ManualRoleSearchButton";
import EmptySearch from "../components/ManualRoleSearch/ManualRoleEmptySearchButton";
import ManualRoleSearchResult from "../components/ManualRoleSearch/ManualRoleSearchResult";

export const ManualRoleSearchPage: React.FC<{ baseUrl?: string }> = ({ baseUrl }) => {
  const [rollehaver, setRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver"),
  );
  const [rollegiver, setRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver"),
  );
  const [hasSearched, setHasSearched] = useState(false);
  const { fetchRoles, roles, isLoading, error, clearRoles } =
    UseManualRoleSearch();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manuelt Rollesøk
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <InputComponent
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          setRollehaver={setRollehaver}
          setRollegiver={setRollegiver}
        />
        <SearchButton
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          fetchRoles={fetchRoles}
          isLoading={isLoading}
          sethasSearched={setHasSearched}
        />
      </Box>
      {(hasSearched ||
        rollehaver.trim() !== "" ||
        rollegiver.trim() !== "") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <EmptySearch
            clearRoles={clearRoles}
            sethasSearched={setHasSearched}
            setRollehaver={setRollehaver}
            setRollegiver={setRollegiver}
          />
        </Box>
      )}
      <ManualRoleSearchResult
        error = {error}
        isLoading = {isLoading}
        hasSearched = {hasSearched}
        roles = {roles}
      />
    </Box>
  );
};
