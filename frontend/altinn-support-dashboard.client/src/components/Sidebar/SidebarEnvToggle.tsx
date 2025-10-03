import classes from "./styles/SideBarEnvToggle.module.css";
import { useAppStore } from "../../stores/Appstore";
import { Select, SelectOption } from "@digdir/designsystemet-react";

const SidebarEnvToggle: React.FC = () => {
  const environment = useAppStore((state) => state.environment);

  const handleEnvironmentChange = (env: string) => {
    useAppStore.getState().setEnvironment(env);
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
