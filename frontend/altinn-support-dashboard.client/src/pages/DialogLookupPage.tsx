import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Heading,
  Paragraph,
  Search,
  Select,
  SelectOption,
  Spinner,
  Textfield,
} from "@digdir/designsystemet-react";
import { useAppStore } from "../stores/Appstore";
import { useDialogLookup } from "../hooks/hooks";
import { showPopup } from "../components/Popup";
import CopyableField from "../components/CopyableField/CopyableField";
import { ResourceName } from "../models/dialogModels";
import styles from "./styles/DialogLookupPage.module.css";

type IdType = "dialog" | "correspondence" | "instance";

function getLocalizedValue(
  list: ResourceName[] | null | undefined,
  lang = "nb"
): string | undefined {
  if (!list || list.length === 0) return undefined;
  return (list.find((entry) => entry.languageCode === lang) ?? list[0]).value;
}

function buildUrn(idType: IdType, value: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  switch (idType) {
    case "dialog":
      return `urn:altinn:dialog-id:${trimmedValue}`;
    case "correspondence":
      return `urn:altinn:correspondence-id:${trimmedValue}`;
    case "instance":
      return `urn:altinn:instance-id:${trimmedValue}`;
  }
}

const placeholderByType: Record<IdType, string> = {
  dialog: "uuid",
  correspondence: "uuid",
  instance: "partyId/uuid",
};

function extractIdFromUrn(urn: string): string {
  return urn.replace(/^urn:altinn:[^:]+:/, "");
}

const DialogLookupPage: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const [idType, setIdType] = useState<IdType>("dialog");
  const [input, setInput] = useState("");
  const [submittedUrn, setSubmittedUrn] = useState("");

  const { data, isLoading, isError, error } = useDialogLookup(
    submittedUrn,
    environment
  );

  useEffect(() => {
    if (isError) showPopup((error as Error)?.message, "error");
  }, [isError, error]);

  const urn = buildUrn(idType, input);

  const handleSearch = () => {
    if (urn) setSubmittedUrn(urn);
  };

  const title =
    getLocalizedValue(data?.nonSensitiveTitle) ??
    getLocalizedValue(data?.title) ??
    "";

  const resourceName = getLocalizedValue(data?.serviceResource.name);
  const ownerName = getLocalizedValue(data?.serviceOwner.name);

  return (
    <div className={styles.container}>
      <Heading level={1} data-size="sm">
        Dialog-oppslag
      </Heading>
      <div className={styles.searchRow}>
        <Select
          className={styles.idTypeSelect}
          value={idType}
          onChange={(e) => setIdType(e.target.value as IdType)}
        >
          <SelectOption value="dialog">Dialog ID</SelectOption>
          <SelectOption value="correspondence">Correspondence ID</SelectOption>
          <SelectOption value="instance">App instance ID</SelectOption>
        </Select>

        <Textfield
          className={styles.input}
          label=""
          placeholder={placeholderByType[idType]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={!urn} variant="primary">
          <Search />
          Søk
        </Button>
      </div>

      {isLoading && <Spinner aria-label="Laster" />}

      {data && (
        <Card className={styles.result}>
          <CopyableField label="Dialog ID" displayValue={data.dialogId} />
          <Divider className={styles.resultDivider} />

          <CopyableField
            label="Instance ref"
            displayValue={data.instanceRef}
            copyValue={extractIdFromUrn(data.instanceRef)}
          />

          <Divider className={styles.resultDivider} />

          <Paragraph>
            <strong>Party:</strong> {data.party}
          </Paragraph>
          <Divider className={styles.resultDivider} />

          <Paragraph>
            <strong>Tittel:</strong> {title}
          </Paragraph>

          <Divider className={styles.resultDivider} />

          <Paragraph>
            <strong>Tjenesteressurs:</strong>{" "}
            {resourceName
              ? `${resourceName} (${data.serviceResource.id})`
              : data.serviceResource.id}
          </Paragraph>

          <Divider className={styles.resultDivider} />

          <Paragraph>
            <strong>Tjenesteeier:</strong>{" "}
            {ownerName
              ? `${ownerName} — ${data.serviceOwner.code} (${data.serviceOwner.orgNumber})`
              : `${data.serviceOwner.code} (${data.serviceOwner.orgNumber})`}
          </Paragraph>
        </Card>
      )}
    </div>
  );
};

export default DialogLookupPage;
