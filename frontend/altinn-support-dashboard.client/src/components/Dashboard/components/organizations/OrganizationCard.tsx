import classes from "../../styles/OrganizationCard.module.css";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Organization, SelectedOrg, Subunit } from "../../../../models/models";
import { useEffect, useState } from "react";
import { Card, Button, Heading, Paragraph } from "@digdir/designsystemet-react";

interface OrganizationCardProps {
  org: Organization;
  selectedOrg?: SelectedOrg;
  subUnits: Subunit[];
  setSelectedOrg: (SelectedOrg: SelectedOrg) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  org,
  selectedOrg,
  subUnits,
  setSelectedOrg,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubUnits = subUnits.some(
    (sub) => sub.overordnetEnhet === org.organizationNumber,
  );

  const handleExpanded = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsExpanded(!isExpanded);
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
      <Card
        data-color="neutral"
        variant={checkIsSelected(org.organizationNumber) ? "tinted" : "default"}
        className={classes.card}
        onClick={() => handleSelectedOrg()}
      >
        <Heading level={6} className={classes.cardHeader}>
          {org.name}
        </Heading>
        <Paragraph variant="short" className={classes.cardParagraph}>
          Org Nr: {org.organizationNumber}
        </Paragraph>
        <Paragraph variant="short" className={classes.cardParagraph}>
          Type: {org.type}
        </Paragraph>

        {hasSubUnits && (
          <Button
            className={classes.expandButton}
            variant="secondary"
            onClick={(e) => {
              handleExpanded(e);
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        )}
      </Card>

      {/* Subunits list */}
      {isExpanded && (
        <div>
          {subUnits
            .filter((sub) => sub.overordnetEnhet === org.organizationNumber)
            .map((sub) => (
              <Card
                className={`${classes.subunit} ${classes.card}`}
                variant={
                  checkIsSelected(sub.organisasjonsnummer)
                    ? "tinted"
                    : "default"
                }
                data-color="neutral"
                key={sub.organisasjonsnummer}
                onClick={() =>
                  setSelectedOrg({
                    Name: sub.navn,
                    OrganizationNumber: sub.organisasjonsnummer,
                  })
                }
              >
                <Paragraph variant="short" className={classes.cardHeader}>
                  {sub.navn}
                </Paragraph>
                <Paragraph variant="short" className={classes.cardParagraph}>
                  Org Nr: {sub.organisasjonsnummer}
                </Paragraph>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
