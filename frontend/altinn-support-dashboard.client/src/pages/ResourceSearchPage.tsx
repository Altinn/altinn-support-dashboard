import { Heading } from "@digdir/designsystemet-react"
import {ResourceSearchSearchBar} from "../components/ResourceSearch/ResourceSearchSearchBar";
import { ResourceSearchList } from "../components/ResourceSearch/ResourceSearchList";
import styles from "./styles/ResourceSearchPage.module.css"
import ResourceSearchDetailedView from "../components/ResourceSearch/ResourceSearchDetailedView";
import { useAppStore } from "../stores/Appstore";
import { useEffect, useRef, useState } from "react";
import { ResourceSearchResult } from "../models/resourceModels";


export const ResourceSearchPage = () => {
  const environment = useAppStore((s) => s.environment);

  const [query, setQuery] = useState(
    () => sessionStorage.getItem("resource_search_query" ) || ""
  );
  const [selectedResource, setSelectedResource] = useState<ResourceSearchResult | null>(
    () => {
      const saved = sessionStorage.getItem("resource_search_selectedResource");
      return saved ? JSON.parse(saved) : null;
    }
  );
  const [onlyDelegable, setOnlyDelegable] = useState(
    () => sessionStorage.getItem("resource_search_onlyDelegable") === "true"
  );
  const [onlyVisible, setOnlyVisible] = useState(
    () => sessionStorage.getItem("resource_search_onlyVisble") === "true"
  );
  const [onlyAltinnApp, setOnlyAltinnApp] = useState(
    () => sessionStorage.getItem("resource_search_onlyAltinnApp") === "true"
  );

  useEffect(() => {
    sessionStorage.setItem("resource_search_query", query);
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem("resource_search_selectedResource", JSON.stringify(selectedResource));
  }, [selectedResource])

  useEffect(() => {
    sessionStorage.setItem("resource_search_onlyDelegable", String(onlyDelegable));
  }, [onlyDelegable]);

  useEffect(() => {
    sessionStorage.setItem("resource_search_onlyVisibile", String(onlyVisible));
  }, [onlyVisible]);

  useEffect(() => {
    sessionStorage.setItem("resource_search_onlyAltinnApp", String(onlyAltinnApp));
  }, [onlyAltinnApp]);

  //Resets on environment shift
  const prevEnvironmentRef = useRef(environment);
  useEffect(() => {
    if (prevEnvironmentRef.current !== environment) {
      setSelectedResource(null);
    }
    prevEnvironmentRef.current = environment
  }, [environment])

  return (
    <div className={styles.pageContainer}>
      <Heading level={1} data-size="sm">
        Søk etter ressurser
      </Heading>
      <ResourceSearchSearchBar 
        query = {query}
        setQuery={setQuery}
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