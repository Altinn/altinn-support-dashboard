import { Box } from "@mui/material";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import DetailedOrgView from "../components/Dashboard/components/DetailedOrgView";
import { OrganizationList } from "../components/Dashboard/components/organizations/OrganizationList";
import { useDashboardStore } from "../stores/DashboardStore";
import {
  dashboardContainer,
  orgListBox,
  detailedOrgBox,
} from "./styles/DashboardPage.styles";

export const DashboardPage: React.FC = () => {
  const query = useDashboardStore((s) => s.query);
  const setQuery = useDashboardStore((s) => s.setQuery);
  const selectedOrg = useDashboardStore((s) => s.selectedOrg);
  const setSelectedOrg = useDashboardStore((s) => s.setSelectedOrg);

  return (
    <Box>
      <SearchComponent query={query} setQuery={setQuery} />

      <Box sx={dashboardContainer}>
        <Box sx={orgListBox}>
          <OrganizationList setSelectedOrg={setSelectedOrg} query={query} />
        </Box>

        <Box sx={detailedOrgBox}>
          <DetailedOrgView selectedOrg={selectedOrg} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
