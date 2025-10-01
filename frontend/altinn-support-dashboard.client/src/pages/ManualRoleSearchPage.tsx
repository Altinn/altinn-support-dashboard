import React, { useState } from "react";
import { getLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils";
import { UseManualRoleSearch } from "../hooks/hooks";
import { Box } from "@mui/material";
import InputComponent from "../components/ManualRoleSearch/ManualRoleSearchInput";
import SearchButton from "../components/ManualRoleSearch/ManualRoleSearchButton";
import EmptySearch from "../components/ManualRoleSearch/ManualRoleEmptySearchButton";
import ManualRoleSearchResult from "../components/ManualRoleSearch/ManualRoleSearchResult";
import { Heading} from '@digdir/designsystemet-react';
import "./styles/ManualRoleSearchPage.style.css";

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
    <div>
      <Heading level={1} data-size="sm" >
        Manuelt Rollesøk
      </Heading>

      <div className="input-row">
        <div className="input-fields">
          <InputComponent
            rollehaver={rollehaver}
            rollegiver={rollegiver}
            setRollehaver={setRollehaver}
            setRollegiver={setRollegiver}
          />
        </div>
        <div className="search-button">
          <SearchButton
            rollehaver={rollehaver}
            rollegiver={rollegiver}
            isLoading={isLoading}
            refetch={refetch}
            sethasSearched={setHasSearched}
          />
        </div>
      </div>
      <div className="result-area">
        {(hasSearched ||
          rollehaver.trim() !== "" ||
          rollegiver.trim() !== "") && (
          <div className="empty-search-button">
            <EmptySearch
              sethasSearched={setHasSearched}
            setRollehaver={setRollehaver}
            setRollegiver={setRollegiver}
            />
          </div>
        )}
        <div className="result-table">
          <ManualRoleSearchResult
            error={error}
            isLoading={isLoading}
            hasSearched={hasSearched}
            roles={roles}
          />
        </div>
      </div>
    </div>
  );
};

export default ManualRoleSearchPage;
