import { Heading } from "@digdir/designsystemet-react";



type ResourceSearchSearchBarProps = {
    query: string;
    setQuery: (query: string) => void;
}

const ResourceSearchSearchBar: React.FC<ResourceSearchSearchBarProps> = ({
    query,
    setQuery,
}) => (
    <div>
        <Heading level={1}>Søk etter ressurser</Heading>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søk etter ressurser..."
        />
    </div>
)

export default ResourceSearchSearchBar;