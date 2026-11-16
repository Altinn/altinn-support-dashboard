import classes from "../../styles/OrganizationCard.module.css";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Organization, SelectedCard, isOrganization } from "../../../../models/models";
import { useState } from "react";
import { Card, Button, Heading, Paragraph } from "@digdir/designsystemet-react";

interface OrganizationCardProps {
  org: Organization;
  selectedCard?: SelectedCard | null;
  setSelectedCard: (selectedCard: SelectedCard) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  org,
  selectedCard,
  setSelectedCard,
}) => {
  // When a subunit is searched for, the backend also returns its head unit with all subunits.
  // In that case, show the head unit as the main card with the full subunit list
  const headUnitWithSiblings = org.headUnit?.subUnits?.some(
    (sub) => sub.organizationNumber === org.organizationNumber
  )
    ? org.headUnit
    : undefined;
  
  const displayOrg = headUnitWithSiblings ?? org;
  const searchedOrgNumber = headUnitWithSiblings
    ? org.organizationNumber
    : undefined;
  
  const [isExpandedSub, setIsExpandedSub] = useState(!!headUnitWithSiblings);
  const [isExpandedHead, setIsExpandedHead] = useState(false);

  const handleExpandedSub = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsExpandedSub(!isExpandedSub);
    e.stopPropagation();
  };

  const handleExpandedHead = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsExpandedHead(!isExpandedHead);
    e.stopPropagation();
  };

  const checkIsSelected = (orgNumber: string) => {
    const card = selectedCard ?? null;
    return isOrganization(card) && orgNumber === card.organizationNumber;
  };

  return (
    <div className={classes.container}>
      {isExpandedHead && displayOrg.headUnit && (
        <Card
          className={`${classes.headUnit} ${classes.card} ${displayOrg.headUnit.isDeleted && classes.cardIsDeleted}`}
          variant={
            checkIsSelected(displayOrg.headUnit.organizationNumber)
              ? "tinted"
              : "default"
          }
          data-color="neutral"
          key={displayOrg.headUnit.organizationNumber}
          onClick={() => {
            if (!displayOrg.headUnit) return;
            setSelectedCard(displayOrg.headUnit);
          }}
        >
          <Paragraph variant="short" className={classes.cardHeader}>
            {displayOrg.headUnit.name}
          </Paragraph>
          <Paragraph variant="short" className={classes.cardParagraph}>
            Org nr: {displayOrg.headUnit.organizationNumber}
          </Paragraph>
        </Card>
      )}
      <Card
        data-color="neutral"
        variant={checkIsSelected(displayOrg.organizationNumber) ? "tinted" : "default"}
        className={`${classes.card} ${classes.mainCard} ${displayOrg.isDeleted && classes.cardIsDeleted}`}
        onClick={() => setSelectedCard(displayOrg)}
      >
        <div className={`${classes.cardInfoContainer}`}>
          <Heading level={6} className={classes.cardHeader}>
            {displayOrg.name}
          </Heading>
          <Paragraph variant="short" className={classes.cardParagraph}>
            Org nr: {displayOrg.organizationNumber}
          </Paragraph>
        </div>
        {displayOrg.headUnit && (
          <Button
            className={classes.expandButtonHead}
            variant="secondary"
            onClick={(e) => {
              handleExpandedHead(e);
            }}
          >
            {isExpandedHead ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        )}

        
        {displayOrg.subUnits && (
          <Button
            className={classes.expandButtonSub}
            variant="secondary"
            onClick={(e) => {
              handleExpandedSub(e);
            }}
          >
            {isExpandedSub ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        )}
      </Card>

      {/* Subunits list */}
      {displayOrg.subUnits && isExpandedSub && (
        <div>
          {displayOrg.subUnits
            .filter(
              (sub: Organization) =>
                sub.headUnit?.organizationNumber === displayOrg.organizationNumber
            )
            .map((sub: Organization) => (
              <Card
                className={`${classes.subunit} ${classes.card} ${sub.isDeleted && classes.cardIsDeleted} ${sub.organizationNumber === searchedOrgNumber && classes.searchedUnit}`}
                variant={
                  checkIsSelected(sub.organizationNumber) ? "tinted" : "default"
                }
                data-color="neutral"
                key={sub.organizationNumber}
                onClick={() => setSelectedCard(sub)}
              >
                <Paragraph variant="short" className={classes.cardHeader}>
                  {sub.name}
                </Paragraph>
                <Paragraph variant="short" className={classes.cardParagraph}>
                  Org nr: {sub.organizationNumber}
                </Paragraph>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
