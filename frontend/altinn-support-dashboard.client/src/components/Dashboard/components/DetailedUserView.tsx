import React from "react";
import { Heading, Card } from "@digdir/designsystemet-react";
import { UserContactInformationAltinn3 } from "../../../models/models";
import styles from "../styles/DetailedUserView.module.css";

interface DetailedUserViewProps {
  selectedUser: UserContactInformationAltinn3 | null;
}

const DetailedUserView: React.FC<DetailedUserViewProps> = ({
  selectedUser,
}) => {
  return (
    <Card className={styles.container}>
      {selectedUser && (
        <div className={styles.userDetails}>
          <Heading className={styles.userInformation}>
            <span>Reservert: {selectedUser.isReserved ? "true" : "false"}</span>
          </Heading>
          <Heading className={styles.userName}>
            {selectedUser.displayedSocialSecurityNumber ?? "Ukjent bruker"}
          </Heading>
          <p>Mobilnummer: {selectedUser.phoneNumber ?? "Ikke registrert"}</p>
          <p>E-post: {selectedUser.emailAddress ?? "Ikke registrert"}</p>
        </div>
      )}
    </Card>
  );
};

export default DetailedUserView;
