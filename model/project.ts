import {
  numeric,
  text,
  serial,
  formula,
  hyperLink,
  dateTime,
} from "@gasstack/db";

export const projectModel = {
  id: serial(numeric(0)),
  name: text(1),
  clientId: numeric(2),
  clientName: formula(text(3)),
  hourlyRate: numeric(4),
};
