import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

import { PersonalContact } from "../models/mainContentTypes";
import OfficialContactFieldTable from "./contacts/NotificationContactTable";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";
import ContactsSearchBar from "./contacts/ContactsSearchBar";
import { officialContactsBoxStyle } from "../styles/DetailedOrgView.styles";
import ContactsTable from "./contacts/ContactsTable";
import { useOrgDetails } from "../../../hooks/hooks";
import { SelectedOrg } from "../../../models/models";
import { useAppStore } from "../../../stores/Appstore";

interface DetailedOrgViewProps {
  selectedOrg: SelectedOrg;
  query: string;
}

const DetailedOrgView: React.FC<DetailedOrgViewProps> = ({ selectedOrg, query }) => {
  const environment = useAppStore((state) => state.environment);
  const [selectedContact, setSelectedContact] =
    useState<PersonalContact | null>(null);
  const [isRoleView, setIsRoleView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { officialContactsQuery } = useOrgDetails(
    environment,
    selectedOrg?.OrganizationNumber,
  );
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedContact(null);
    setIsRoleView(false);
  };

  useEffect(() => {
    handleClearSearch();
  }, [selectedOrg]);

  useEffect(() => {
    if (selectedContact != null) {
      setIsRoleView(true);
    }
  }, [selectedContact]);

  return (
    <div className="results-section">
      {selectedOrg && (
        <div className={`org-details ${isRoleView ? "full-width" : ""}`}>
          <Typography variant="subtitle1" gutterBottom>
            Org Nr: {selectedOrg.OrganizationNumber}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {selectedOrg.Name}
          </Typography>

          {!isRoleView ? (
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
                userInput={query}
              />

              <Typography variant="h6" gutterBottom>
                Varslingsadresser for virksomheten
              </Typography>
              <Box sx={officialContactsBoxStyle}>
                <OfficialContactFieldTable
                  title="Mobilnummer"
                  field="MobileNumber"
                  changedField="MobileNumberChanged"
                  contacts={officialContactsQuery.data}
                  userInput={query} 
                />

                <OfficialContactFieldTable
                  title="E-post"
                  field="EMailAddress"
                  changedField="EMailAddressChanged"
                  contacts={officialContactsQuery.data}
                  userInput={query} 
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                ER-roller
              </Typography>
              <ERRolesTable selectedOrg={selectedOrg} />
            </>
          ) : (
            <RoleDetails
              selectedContact={selectedContact}
              organizationNumber={selectedOrg.OrganizationNumber}
              onBack={() => {
                setIsRoleView(false);
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
