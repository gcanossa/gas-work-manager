import { numeric, text, serial, formula, dateTime } from "@gasstack/db";

export const roundModel = {
  id: serial(numeric(0)),
  clientId: numeric(1),
  clientName: formula(text(2)),
  start: dateTime(3),
  end: dateTime(4),
  status: text(5),
};
