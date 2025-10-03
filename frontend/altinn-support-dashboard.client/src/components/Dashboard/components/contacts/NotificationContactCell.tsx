import { useDashboardStore } from "../../../../stores/DashboardStore";
import { Table } from "@digdir/designsystemet-react"
import style from "../../styles/NotificationContact.module.css";

interface NotificationContactCellProps {
  contact: string | null;
}

const NotificationContactCell: React.FC<NotificationContactCellProps> = ({
  contact,
}) => {
  const userInput = useDashboardStore((s) => s.query.replace(/\s/g, ""));
  var sxProps = {};

  //outlines if searchquery is part of the cell
  const boldened = contact === userInput ? {fontWeight: "bold"} : undefined;

  return (
    <Table.Cell 
    className={style["cellText"]}
    style={boldened}
    >
      {contact || "-"}
    </Table.Cell>
  );
};

export default NotificationContactCell;
