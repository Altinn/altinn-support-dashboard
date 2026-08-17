import { Heading } from "@digdir/designsystemet-react"
import {ResourceSearchSearchBar} from "../components/ResourceSearch/ResourceSearchSearchBar";
import { ResourceSearchList } from "../components/ResourceSearch/ResourceSearchList";
import styles from "./styles/ResourceSearchPage.module.css"
import ResourceSearchDetailedView from "../components/ResourceSearch/ResourceSearchDetailedView";
import { useResourceSearchStore } from "../stores/ResourceSearchStore";


export const ResourceSearchPage = () => {
  const query = useResourceSearchStore((s) => s.query);
  const setQuery = useResourceSearchStore((s) => s.setQuery);
  const textFieldValue = useResourceSearchStore((s) => s.textFieldValue);
  const setTextFieldValue = useResourceSearchStore((s) => s.setTextFieldValue);
  const selectedResource = useResourceSearchStore((s) => s.selectedResource);
  const setSelectedResource = useResourceSearchStore((s) => s.setSelectedResource);
  const onlyDelegable = useResourceSearchStore((s) => s.onlyDelegable);
  const setOnlyDelegable = useResourceSearchStore((s) => s.setOnlyDelegable);
  const onlyVisible = useResourceSearchStore((s) => s.onlyVisible);
  const setOnlyVisible = useResourceSearchStore((s) => s.setOnlyVisible);
  const onlyAltinnApp = useResourceSearchStore((s) => s.onlyAltinnApp);
  const setOnlyAltinnApp = useResourceSearchStore((s) => s.setOnlyAltinnApp);

  return (
    <div className={styles.pageContainer}>
      <Heading level={1} data-size="sm">
        Søk etter ressurser
      </Heading>
      <ResourceSearchSearchBar
        query={query}
        setQuery={setQuery}
        textFieldValue={textFieldValue}
        setTextFieldValue={setTextFieldValue}
        setSelectedResource={setSelectedResource}
        onlyDelegable={onlyDelegable}
        setOnlyDelegable={setOnlyDelegable}
        onlyVisible={onlyVisible}
        setOnlyVisible={setOnlyVisible}
        onlyAltinnApp={onlyAltinnApp}
        setOnlyAltinnApp={setOnlyAltinnApp}
      />
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