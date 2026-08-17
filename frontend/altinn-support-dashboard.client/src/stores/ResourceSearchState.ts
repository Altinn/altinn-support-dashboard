import { ResourceSearchResult } from "../models/resourceModels";

export interface ResourceSearchState {
    query: string;
    selectedResource: ResourceSearchResult | null;
    onlyDelegable: boolean;
    onlyVisible: boolean;
    onlyAltinnApp: boolean;
    setQuery: (q: string) => void;
    setSelectedResource: (r: ResourceSearchResult | null) => void;
    setOnlyDelegable: (v: boolean) => void;
    setOnlyVisible: (v: boolean) => void;
    setOnlyAltinnApp: (v: boolean) => void;
}