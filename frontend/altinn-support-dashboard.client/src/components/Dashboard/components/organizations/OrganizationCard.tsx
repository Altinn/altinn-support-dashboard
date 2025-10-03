import classes from "../../styles/OrganizationCard.module.css";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Organization, SelectedOrg, Subunit } from "../../../../models/models";
import { useState } from "react";
import { Card, Button, Heading, Paragraph } from "@digdir/designsystemet-react";

interface OrganizationCardProps {
  org: Organization;
  selectedOrg?: { OrganizationNumber: string } | null;
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
  const isSelected = selectedOrg?.OrganizationNumber === org.organizationNumber;
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

  return (
    <div className={classes.container}>
      <Card className={classes.mainCard} onClick={() => handleSelectedOrg()}>
        <Heading level={6}>{org.name}</Heading>
        <Paragraph variant="short">Org Nr: {org.organizationNumber}</Paragraph>
        <Paragraph variant="short">Type: {org.type}</Paragraph>

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
        <div className={classes.subunit}>
          {subUnits
            .filter((sub) => sub.overordnetEnhet === org.organizationNumber)
            .map((sub) => (
              <Card
                key={sub.organisasjonsnummer}
                onClick={() =>
                  setSelectedOrg({
                    Name: sub.navn,
                    OrganizationNumber: sub.organisasjonsnummer,
                  })
                }
              >
                <Paragraph variant="short">{sub.navn}</Paragraph>
                <Paragraph variant="short">
                  Org Nr: {sub.organisasjonsnummer}
                </Paragraph>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
