import {
  numeric,
  text,
  serial,
  formula,
  dateTime,
  RowObject,
  boolean,
} from "@gasstack/db";
import { z } from "zod";

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
  billable: boolean(10),
  hourlyRate: formula(numeric(11)),
};

export const activityTrackSchema = z
  .object({
    projectId: z.coerce.number().positive({
      message: "Project is required",
    }),
    serviceId: z.coerce.number().positive({
      message: "Service is required",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 character long.",
    }),
    start: z.string().refine((p) => !isNaN(new Date(p).getTime()), {
      message: "Invalid date",
    }),
    end: z.string().refine((p) => !isNaN(new Date(p).getTime()), {
      message: "Invalid date",
    }),
    billable: z.boolean(),
    multiplier: z.coerce.number().positive().int().default(1),
  })
  .refine((val) => new Date(val.end) > new Date(val.start), {
    message: "End must be greater than start",
    path: ["end"],
  });

export type ActivityTrackType = RowObject<typeof activityTrackModel>;
export type NewActivityTrackType = z.infer<typeof activityTrackSchema>;
