import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";
import { ResourceSearchResult } from "../../models/resourceModels";
import classes from "./styles/ResourceSearchCard.module.css"


interface ResourceSearchCardProps {
    resource: ResourceSearchResult;
    selectedResource: ResourceSearchResult | null;
    setSelectedResource: (resource: ResourceSearchResult) => void;
}

export const ResourceSearchCard: React.FC<ResourceSearchCardProps> = ({
    resource,
    selectedResource,
    setSelectedResource
}) =>  {
    const isSelected = resource.identifier === selectedResource?.identifier;
    const title =
        resource.title?.["nb"] ??
        resource.title?.["nn"] ??
        resource.title?.["en"] ??
        resource.identifier;
    const authorityName = 
        resource.hasCompetentAuthority?.name?.["nb"] ??
        resource.hasCompetentAuthority?.name?.["nn"] ??
        resource.hasCompetentAuthority?.name?.["en"];
    
    return(
        <div className={classes.container}>
            <Card
            data-color="neutral"
            variant={isSelected ? "tinted" : "default"}
            className={`${classes.card} ${classes.mainCard}`}
            onClick={() => setSelectedResource(resource)}
            >
                <div className={classes.cardInfoContainer}>
                    <Heading level={6} className={classes.cardHeader}>{title}</Heading>
                    <Paragraph variant="short" className={classes.cardParagraph}>{resource.identifier}</Paragraph>
                    {authorityName && (
                        <Paragraph variant="short" className={classes.cardParagraph}>{authorityName}</Paragraph>
                    )}
                </div>
            </Card>
        </div>
    );
};