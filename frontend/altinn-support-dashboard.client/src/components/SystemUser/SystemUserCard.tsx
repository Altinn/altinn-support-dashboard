import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";
import { AuthorizedPartyExtended } from "../../models/models";




interface SystemUserCardProps {
    party: AuthorizedPartyExtended;
    isSelected: boolean;
    onClick: () => void;
}

const SystemUserCard: React.FC<SystemUserCardProps> = ({ 
    party, 
    isSelected, 
    onClick 
}) => (
    <Card
        data-color="neutral"
        variant={isSelected ? "tinted" : "default"}
        onClick={onClick}
        style={{ cursor: "pointer", marginBottom: "1rem" }}
    >
        <Heading level={6}>{party.name}</Heading>
        <Paragraph variant="short">
            {party.organizationNumber
                ? `Org Nr: ${party.organizationNumber}`
                : party.personId
                ? `Personnr: ${party.personId}`
                : "—"}
        </Paragraph>
    </Card>
)

export default SystemUserCard;