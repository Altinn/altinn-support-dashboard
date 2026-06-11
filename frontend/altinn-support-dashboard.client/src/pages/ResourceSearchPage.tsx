import { Heading } from "@digdir/designsystemet-react"
import { useState } from "react"
import { ResourceSearchResult } from "../models/resourceModels";
import {ResourceSearchSearchBar} from "../components/ResourceSearch/ResourceSearchSearchBar";
import { ResourceSearchList } from "../components/ResourceSearch/ResourceSearchList";







export const ResourceSearchPage = () => {
    const [query, setQuery] = useState("");
    const [selectedResource, setSelectedResource] =
        useState<ResourceSearchResult | null>(null)
    return (
        <div>
            <Heading level={1} data-size="sm">
                Søk etter ressurser
            </Heading>
            <ResourceSearchSearchBar query={query} setQuery={(setQuery)} setSelectedResource={setSelectedResource} />
            <ResourceSearchList
                query={query}
                selectedResource={selectedResource}
                setSelectedResource={setSelectedResource}
            />
        </div>
    )
}