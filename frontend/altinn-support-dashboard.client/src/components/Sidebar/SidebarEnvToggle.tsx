import classes from "./styles/SideBarEnvToggle.module.css";
import { useAppStore } from "../../stores/Appstore";
import { Select, SelectOption } from "@digdir/designsystemet-react";
import { useEffect } from "react";

const SidebarEnvToggle: React.FC = () => {
  const environment = useAppStore((state) => state.environment);
  const setEnvironment = useAppStore((state) => state.setEnvironment);

  const handleEnvironmentChange = (env: string) => {
    setEnvironment(env);
  };

  return (
    <div className={classes.container}>
      <Select
        className={classes.select}
        value={environment}
        onChange={(e) => handleEnvironmentChange(e.target.value)}
      >
        <SelectOption className={classes.selectOption} value="PROD">
          PROD
        </SelectOption>
        <SelectOption value="TT02">TT02</SelectOption>
      </Select>
    </div>
  );
};

export default SidebarEnvToggle;
