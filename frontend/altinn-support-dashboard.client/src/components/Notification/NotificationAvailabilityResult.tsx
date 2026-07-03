import React from "react";
import { NotificationAvailabilityResponse } from "../../models/notificationModels";
import NotificationAvailabilityStatusBox from "./NotificationAvailabilityStatusBox";
import style from "./styles/NotificationAvailabilityResult.module.css";

type NotificationAvailabilityResultProps = {
  result: NotificationAvailabilityResponse;
};

const NotificationAvailabilityResult: React.FC<
  NotificationAvailabilityResultProps
> = ({ result }) => {
  const willReceiveNotification =
    result.hasAccessToResourceForOrg &&
    result.inResourceIncludeList &&
    result.hasContactInformationForOrg;

  return (
    <div className={style.row}>
      <NotificationAvailabilityStatusBox
        title="Har tilgang til ressurs for org"
        value={result.hasAccessToResourceForOrg}
      />
      <NotificationAvailabilityStatusBox
        title="I ressursens inkluderingsliste"
        value={result.inResourceIncludeList}
      />
      <NotificationAvailabilityStatusBox
        title="Har kontaktinformasjon for org"
        value={result.hasContactInformationForOrg}
      />
      <span className={style.equals}>=</span>
      <NotificationAvailabilityStatusBox
        title="Vil motta varsling"
        value={willReceiveNotification}
      />
    </div>
  );
};

export default NotificationAvailabilityResult;
