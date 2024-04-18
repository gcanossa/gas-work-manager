import { numeric, text, serial, formula } from "@gasstack/db";

export const serviceModel = {
  id: serial(numeric(0)),
  name: text(1),
  contractId: numeric(2),
  clientName: formula(text(3)),
  hourlyRate: numeric(4),
};
