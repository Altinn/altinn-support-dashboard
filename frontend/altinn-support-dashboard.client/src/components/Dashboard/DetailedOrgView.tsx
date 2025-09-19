import React, { useState, useEffect } from "react";
import { Alert, Typography, Box } from "@mui/material";

import {
  MainContentProps,
  OfficialContact,
  SortDirection,
  PersonalContact,
} from "./models/mainContentTypes";
import authorizedFetch from "./hooks/useAuthorizedFetch";
import {
  filterContacts,
  sortContacts,
  sortERRoles,
} from "./utils/contactUtils";
import { ERRolesSortField } from "./models/mainContentTypes";
import { getBaseUrl } from "../../utils/utils";
import { useAppStore } from "../../hooks/Appstore";
import SearchContactsBar from "./contacts/ContactsSearchBar";
import { ContactsTable } from "./contacts/ContactsTable";
import OfficialContactFieldTable from "./contacts/NotificationContactTable";
import ERRolesTable from "./ERRolesTable";
import { RoleDetails } from "./RoleDetails";

const DetailedOrgView: React.FC<MainContentProps> = ({
  organizations,
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
  const [sortField, setSortField] = useState<keyof PersonalContact | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);
  const [erRoleSortField, setERRoleSortField] =
    useState<ERRolesSortField>(null);
  const [erRoleSortDirection, setERRoleSortDirection] =
    useState<SortDirection>(undefined);
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
  }, [selectedOrg]);

  // Reset role view when new search results come in
  useEffect(() => {
    setIsRoleView(false);
    setShowOrgList(true);
    setSelectedContact(null);
    setRoleInfo([]);
    setRoleViewError(null);
  }, [organizations]);

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

  const handleSort = (field: keyof PersonalContact) => {
    if (field === sortField) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(undefined);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleERRoleSort = (field: ERRolesSortField) => {
    if (field === erRoleSortField) {
      if (erRoleSortDirection === "asc") {
        setERRoleSortDirection("desc");
      } else if (erRoleSortDirection === "desc") {
        setERRoleSortField(null);
        setERRoleSortDirection(undefined);
      } else {
        setERRoleSortDirection("asc");
      }
    } else {
      setERRoleSortField(field);
      setERRoleSortDirection("asc");
    }
  };

  const filteredContacts = filterContacts(moreInfo || [], searchQuery);
  const sortedContacts = sortContacts(
    filteredContacts,
    sortField,
    sortDirection,
  );

  const flatERRoles =
    rolesInfo
      ?.flatMap((roleGroup) =>
        roleGroup?.roller?.map((role) => ({
          ...role,
          sistEndret: roleGroup.sistEndret,
          // Use the role's own type instead of the group type
          type: role.type || roleGroup.type,
          enhet: role.enhet,
          person: role.person,
          fratraadt: role.fratraadt,
          // Store the group type for reference if needed
          groupType: roleGroup.type,
        })),
      )
      .filter(Boolean) || [];
  const sortedERRoles = sortERRoles(
    flatERRoles,
    erRoleSortField,
    erRoleSortDirection,
  );

  const handleClearSearch = () => {
    setSearchQuery("");
    setSortField(null);
    setSortDirection(undefined);
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
              <SearchContactsBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleClearSearch={handleClearSearch}
              />

              <ContactsTable
                sortedContacts={sortedContacts}
                sortField={sortField}
                sortDirection={sortDirection}
                searchQuery={searchQuery}
                selectedOrg={selectedOrg}
                handleSort={handleSort}
                handleViewRoles={handleViewRoles}
                setSelectedContact={setSelectedContact}
              />

              <Typography variant="h6" gutterBottom>
                Varslingsadresser for virksomheten
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mb: 2,
                  "& .MuiTableContainer-root": {
                    flex: 1,
                    maxWidth: "calc(50% - 1.5rem)",
                  },
                  "& .MuiTableCell-root": {
                    padding: "8px 16px",
                  },
                }}
              >
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
              <ERRolesTable
                sortedERRoles={sortedERRoles}
                erRoleSortField={erRoleSortField}
                erRoleSortDirection={erRoleSortDirection}
                handleERRoleSort={handleERRoleSort}
              />

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
