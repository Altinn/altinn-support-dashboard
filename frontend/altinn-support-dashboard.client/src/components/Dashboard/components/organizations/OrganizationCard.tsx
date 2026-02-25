import classes from "../../styles/OrganizationCard.module.css";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Organization, SelectedOrg } from "../../../../models/models";
import { useState } from "react";
import { Card, Button, Heading, Paragraph } from "@digdir/designsystemet-react";

interface OrganizationCardProps {
  org: Organization;
  selectedOrg?: SelectedOrg | null;
  setSelectedOrg: (SelectedOrg: SelectedOrg) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  org,
  selectedOrg,
  setSelectedOrg,
}) => {
  const [isExpandedSub, setIsExpandedSub] = useState(false);
  const [isExpandedHead, setIsExpandedHead] = useState(false);

  const handleExpandedSub = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsExpandedSub(!isExpandedSub);
    e.stopPropagation();
  };

  const handleExpandedHead = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsExpandedHead(!isExpandedHead);
    e.stopPropagation();
  };

  const handleSelectedOrg = () => {
    const selectedOrg: SelectedOrg = {
      Name: org.name,
      OrganizationNumber: org.organizationNumber,
    };
    setSelectedOrg(selectedOrg);
  };

  const checkIsSelected = (orgNumber: string) => {
    return orgNumber === selectedOrg?.OrganizationNumber;
  };

  return (
    <div className={classes.container}>
      {isExpandedHead && org.headUnit && (
        <Card
          className={`${classes.headUnit} ${classes.card}`}
          variant={
            checkIsSelected(org.headUnit.organizationNumber)
              ? "tinted"
              : "default"
          }
          data-color="neutral"
          key={org.headUnit.organizationNumber}
          onClick={() => {
            if (!org.headUnit) return;
            setSelectedOrg({
              Name: org.headUnit.name,
              OrganizationNumber: org.headUnit.organizationNumber,
            });
          }}
        >
          <Paragraph variant="short" className={classes.cardHeader}>
            {org.headUnit.name}
          </Paragraph>
          <Paragraph variant="short" className={classes.cardParagraph}>
            Org Nr: {org.headUnit.organizationNumber}
          </Paragraph>
        </Card>
      )}
      <Card
        data-color="neutral"
        variant={checkIsSelected(org.organizationNumber) ? "tinted" : "default"}
        className={`${classes.card} ${classes.mainCard}`}
        onClick={() => handleSelectedOrg()}
      >
        <div
          className={`${classes.cardInfoContainer} ${org.isDeleted && classes.cardIsDeleted}`}
        >
          <Heading level={6} className={classes.cardHeader}>
            {org.name}
          </Heading>
          <Paragraph variant="short" className={classes.cardParagraph}>
            Org Nr: {org.organizationNumber}
          </Paragraph>
        </div>
        {org.headUnit && (
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

        {org.subUnits && (
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
      {org.subUnits && isExpandedSub && (
        <div>
          {org.subUnits
            .filter(
              (sub: Organization) =>
                sub.headUnit?.organizationNumber === org.organizationNumber,
            )
            .map((sub: Organization) => (
              <Card
                className={`${classes.subunit} ${classes.card}`}
                variant={
                  checkIsSelected(sub.organizationNumber) ? "tinted" : "default"
                }
                data-color="neutral"
                key={sub.organizationNumber}
                onClick={() =>
                  setSelectedOrg({
                    Name: sub.name,
                    OrganizationNumber: sub.organizationNumber,
                  })
                }
              >
                <Paragraph variant="short" className={classes.cardHeader}>
                  {sub.name}
                </Paragraph>
                <Paragraph variant="short" className={classes.cardParagraph}>
                  Org Nr: {sub.organizationNumber}
                </Paragraph>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
