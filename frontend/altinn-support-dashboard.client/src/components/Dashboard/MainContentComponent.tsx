import React, { useState, useEffect } from "react";
import {
  Button,
  Alert,
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

import {
  MainContentProps,
  OfficialContact,
  SortDirection,
  PersonalContact,
} from "./models/mainContentTypes";
import authorizedFetch from "./hooks/useAuthorizedFetch";
import { formatDate } from "./utils/dateUtils";
import {
  filterContacts,
  sortContacts,
  sortERRoles,
} from "./utils/contactUtils";
import { ERRolesSortField } from "./models/mainContentTypes";
import { getBaseUrl } from "../../utils/utils";
import { useAppStore } from "../../hooks/Appstore";
import SearchContactsBar from "./ContactsSearchBar";
import { ContactsTable } from "./ContactsTable";
import OfficialContactFieldTable, {
  ContactFieldTable,
} from "./NotificationContactTable";

const MainContentComponent: React.FC<MainContentProps> = ({
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
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <MuiTable>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sortDirection={
                          erRoleSortField === "type"
                            ? erRoleSortDirection
                            : false
                        }
                        onClick={() => handleERRoleSort("type")}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography variant="subtitle1">Rolletype</Typography>
                      </TableCell>
                      <TableCell
                        sortDirection={
                          erRoleSortField === "person"
                            ? erRoleSortDirection
                            : false
                        }
                        onClick={() => handleERRoleSort("person")}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography variant="subtitle1">
                          Person/Virksomhet
                        </Typography>
                      </TableCell>
                      <TableCell
                        sortDirection={
                          erRoleSortField === "sistEndret"
                            ? erRoleSortDirection
                            : false
                        }
                        onClick={() => handleERRoleSort("sistEndret")}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography variant="subtitle1">Dato Endret</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">Status</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedERRoles && sortedERRoles.length > 0 ? (
                      sortedERRoles.map((role, index) => (
                        <TableRow key={index}>
                          <TableCell>{role.type?.beskrivelse || ""}</TableCell>
                          <TableCell>
                            {role.person
                              ? `${role.person?.navn?.fornavn || ""} ${role.person?.navn?.etternavn || ""}`.trim()
                              : role.enhet
                                ? `${role.enhet.navn?.[0] || ""} (${role.enhet.organisasjonsnummer})`
                                : ""}
                          </TableCell>
                          <TableCell>{formatDate(role.sistEndret)}</TableCell>
                          <TableCell>
                            {role.fratraadt ? "Fratrådt" : "Aktiv"}
                            {role.person?.erDoed ? " (Død)" : ""}
                            {role.enhet?.erSlettet ? " (Slettet)" : ""}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                          >
                            Ingen roller funnet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </MuiTable>
              </TableContainer>

              {officialContactsError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {officialContactsError}
                </Alert>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Roller knyttet til {selectedContact?.name}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsRoleView(false);
                  setShowOrgList(true);
                }}
                sx={{ mb: 2 }}
              >
                Tilbake til oversikt
              </Button>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <MuiTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1">Rolletype</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">Rollenavn</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roleInfo && roleInfo.length > 0 ? (
                      roleInfo.map((role, index) => (
                        <TableRow key={index}>
                          <TableCell>{role.RoleType}</TableCell>
                          <TableCell>{role.RoleName}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                          >
                            Ingen roller funnet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </MuiTable>
              </TableContainer>
              {roleViewError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {roleViewError}
                </Alert>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MainContentComponent;
