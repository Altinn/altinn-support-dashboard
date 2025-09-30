import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import { UseManualRoleSearch } from "../hooks/hooks";
import { Box } from "@mui/material";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
import SearchButton from "../components/ManualRoleSearch/ManualRoleSearchButton";
import EmptySearch from "../components/ManualRoleSearch/ManualRoleEmptySearchButton";
import ManualRoleSearchResult from "../components/ManualRoleSearch/ManualRoleSearchResult";
import {
  containerBox,
  inputRowBox,
  emptySearchBox,
} from "./styles/ManualRoleSearchPage.styles";
import { Heading } from '@digdir/designsystemet-react';

export const ManualRoleSearchPage: React.FC = () => {
  const [rollehaver, setRollehaver] = useState<string>(
    getLocalStorageValue("rollehaver"),
  );
  const [rollegiver, setRollegiver] = useState<string>(
    getLocalStorageValue("rollegiver"),
  );
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = UseManualRoleSearch(rollehaver, rollegiver);

  return (
    <>
      <Heading level={6} data-size="sm" >
        Manuelt Rollesøk
      </Heading>

      <Box sx={inputRowBox}>
        <InputComponent
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          setRollehaver={setRollehaver}
          setRollegiver={setRollegiver}
        />
        <SearchButton
          rollehaver={rollehaver}
          rollegiver={rollegiver}
          isLoading={isLoading}
          refetch={refetch}
          sethasSearched={setHasSearched}
        />
      </Box>

      {(hasSearched ||
        rollehaver.trim() !== "" ||
        rollegiver.trim() !== "") && (
        <Box sx={emptySearchBox}>
          <EmptySearch
            sethasSearched={setHasSearched}
            setRollehaver={setRollehaver}
            setRollegiver={setRollegiver}
          />
        </Box>
      )}

      <ManualRoleSearchResult
        error={error}
        isLoading={isLoading}
        hasSearched={hasSearched}
        roles={roles}
      />
    </>
  );
};

export default ManualRoleSearchPage;
