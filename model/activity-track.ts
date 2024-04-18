import { numeric, text, serial, formula, dateTime } from "@gasstack/db";

export const activityTrackModel = {
  id: serial(numeric(0)),
  roundId: numeric(1),
  projectId: numeric(2),
  serviceId: numeric(3),
  clientName: formula(text(4)),
  serviceName: formula(text(5)),
  description: text(6),
  start: dateTime(7),
  end: dateTime(8),
  multiplier: numeric(9),
  hourlyRate: numeric(10),
};
