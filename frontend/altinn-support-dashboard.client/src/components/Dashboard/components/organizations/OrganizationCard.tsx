import { Paper, Typography, Button } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  paperStyle,
  subunitPaperStyle,
} from "../../styles/OrganizationCard.styles";
import { Organization, Subunit } from "../../../../models/models";
import { useState } from "react";

interface OrganizationCardProps {
  org: Organization;
  selectedOrg?: { OrganizationNumber: string } | null;
  subUnits: Subunit[];
  setSelectedOrg: (orgNumber: string) => void;
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

  return (
    <div className="org-card-container">
      <Paper
        elevation={isSelected ? 6 : 2}
        sx={paperStyle(isSelected)}
        onClick={() => setSelectedOrg(org.organizationNumber)}
      >
        <Typography variant="h6">{org.name}</Typography>
        <Typography variant="body2">
          Org Nr: {org.organizationNumber}
        </Typography>
        <Typography variant="body2">Type: {org.type}</Typography>

        {hasSubUnits && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={(e) => {
              handleExpanded(e);
            }}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </Button>
        )}
      </Paper>

      {/* Subunits list */}
      {isExpanded && (
        <div className="subunits">
          {subUnits
            .filter((sub) => sub.overordnetEnhet === org.organizationNumber)
            .map((sub) => (
              <Paper
                key={sub.organisasjonsnummer}
                elevation={
                  selectedOrg?.OrganizationNumber === sub.organisasjonsnummer
                    ? 6
                    : 1
                }
                sx={subunitPaperStyle(
                  selectedOrg?.OrganizationNumber === sub.organisasjonsnummer,
                )}
                onClick={() => setSelectedOrg(sub.organisasjonsnummer)}
              >
                <Typography variant="subtitle1">{sub.navn}</Typography>
                <Typography variant="body2">
                  Org Nr: {sub.organisasjonsnummer}
                </Typography>
              </Paper>
            ))}
        </div>
      )}
    </div>
  );
};
