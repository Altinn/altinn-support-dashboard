import React, { useState, useEffect } from "react";
import { Heading } from "@digdir/designsystemet-react";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";
import ContactsSearchBar from "./contacts/ContactsSearchBar";
import ContactsTable from "./contacts/ContactsTable";
import { useOrgDetails } from "../../../hooks/hooks";
import { PersonalContact, SelectedOrg } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";
import { Card } from "@digdir/designsystemet-react";
import styles from "../styles/DetailedOrgView.module.css";
import NotificationContactTable from "./contacts/NotificationContactTable";

interface DetailedOrgViewProps {
  selectedOrg: SelectedOrg;
}

const DetailedOrgView: React.FC<DetailedOrgViewProps> = ({ selectedOrg }) => {
  const environment = useAppStore((state) => state.environment);
  const [selectedContact, setSelectedContact] =
    useState<PersonalContact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { officialContactsQuery } = useOrgDetails(
    environment,
    selectedOrg?.OrganizationNumber,
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
          <Heading className={styles.orgNumer}>
            Org Nr: {selectedOrg.OrganizationNumber}
          </Heading>
          <Heading className={styles.orgName}>{selectedOrg.Name}</Heading>

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
                <div className={styles.OfficialContactBottom}>
                  <NotificationContactTable
                    title="mobilnummer"
                    field="mobileNumber"
                    changedField="mobileNumberChanged"
                    contacts={officialContactsQuery.data ?? []}
                  />
                  <NotificationContactTable
                    title="E-post"
                    field="eMailAddress"
                    changedField="eMailAddressChanged"
                    contacts={officialContactsQuery.data ?? []}
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
