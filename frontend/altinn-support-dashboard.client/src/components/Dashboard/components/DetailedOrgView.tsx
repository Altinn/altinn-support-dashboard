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

const DetailedOrgView: React.FC<MainContentProps> = ({
  selectedOrg,
  moreInfo,
  rolesInfo,
}) => {
  const [selectedContact, setSelectedContact] =
    useState<PersonalContact | null>(null);
  const [roleInfo, setRoleInfo] = useState<any[]>([]);
  const [isRoleView, setIsRoleView] = useState(false);
  const [showOrgList, setShowOrgList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleViewError, setRoleViewError] = useState<string | null>(null);
  const [officialContacts, setOfficialContacts] = useState<OfficialContact[]>(
    [],
  );
  const [officialContactsError, setOfficialContactsError] = useState<
    string | null
  >(null);

  const environment = useAppStore((state) => state.environment);
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
      setShowOrgList(false);
      setRoleViewError(null);
    } catch (error) {
      setRoleViewError("Roller kunne ikke hentes.");
      setRoleInfo([]);
    }
  };

  useEffect(() => {
    setSearchQuery("");
    setIsRoleView(false);
    setShowOrgList(true);
    setSelectedContact(null);
    setRoleInfo([]);
    setRoleViewError(null);
  }, [selectedOrg]);

  useEffect(() => {
    const fetchOfficialContacts = async () => {
      if (!selectedOrg) return;
      try {
        const res = await authorizedFetch(
          `${baseUrl}/serviceowner/organizations/${selectedOrg.OrganizationNumber}/officialcontacts`,
        );
        const data = await res.json();
        setOfficialContacts(Array.isArray(data) ? data : [data]);
        setOfficialContactsError(null);
      } catch (error) {
        setOfficialContactsError("Offisielle kontakter kunne ikke hentes.");
        setOfficialContacts([]);
      }
    };
    fetchOfficialContacts();
  }, [selectedOrg, baseUrl]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedContact(null);
    setIsRoleView(false);
    setRoleViewError(null);
  };

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
                moreInfo={moreInfo}
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
                  contacts={officialContacts}
                />

                <OfficialContactFieldTable
                  title="E-post"
                  field="EMailAddress"
                  changedField="EMailAddressChanged"
                  contacts={officialContacts}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                ER-roller
              </Typography>
              <ERRolesTable rolesInfo={rolesInfo} />

              {officialContactsError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {officialContactsError}
                </Alert>
              )}
            </>
          ) : (
            <RoleDetails
              selectedContactName={selectedContact?.name}
              roleInfo={roleInfo}
              roleViewError={roleViewError}
              onBack={() => {
                setIsRoleView(false);
                setShowOrgList(true);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DetailedOrgView;
