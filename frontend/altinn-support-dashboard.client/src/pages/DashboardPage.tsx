import MainContentComponent from "../components/MainContent/MainContentComponent";
import SearchComponent from "../components/TopSearchBar/TopSearchBarComponent";
import { useAppStore } from "../hooks/Appstore";
import { useDarkMode, useOrganizationSearch } from "../hooks/hooks";
import { getBaseUrl } from "../utils/utils";

export const DashboardPage: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const { isDarkMode } = useDarkMode();

  const {
    query,
    setQuery,
    organizations,
    subUnits,
    selectedOrg,
    moreInfo,
    rolesInfo,
    expandedOrg,
    error,
    erRolesError,
    isLoading,
    hasSearched,
    handleSearch,
    handleSelectOrg,
    handleExpandToggle,
  } = useOrganizationSearch(environment);

  return (
    <div>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        isDarkMode={isDarkMode}
      />
      <MainContentComponent
        baseUrl={getBaseUrl(environment)}
        isLoading={isLoading}
        organizations={organizations}
        subUnits={subUnits}
        selectedOrg={selectedOrg}
        moreInfo={moreInfo}
        rolesInfo={rolesInfo}
        expandedOrg={expandedOrg}
        handleSelectOrg={handleSelectOrg}
        handleExpandToggle={handleExpandToggle}
        error={error}
        erRolesError={erRolesError}
        query={query}
        hasSearched={hasSearched}
      />
    </div>
  );
};
