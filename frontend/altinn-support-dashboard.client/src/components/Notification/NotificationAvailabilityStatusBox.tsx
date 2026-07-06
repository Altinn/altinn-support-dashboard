import React from "react";
import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";
import style from "./styles/NotificationAvailabilityStatusBox.module.css";

type NotificationAvailabilityStatusBoxProps = {
  title: string;
  value: boolean;
};

const NotificationAvailabilityStatusBox: React.FC<
  NotificationAvailabilityStatusBoxProps
> = ({ title, value }) => {
  return (
    <Card
      className={`${style.card} ${value ? style.cardSuccess : style.cardDanger}`}
    >
      <Heading level={3} data-size="2xs">
        {title}
      </Heading>
      <Paragraph data-size="sm">{value ? "Ja" : "Nei"}</Paragraph>
    </Card>
  );
};

export default NotificationAvailabilityStatusBox;
