import { useState } from "react";
import {
  Button,
  Heading,
  Spinner,
  Textfield,
} from "@digdir/designsystemet-react";
import { DownloadIcon } from "@navikt/aksel-icons";
import styles from "./styles/LegalRequestTestPage.module.css";
import { useAppStore } from "../stores/Appstore";
import { useLegalRequestExport } from "../hooks/hooks";

export const LegalRequestTestPage = () => {
  const environment = useAppStore((state) => state.environment);
  const exportMutation = useLegalRequestExport();
  const [nationalIdentityNumber, setNationalIdentityNumber] = useState("");
  const [organizationNumber, setOrganizationNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [caseReference, setCaseReference] = useState("");

  const canDownload =
    !!nationalIdentityNumber && !!from && !!to && !!caseReference.trim();

  const handleDownload = () => {
    exportMutation.mutate({
      environment,
      request: {
        nationalIdentityNumber: nationalIdentityNumber.trim(),
        organizationNumber: organizationNumber.trim() || undefined,
        from: `${from}T00:00:00Z`,
        to: `${to}T00:00:00Z`,
        caseReference: caseReference.trim(),
      },
    });
  };

  return (
    <div>
      <Heading>Rettslig pålegg (test)</Heading>

      <div className={styles.form}>
        <Textfield
          label="Fødselsnummer"
          value={nationalIdentityNumber}
          onChange={(e) => setNationalIdentityNumber(e.target.value)}
        />
        <Textfield
          label="Organisasjonsnummer"
          description="Valgfritt. Uten organisasjonsnummer hentes kun personlige data."
          value={organizationNumber}
          onChange={(e) => setOrganizationNumber(e.target.value)}
        />
        <div className={styles.dateRow}>
          <Textfield
            label="Fra (UTC)"
            type="date"
            max={to || undefined}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Textfield
            label="Til (UTC, ikke inkludert)"
            type="date"
            min={from || undefined}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <Textfield
          label="Saksreferanse"
          value={caseReference}
          onChange={(e) => setCaseReference(e.target.value)}
        />
        <Button
          onClick={handleDownload}
          disabled={!canDownload || exportMutation.isPending}
          className={styles.downloadButton}
        >
          {exportMutation.isPending ? (
            <Spinner aria-label="Laster" data-size="sm" />
          ) : (
            <DownloadIcon aria-hidden />
          )}
          Last ned Excel
        </Button>
      </div>
    </div>
  );
};
