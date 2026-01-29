import { useDashboardStore } from "../../../../stores/DashboardStore";
import { Table } from "@digdir/designsystemet-react";
import style from "../../styles/NotificationContactTable.module.css";
import { NotificationAdresses } from "../../../../models/models";

interface NotificationContactCellProps {
  contact: NotificationAdresses;
  field: keyof NotificationAdresses;
}

const NotificationContactCell: React.FC<NotificationContactCellProps> = ({
  contact,
  field,
}) => {
  const userInput = useDashboardStore((s) => s.query.replace(/\s/g, "").toLowerCase());

  const value = contact[field] as string | null;

  //Add countrycode if phonenumber
  const displayValue = field === "phone" && value
    ? `${contact.countryCode || ""} ${value}`.trim()
    : value;

  //outlines if searchquery is part of the cell
  const boldened = value === userInput ? { fontWeight: "bold" } : undefined;

  return (
    <Table.Cell className={style["cellText"]} style={boldened}>
      {displayValue || "-"}
    </Table.Cell>
  );
};

export default NotificationContactCell;
