import { numeric, text, serial, formula, dateTime } from "@gasstack/db";

export const moneyTransferModel = {
  id: serial(numeric(0)),
  clientId: numeric(1),
  providerId: numeric(2),
  clientName: formula(text(3)),
  providerName: formula(text(4)),
  expense: numeric(5),
  earning: numeric(6),
  date: dateTime(7),
  roundId: numeric(8),
};
