import React from "react";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import DetailedOrgView from "../components/Dashboard/components/DetailedOrgView";
import DetailedUserView from "../components/Dashboard/components/DetailedUserView";
import { CardList } from "../components/Dashboard/components/organizations/CardList";
import { useDashboardStore } from "../stores/DashboardStore";
import { Button } from "@digdir/designsystemet-react";
import InformationDialogBox from "../components/InformationDialog/InformationDialogBox";
import { InformationIcon } from "@navikt/aksel-icons";
import { isUserContactInfo } from "../models/models";
import styles from "./styles/DashboardPage.module.css";
export const DashboardPage: React.FC = () => {
  const query = useDashboardStore((s) => s.query);
  const setQuery = useDashboardStore((s) => s.setQuery);
  const selectedCard = useDashboardStore((s) => s.selectedCard);
  const setSelectedCard = useDashboardStore((s) => s.setSelectedCard);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  return (
    <div className={styles["dashboard-page-container"]}>
      <Button
        onClick={() => dialogRef.current?.showModal()}
        className={styles.infoButton}
        variant="secondary"
        data-testid="info-button"
      >
        <InformationIcon />
      </Button>
      <InformationDialogBox dialogRef={dialogRef} />
      <SearchComponent
        query={query}
        setQuery={setQuery}
        setSelectedCard={setSelectedCard}
      />
      <div className={styles["dashboard-container"]}>
        <div className={styles["org-list-container"]}>
          <CardList
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
            query={query}
          />
        </div>

        <div></div>
        <div className={styles["detailed-org-container"]}>
          {isUserContactInfo(selectedCard) ? (
            <DetailedUserView selectedUser={selectedCard} />
          ) : (
            <DetailedOrgView selectedOrg={selectedCard} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
