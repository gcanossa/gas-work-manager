import {
  numeric,
  text,
  serial,
  formula,
  hyperLink,
  dateTime,
} from "@gasstack/db";

export const receivedInvoiceModel = {
  id: serial(numeric(0)),
  providerId: numeric(1),
  date: dateTime(2),
  dueAmount: numeric(3),
  driveItem: hyperLink(4),
};
