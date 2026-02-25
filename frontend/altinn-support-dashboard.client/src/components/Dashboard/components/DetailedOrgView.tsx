import React, { useState, useEffect } from "react";
import { Heading } from "@digdir/designsystemet-react";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";
import ContactsSearchBar from "./contacts/ContactsSearchBar";
import ContactsTable from "./contacts/ContactsTable";
import { useOrgDetails } from "../../../hooks/hooks";
import { Organization, PersonalContactAltinn3 } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";
import { Card } from "@digdir/designsystemet-react";
import styles from "../styles/DetailedOrgView.module.css";
import NotificationContactTable from "./contacts/NotificationContactTable";

interface DetailedOrgViewProps {
  selectedOrg: Organization | null;
}

const DetailedOrgView: React.FC<DetailedOrgViewProps> = ({ selectedOrg }) => {
  const environment = useAppStore((state) => state.environment);
  const [selectedContact, setSelectedContact] =
    useState<PersonalContactAltinn3 | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { notificationAdressesQuery } = useOrgDetails(
    environment,
    selectedOrg?.organizationNumber,
  );
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedContact(null);
  };

  useEffect(() => {
    handleClearSearch();
  }, [selectedOrg]);

  return (
    <div className={styles.container}>
      {selectedOrg && (
        <div
          className={`${styles.orgDetails} ${selectedContact ? "full-width" : ""}`}
        >
          <Heading className={styles.orgInformation}>
            <span>Org Nr: {selectedOrg.organizationNumber}</span>
            <span>Type: {selectedOrg.unitType}</span>
            <span>IsDeleted: {selectedOrg.isDeleted ? "true" : "false"}</span>
          </Heading>
          <Heading className={styles.orgName}>{selectedOrg.name}</Heading>

          {!selectedContact ? (
            <>
              <ContactsSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleClearSearch={handleClearSearch}
              />

              <ContactsTable
                searchQuery={searchQuery}
                selectedOrg={selectedOrg}
                setSelectedContact={setSelectedContact}
              />

              <Card
                data-color="neutral"
                className={styles.officialContactContainer}
              >
                <Heading level={6}>Varslingsadresser for virksomheten</Heading>
                <div className={styles.officialContactBottom}>
                  <NotificationContactTable
                    title="Mobilnummer"
                    field="phone"
                    changedField="lastChanged"
                    contacts={notificationAdressesQuery.data ?? []}
                  />
                  <NotificationContactTable
                    title="E-post"
                    field="email"
                    changedField="lastChanged"
                    contacts={notificationAdressesQuery.data ?? []}
                  />
                </div>
              </Card>

              <ERRolesTable selectedOrg={selectedOrg} />
            </>
          ) : (
            <RoleDetails
              selectedContact={selectedContact}
              organizationNumber={selectedOrg.OrganizationNumber}
              onBack={() => {
                setSelectedContact(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DetailedOrgView;
