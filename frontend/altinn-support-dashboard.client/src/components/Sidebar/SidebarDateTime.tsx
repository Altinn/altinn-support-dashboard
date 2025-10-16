import { useCurrentDateTime } from "../../hooks/hooks";
import { Heading } from "@digdir/designsystemet-react";
import classes from "./styles/SideBarDateTime.module.css";

const SideBarDateTime: React.FC = () => {
  const { formattedDate, formattedTime } = useCurrentDateTime();
  return (
    <div className={classes.container}>
      <Heading className={classes.time} level={5}>
        {formattedTime}
      </Heading>
      <Heading className={classes.date} level={6}>
        {formattedDate}
      </Heading>
    </div>
  );
};

export default SideBarDateTime;
