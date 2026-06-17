import { Card, Heading } from "@digdir/designsystemet-react";
import { isSuccess } from "../../utils/httpUtils";
import classes from "./styles/ResponseStatusCode.module.css";

interface ResponseStatusCodeProps {
  statuscode?: number;
}

const ResponseStatusCode: React.FC<ResponseStatusCodeProps> = ({
  statuscode,
}) => {
  return (
    <div>
      {statuscode && (
        <Card
          className={` ${classes.container}
          ${
            isSuccess(statuscode)
              ? classes.containerSuccess
              : classes.containerNotSuccess
          }
          `}
        >
          <Heading level={1}>Status Code: {statuscode}</Heading>
        </Card>
      )}
    </div>
  );
};

export default ResponseStatusCode;
