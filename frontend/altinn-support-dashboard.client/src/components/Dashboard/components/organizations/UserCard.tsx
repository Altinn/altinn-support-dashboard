import classes from "../../styles/OrganizationCard.module.css";
import {
  SelectedCard,
  UserContactInformationAltinn3,
  isUserContactInfo,
} from "../../../../models/models";
import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";

interface UserCardProps {
  user: UserContactInformationAltinn3;
  selectedCard?: SelectedCard | null;
  setSelectedCard: (selectedCard: SelectedCard) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  selectedCard,
  setSelectedCard,
}) => {
  const card = selectedCard ?? null;
  const isSelected = isUserContactInfo(card) && card.ssnToken === user.ssnToken;

  return (
    <div className={classes.container}>
      <Card
        data-color="accent"
        variant={isSelected ? "tinted" : "default"}
        className={`${classes.card} ${classes.mainCard}`}
        onClick={() => setSelectedCard(user)}
      >
        <div className={classes.cardInfoContainer}>
          <Heading level={6} className={classes.cardHeader}>
            {user.name ?? "Ukjent bruker"}
          </Heading>
          <Paragraph variant="short" className={classes.cardHeader}>
            {user.displayedSocialSecurityNumber ?? "Ukjent nin"}
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};
