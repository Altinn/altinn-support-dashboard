import { useEffect, useMemo, useState } from "react";
import { Heading } from "@digdir/designsystemet-react";
import { useAppStore } from "../stores/Appstore";
import { useNotificationAvailability, useResourceWithPolicies } from "../hooks/hooks";
import NotificationAvailabilityForm from "../components/Notification/NotificationAvailabilityForm";
import NotificationAvailabilityResult from "../components/Notification/NotificationAvailabilityResult";
import { showPopup } from "../components/Popup";
import style from "./styles/NotificationAvailabilityPage.module.css";

export const NotificationAvailabilityPage = () => {
  const environment = useAppStore((state) => state.environment);

  const [nin, setNin] = useState(
    () => sessionStorage.getItem("notif_avail_nin") || ""
  );
  const [orgNumber, setOrgNumber] = useState(
    () => sessionStorage.getItem("notif_avail_orgNumber") || ""
  );
  const [resourceId, setResourceId] = useState(
    () => sessionStorage.getItem("notif_avail_resourceId") || ""
  );
  const [action, setAction] = useState(
    () => sessionStorage.getItem("notif_avail_action") || "read"
  );

  useEffect(() => { sessionStorage.setItem("notif_avail_nin", nin); }, [nin]);
  useEffect(() => { sessionStorage.setItem("notif_avail_orgNumber", orgNumber); }, [orgNumber]);
  useEffect(() => { sessionStorage.setItem("notif_avail_resourceId", resourceId); }, [resourceId]);
  useEffect(() => { sessionStorage.setItem("notif_avail_action", action); }, [action]);

  const { policyRulesQuery } = useResourceWithPolicies(environment, resourceId || undefined);
  const actionOptions = useMemo(
    () => [...new Set((policyRulesQuery.data ?? []).map((rule) => rule.action?.value).filter((value): value is string => !!value))],
    [policyRulesQuery.data]
  );

  const availabilityMutation = useNotificationAvailability();

  useEffect(() => {
    if (availabilityMutation.isError) {
      showPopup(availabilityMutation.error.message, "error");
    }
  }, [availabilityMutation.isError, availabilityMutation.error]);

  const handleSubmit = () => {
    availabilityMutation.mutate({
      environment,
      request: {
        nationalIdentityNumber: nin,
        organizationNumber: orgNumber,
        resourceId,
        actionOnResource: action,
      },
    });
  };

  return (
    <div className={style.container}>
      <Heading level={1} data-size="sm" className={style.heading}>
        Sjekk varslingstilgjengelighet
      </Heading>

      <NotificationAvailabilityForm
        nin={nin}
        setNin={setNin}
        orgNumber={orgNumber}
        setOrgNumber={setOrgNumber}
        resourceId={resourceId}
        setResourceId={setResourceId}
        action={action}
        setAction={setAction}
        actionOptions={actionOptions}
        isSubmitting={availabilityMutation.isPending}
        onSubmit={handleSubmit}
      />

      {availabilityMutation.data && (
        <NotificationAvailabilityResult result={availabilityMutation.data} />
      )}
    </div>
  );
};

export default NotificationAvailabilityPage;
