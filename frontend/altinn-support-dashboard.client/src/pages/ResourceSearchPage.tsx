import { Heading } from "@digdir/designsystemet-react"
import {ResourceSearchSearchBar} from "../components/ResourceSearch/ResourceSearchSearchBar";
import { ResourceSearchList } from "../components/ResourceSearch/ResourceSearchList";
import styles from "./styles/ResourceSearchPage.module.css"
import ResourceSearchDetailedView from "../components/ResourceSearch/ResourceSearchDetailedView";
import { useResourceSearchStore } from "../stores/ResourceSearchStore";


export const ResourceSearchPage = () => {
  const query = useResourceSearchStore((s) => s.query);
  const selectedResource = useResourceSearchStore((s) => s.selectedResource);
  const setSelectedResource = useResourceSearchStore((s) => s.setSelectedResource);
  const onlyDelegable = useResourceSearchStore((s) => s.onlyDelegable);
  const onlyVisible = useResourceSearchStore((s) => s.onlyVisible);
  const onlyAltinnApp = useResourceSearchStore((s) => s.onlyAltinnApp);

  return (
    <div className={styles.pageContainer}>
      <Heading level={1} data-size="sm">
        Søk etter ressurser
      </Heading>
      <ResourceSearchSearchBar />
      <div className={styles.mainContainer}>
        <div className={styles.listContainer}>
          <ResourceSearchList
            query={query}
            selectedResource={selectedResource}
            setSelectedResource={setSelectedResource}
            onlyDelegable={onlyDelegable}
            onlyVisible={onlyVisible}
            onlyAltinnApp={onlyAltinnApp}
          />
        </div>
        <div className={styles.detailedContainer}>
            <ResourceSearchDetailedView selectedResource={selectedResource} />
        </div>
      </div>
    </div>
  );
};