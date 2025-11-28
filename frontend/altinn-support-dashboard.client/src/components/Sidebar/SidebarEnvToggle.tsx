import classes from "./styles/SideBarEnvToggle.module.css";
import { useAppStore } from "../../stores/Appstore";
import { Select, SelectOption } from "@digdir/designsystemet-react";
import { useEffect } from "react";
import { useAuthDetails } from "../../hooks/ansattportenHooks";

const SidebarEnvToggle: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const setEnvironment = useAppStore((state) => state.setEnvironment);
  const authDetails = useAuthDetails();
  const userPolicies = authDetails?.data?.userPolicies;

  const handleEnvironmentChange = (env: string) => {
    setEnvironment(env);
  };

  useEffect(() => {
    if (userPolicies == null) {
      return;
    }

    if (
      environment == "TT02" &&
      !userPolicies.includes("TT02Authenticated") &&
      userPolicies.includes("ProductionAuthenticated")
    ) {
      setEnvironment("PROD");
    } else if (
      environment == "PROD" &&
      !userPolicies.includes("ProductionAuthenticated") &&
      userPolicies.includes("TT02Authenticated")
    ) {
      setEnvironment("TT02");
    }
  }, [
    authDetails?.data?.isLoggedIn,
    environment,
    setEnvironment,
    userPolicies,
  ]);

  return (
    <div className={classes.container}>
      <Select
        className={classes.select}
        value={environment}
        onChange={(e) => handleEnvironmentChange(e.target.value)}
      >
        {(!authDetails.data?.ansattportenActive ||
          userPolicies?.includes("ProductionAuthenticated")) && (
          <SelectOption value="PROD">PROD</SelectOption>
        )}
        {(!authDetails.data?.ansattportenActive ||
          userPolicies?.includes("TT02Authenticated")) && (
          <SelectOption value="TT02">TT02</SelectOption>
        )}
      </Select>
    </div>
  );
};

export default SidebarEnvToggle;
