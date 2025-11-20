import classes from "./styles/SideBarEnvToggle.module.css";
import { useAppStore } from "../../stores/Appstore";
import { Select, SelectOption } from "@digdir/designsystemet-react";
import { useEffect } from "react";
import { useAuthDetails } from "../../hooks/ansattportenHooks";

const SidebarEnvToggle: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const setEnvironment = useAppStore((state) => state.setEnvironment);
  const authDetails = useAuthDetails();
  const userPolicies = authDetails.data.userPolicies;

  const handleEnvironmentChange = (env: string) => {
    setEnvironment(env);
  };

  //switched the environment if user only has access to one of the environments
  useEffect(() => {
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
  }, [authDetails.data.isLoggedIn]);

  return (
    <div className={classes.container}>
      <Select
        className={classes.select}
        value={environment}
        onChange={(e) => handleEnvironmentChange(e.target.value)}
      >
        {userPolicies.includes("ProductionAuthenticated") && (
          <SelectOption value="PROD">PROD</SelectOption>
        )}
        {userPolicies.includes("TT02Authenticated") && (
          <SelectOption value="TT02">TT02</SelectOption>
        )}
      </Select>
    </div>
  );
};

export default SidebarEnvToggle;
