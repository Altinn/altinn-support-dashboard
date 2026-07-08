import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Paragraph,
  Search,
  Spinner,
  Textfield,
} from "@digdir/designsystemet-react";
import { useAppStore } from "../stores/Appstore";
import { useInternalIdLookup } from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../components/ManualRoleSearch/utils/storageUtils";
import styles from "./styles/IdentifierConversionPage.module.css";

const IdentifierConversionPage: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const [input, setInput] = useState(getLocalStorageValue("identifierInput"));
  const [submittedQuery, setSubmittedQuery] = useState(
    getLocalStorageValue("identifierQuery")
  );

  const { data, isLoading, isError, error } = useInternalIdLookup(
    submittedQuery,
    environment
  );

  useEffect(() => {
    if (isError) showPopup((error as Error)?.message, "error");
  }, [isError, error]);

  const handleSearch = () => {
    const query = input.trim();
    setLocalStorageValue("identifierQuery", query);
    setSubmittedQuery(query);
  };

  return (
    <div className={styles.container}>
      <Heading level={1} data-size="sm">
        Konverter identifikator
      </Heading>
      <div className={styles.searchRow}>
        <Textfield
          className={styles.input}
          label=""
          placeholder="orgnr, nin, partyid, partyuuid"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setLocalStorageValue("identifierInput", e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={!input.trim()}
          variant="primary"
        >
          <Search />
          Søk
        </Button>
      </div>

      {isLoading && <Spinner aria-label="Laster" />}

      {data && (
        <Card className={styles.result}>
          {data.ssn && (
            <Paragraph>
              <strong>Nin:</strong> {data.ssn}
            </Paragraph>
          )}

          {data.orgNumber && (
            <Paragraph>
              <strong>OrgNr:</strong> {data.orgNumber}
            </Paragraph>
          )}

          <Paragraph>
            <strong>PartyId:</strong> {data.partyId}
          </Paragraph>
          <Paragraph>
            <strong>PartyUuid:</strong> {data.partyUuid}
          </Paragraph>

          {data.userId && (
            <Paragraph>
              <strong>UserId:</strong> {data.userId}
            </Paragraph>
          )}
        </Card>
      )}
    </div>
  );
};

export default IdentifierConversionPage;
