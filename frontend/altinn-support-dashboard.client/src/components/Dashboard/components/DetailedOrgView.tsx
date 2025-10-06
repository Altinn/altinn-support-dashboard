import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

import { PersonalContact } from "../models/mainContentTypes";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";
import ContactsSearchBar from "./contacts/ContactsSearchBar";
import ContactsTable from "./contacts/ContactsTable";
import { useOrgDetails } from "../../../hooks/hooks";
import { SelectedOrg } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";
import { Card, Heading } from "@digdir/designsystemet-react";
import styles from "../styles/DetailedOrgViewConatiner.module.css";
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
    <div className="results-section">
      {selectedOrg && (
        <div className={`org-details ${selectedContact ? "full-width" : ""}`}>
          <Typography variant="subtitle1" gutterBottom>
            Org Nr: {selectedOrg.OrganizationNumber}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {selectedOrg.Name}
          </Typography>

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
                className={styles.OfficialContactContainer}
              >
                <Heading level={6}>Varslingsadresser for virksomheten</Heading>
                <div className={styles.OfficialContactBottom}>
                  <NotificationContactTable
                    title="Mobilnummer"
                    field="MobileNumber"
                    changedField="MobileNumberChanged"
                    contacts={officialContactsQuery.data ?? []}
                  />
                  <NotificationContactTable
                    title="E-post"
                    field="EMailAddress"
                    changedField="EMailAddressChanged"
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
