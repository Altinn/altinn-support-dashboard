import { Card } from "@mui/material";
import { Heading } from "@digdir/designsystemet-react";
import classes from "./styles/ResponseTabContent.module.css";

interface ResponseTabContentProps {
  body: string;
  headers: string;
}

const ResponseTabContent: React.FC<ResponseTabContentProps> = ({
  body,
  headers,
}) => {
  return (
    <div>
      <Heading className={classes.card} level={1}>
        Headers
      </Heading>
      <Card>{headers}</Card>

      <Heading level={1}>Body</Heading>
      <Card classes={classes.card}>{body}</Card>
    </div>
  );
};

export default ResponseTabContent;
