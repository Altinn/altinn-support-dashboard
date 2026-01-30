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

  console.log("user input:", userInput);


  const value = contact[field] as string | null;

  //Add countrycode if phonenumber
  const displayValue = field === "phone" && value
    ? `${contact.countryCode || ""} ${value}`.trim()
    : value;

  //outlines if searchquery is part of the cell
  const boldened =  displayValue?.replace(/\s/g, "").toLowerCase().includes(userInput) ? { fontWeight: "bold" } : undefined;

  console.log("display value:", displayValue?.replace(/\s/g, "").toLowerCase());
  return (
    <Table.Cell className={style["cellText"]} style={boldened}>
      {displayValue || ""}
    </Table.Cell>
  );
};

export default NotificationContactCell;
