import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { OfficialContact } from "../../models/mainContentTypes";
import { formatDate } from "../../utils/dateUtils";
import NotificationContactCell from "./NotificationContactCell";

interface ContactFieldTableProps {
  title: string;
  field: keyof OfficialContact;
  changedField: keyof OfficialContact;
  contacts: OfficialContact[];
  userInput: string;
}

const OfficialContactFieldTable: React.FC<ContactFieldTableProps> = ({
  title,
  field,
  changedField,
  contacts,
  userInput,
}) => {
  return (
    <TableContainer component={Paper}>
      <MuiTable size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">{title}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">{"Endret " + title}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts && contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <TableRow key={index}>
                <NotificationContactCell 
                contact={contact[field] as string | null}
                  userInput={userInput}
                 />
                <TableCell>
                  {formatDate(contact[changedField] as string | null)}
                </TableCell> 
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Her var det tomt
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default OfficialContactFieldTable;
