import { Tabs } from "@digdir/designsystemet-react";
import { CorrespondenceResponse } from "../../models/correspondenceModels";

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
          <Tabs.Panel value="response">{responseData.responseBody}</Tabs.Panel>
          <Tabs.Panel value="request">{responseData.requestBody}</Tabs.Panel>
        </Tabs>
      )}{" "}
    </div>
  );
};

export default CorrespondenceResponseField;
