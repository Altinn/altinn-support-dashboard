import React, { useState, useEffect } from "react";
import { Heading } from "@digdir/designsystemet-react";
import { PersonalContact } from "../models/mainContentTypes";
import OfficialContactFieldTable from "./contacts/NotificationContactTable";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";
import ContactsSearchBar from "./contacts/ContactsSearchBar";
import ContactsTable from "./contacts/ContactsTable";
import { useOrgDetails } from "../../../hooks/hooks";
import { SelectedOrg } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";
import {
  Card
} from "@digdir/designsystemet-react";
import styles from "../styles/DetailedOrgView.module.css";                                   

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
          <Heading className={styles["OrgNumber"]}>
            Org Nr: {selectedOrg.OrganizationNumber}
          </Heading>
          <Heading className={styles["OrgName"]}>
            {selectedOrg.Name}
          </Heading>

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

              <Heading>
                Varslingsadresser for virksomheten
              </Heading>
              <Card className={styles["OfficialContactContainer"]} >
                <OfficialContactFieldTable
                  title="Mobilnummer"
                  field="MobileNumber"
                  changedField="MobileNumberChanged"
                  contacts={officialContactsQuery.data ?? []}
                />

                <OfficialContactFieldTable
                  title="E-post"
                  field="EMailAddress"
                  changedField="EMailAddressChanged"
                  contacts={officialContactsQuery.data ?? []}
                />
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
