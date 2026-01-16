import { Card } from "@mui/material";
import { Heading, Paragraph } from "@digdir/designsystemet-react";
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
      <Heading level={1}>Headers</Heading>
      <Card>{headers}</Card>

      <Heading level={1}>Body</Heading>
      <Card>
        <Paragraph className={classes.bodyText}>{body}</Paragraph>
      </Card>
    </div>
  );
};

export default ResponseTabContent;
