import { dateTime, numeric, text } from "@gasstack/db";

export const reportModel = {
  clientName: text(0),
  projectName: text(1),
  serviceName: text(2),
  description: text(3),
  start: dateTime(4),
  end: dateTime(5),
  duration: numeric(6),
  multiplier: numeric(7),
  hourlyRate: numeric(8),
  totalAmount: numeric(9),
};
