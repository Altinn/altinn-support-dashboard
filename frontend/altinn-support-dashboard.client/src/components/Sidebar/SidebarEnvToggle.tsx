import classes from "./styles/SideBarEnvToggle.module.css";
import { useAppStore } from "../../stores/Appstore";
import { Select, SelectOption } from "@digdir/designsystemet-react";

const SidebarEnvToggle: React.FC = () => {
  const environment = useAppStore((state) => state.environment ?? "TT02");
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
        <SelectOption value="PROD">PROD</SelectOption>
        <SelectOption value="TT02">TT02</SelectOption>
        {import.meta.env.DEV && <SelectOption value="mock">MOCK</SelectOption>}
      </Select>
    </div>
  );
};

export default SidebarEnvToggle;
