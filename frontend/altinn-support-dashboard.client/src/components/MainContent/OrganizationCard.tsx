import { Paper, Typography, Button } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Organization, Subunit } from "../../models/models";

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
        sx={{
          p: 2,
          mb: 1,
          cursor: "pointer",
          backgroundColor: isSelected ? "secondary" : "background.paper",
          border: isSelected ? "2px solid" : "none",
          borderColor: isSelected ? "secondary" : "transparent",
          transition: "transform 0.3s, boxShadow 0.3s",
          "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
        }}
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
    </div>
  );
};
