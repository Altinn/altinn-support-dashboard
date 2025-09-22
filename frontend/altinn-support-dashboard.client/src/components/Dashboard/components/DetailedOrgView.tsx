import React, { useState, useEffect } from "react";
import { Alert, Typography, Box } from "@mui/material";

import {
  MainContentProps,
  OfficialContact,
  PersonalContact,
} from "../models/mainContentTypes";
import authorizedFetch from "../hooks/useAuthorizedFetch";
import { getBaseUrl } from "../../../utils/utils";
import { useAppStore } from "../../../hooks/Appstore";
import OfficialContactFieldTable from "./contacts/NotificationContactTable";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";
import ContactsSearchBar from "./contacts/ContactsSearchBar";
import { officialContactsBoxStyle } from "../styles/DetailedOrgView.styles";
import ContactsTable from "./contacts/ContactsTable";
import { useOrgDetails } from "../../../hooks/hooks";

const DetailedOrgView: React.FC<MainContentProps> = ({ selectedOrg }) => {
  const environment = useAppStore((state) => state.environment);
  const [selectedContact, setSelectedContact] =
    useState<PersonalContact | null>(null);
  const [roleInfo, setRoleInfo] = useState<any[]>([]);
  const [isRoleView, setIsRoleView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { officialContactsQuery } = useOrgDetails(
    environment,
    selectedOrg?.OrganizationNumber,
  );

  const baseUrl = getBaseUrl(environment);

  const handleViewRoles = async (subject: string, reportee: string) => {
    try {
      const res = await authorizedFetch(
        `${baseUrl}/serviceowner/${subject}/roles/${reportee}`,
      );
      const data = await res.json();
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      setRoleInfo(parsedData);
      setIsRoleView(true);
    } catch (error) {
      setRoleInfo([]);
    }
  };

  useEffect(() => {
    console.log("dette");
    console.log(selectedOrg?.OrganizationNumber);
    setSearchQuery("");
    setIsRoleView(false);
    setSelectedContact(null);
    setRoleInfo([]);
  }, [selectedOrg]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedContact(null);
    setIsRoleView(false);
  };

  return (
    <div className="results-section">
      {selectedOrg && (
        <div className={`org-details ${isRoleView ? "full-width" : ""}`}>
          <Typography variant="subtitle1" gutterBottom>
            Org Nr: {selectedOrg.OrganizationNumber}
          </Typography>
          <Typography variant="h4" gutterBottom></Typography>

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
                handleViewRoles={handleViewRoles}
                setSelectedContact={setSelectedContact}
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
                />

                <OfficialContactFieldTable
                  title="E-post"
                  field="EMailAddress"
                  changedField="EMailAddressChanged"
                  contacts={officialContactsQuery.data}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                ER-roller
              </Typography>
              <ERRolesTable />
            </>
          ) : (
            <RoleDetails
              selectedContactName={selectedContact?.name}
              roleInfo={roleInfo}
              onBack={() => {
                setIsRoleView(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DetailedOrgView;
