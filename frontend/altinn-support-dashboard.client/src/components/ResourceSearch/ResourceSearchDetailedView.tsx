import { Heading } from "@digdir/designsystemet-react";





interface ResourceSearchDetailedViewProps {
    selectedResource: string | null;
}

const ResourceSearchDetailedView: React.FC<ResourceSearchDetailedViewProps> = ({
    selectedResource
}) => (
    <div>
        <Heading>
            {selectedResource}
        </Heading>
    </div>
)

export default ResourceSearchDetailedView;