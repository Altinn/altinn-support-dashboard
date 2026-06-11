import { useEffect } from "react";
import { useResourceSearch } from "../../hooks/hooks";
import { ResourceSearchResult } from "../../models/resourceModels";
import { useAppStore } from "../../stores/Appstore";
import { showPopup } from "../Popup";
import { Alert, Heading, Skeleton } from "@digdir/designsystemet-react";
import { ResourceSearchCard } from "./ResourceSearchCard";
import classes from "./styles/ResourceSearchList.module.css"



interface ResourceSearchListProps {
    selectedResource: ResourceSearchResult | null;
    setSelectedResource: (resource: ResourceSearchResult) => void;
    query: string;
}

export const ResourceSearchList: React.FC<ResourceSearchListProps> = ({
    selectedResource,
    setSelectedResource,
    query,
}) => {
    const environment = useAppStore((state) => state.environment);
    const { resourceQuery } = useResourceSearch(environment, query);
    const resources = resourceQuery.data ?? [];

    useEffect(() => {
        if (resourceQuery.isError) {
            const errorMessage = 
                resourceQuery.error?.message ?? "Ukjent feil oppstod";
            showPopup(errorMessage, "error");
        }
    }, [resourceQuery.isError, resourceQuery.error]);

    if (resourceQuery.isLoading) {
        return (
            <div role="progressbar">
                <Skeleton variant="rectangle" height={300} />
            </div>
        );
    }

    if (resources.length === 0 && query.length > 0) {
        return(
            <Alert data-color="info">
                <Heading level={6}>Ingen ressurser funnet</Heading>
            </Alert>
        );
    }

    return (
        <div className={classes.container}>
            {resources.map((resource) => (
                <ResourceSearchCard
                    key = {resource.identifier}
                    resource = {resource}
                    selectedResource={selectedResource}
                    setSelectedResource={setSelectedResource}
                />
            ))}
        </div>
    )
}