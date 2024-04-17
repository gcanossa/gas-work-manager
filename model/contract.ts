import {
  numeric,
  text,
  serial,
  formula,
  hyperLink,
  dateTime,
} from "@gasstack/db";

export const contractModel = {
  id: serial(numeric(0)),
  clientId: numeric(1),
  clientName: formula(text(2)),
  driveFolder: hyperLink(3),
};
