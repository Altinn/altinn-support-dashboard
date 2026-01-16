import { Tabs } from "@digdir/designsystemet-react";
import { CorrespondenceResponse } from "../../models/correspondenceModels";
import classes from "./styles/CorrespondenceResponse.module.css";
import ResponseTabContent from "./ResponseTabContent";

interface CorrespondenceResponseFieldProps {
  responseData?: CorrespondenceResponse;
}

const CorrespondenceResponseField: React.FC<
  CorrespondenceResponseFieldProps
> = ({ responseData }) => {
  return (
    <div>
      {responseData && (
        <Tabs>
          <Tabs.List>
            <Tabs.Tab value="response"> Response</Tabs.Tab>
            <Tabs.Tab value="request">Request</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel className={classes.tabContent} value="response">
            <ResponseTabContent
              body={responseData.responseBody}
              headers={responseData.responseHeader}
            />
          </Tabs.Panel>
          <Tabs.Panel className={classes.tabContent} value="request">
            <ResponseTabContent
              body={responseData.requestBody}
              headers={responseData.requestHeader}
            />
          </Tabs.Panel>
        </Tabs>
      )}
    </div>
  );
};

export default CorrespondenceResponseField;
