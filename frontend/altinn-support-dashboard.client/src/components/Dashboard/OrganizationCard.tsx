import { Paper, Typography, Button } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Organization, Subunit } from "../../models/models";
import {
  paperStyle,
  subunitPaperStyle,
} from "./styles/OrganizationCard.styles";

interface OrganizationCardProps {
  org: Organization;
  selectedOrg?: { OrganizationNumber: string } | null;
  subUnits: Subunit[];
  expandedOrg: string | null;
  onSelectOrg: (orgNumber: string, name: string) => void;
  onExpandToggle: (orgNumber: string) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  org,
  selectedOrg,
  subUnits,
  expandedOrg,
  onSelectOrg,
  onExpandToggle,
}) => {
  const isSelected = selectedOrg?.OrganizationNumber === org.organizationNumber;
  const hasSubUnits = subUnits.some(
    (sub) => sub.overordnetEnhet === org.organizationNumber,
  );

  return (
    <div className="org-card-container">
      <Paper
        elevation={isSelected ? 6 : 2}
        sx={paperStyle(isSelected)}
        onClick={() => onSelectOrg(org.organizationNumber, org.name)}
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
              e.stopPropagation();
              onExpandToggle(org.organizationNumber);
            }}
          >
            {expandedOrg === org.organizationNumber ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </Button>
        )}
      </Paper>

      {/* Subunits list */}
      {expandedOrg === org.organizationNumber && (
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
                onClick={() => onSelectOrg(sub.organisasjonsnummer, sub.navn)}
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
