import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import DetailedOrgView from "../components/Dashboard/components/DetailedOrgView";
import { OrganizationList } from "../components/Dashboard/components/organizations/OrganizationList";
import { useDashboardStore } from "../stores/DashboardStore";
import styles from "./styles/DashboardPage.module.css";

export const DashboardPage: React.FC = () => {
  const query = useDashboardStore((s) => s.query);
  const setQuery = useDashboardStore((s) => s.setQuery);
  const selectedOrg = useDashboardStore((s) => s.selectedOrg);
  const setSelectedOrg = useDashboardStore((s) => s.setSelectedOrg);

  return (
    <div className={styles["dashboard-page-container"]}>
      <SearchComponent query={query} setQuery={setQuery} />

      <div className={styles["dashboard-container"]}>
        <div className={styles["org-list-container"]}>
          <OrganizationList
            setSelectedOrg={setSelectedOrg}
            selectedOrg={selectedOrg}
            query={query}
          />
        </div>

        <div className={styles["detailed-org-container"]}>
          <DetailedOrgView selectedOrg={selectedOrg} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
