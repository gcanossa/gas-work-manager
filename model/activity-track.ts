import { intervalToHours, numberToPrecision } from "@/lib/utils";
import {
  numeric,
  text,
  serial,
  formula,
  dateTime,
  RowObject,
  boolean,
} from "@gasstack/db";
import { filter, groupBy, map, pipe, reduce, sortBy, toArray } from "lodash/fp";
import { z } from "zod";

export const activityTrackModel = {
  id: serial(numeric(0)),
  roundId: numeric(1),
  projectId: numeric(2),
  serviceId: numeric(3),
  clientName: formula(text(4)),
  projectName: formula(text(5)),
  serviceName: formula(text(6)),
  description: text(7),
  start: dateTime(8),
  end: dateTime(9),
  multiplier: numeric(10),
  billable: boolean(11),
  hourlyRate: formula(numeric(12)),
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

export function activitiesToSoldItems(
  activities: ActivityTrackType[],
  billableOnly: boolean = true,
) {
  return pipe(
    filter<ActivityTrackType>((p) => !billableOnly || p.billable),
    map((p) => [
      p,
      {
        duration: intervalToHours(p.start, p.end, 2),
        unitPrice: p.multiplier * p.hourlyRate,
      },
    ]),
    groupBy<[ActivityTrackType, { duration: number; unitPrice: number }]>(
      ([p, e]) => `${p.projectId}_${p.serviceId}_${e.unitPrice}`,
    ),
    toArray,
    map(
      (
        group: [ActivityTrackType, { duration: number; unitPrice: number }][],
      ) => {
        const count = reduce<
          [ActivityTrackType, { duration: number; unitPrice: number }],
          number
        >(
          (acc, [p, ext]) => acc + (p.billable ? ext.duration : 0),
          0,
        )(group);
        const [first, firstExt] = group[0];
        const price = firstExt.unitPrice;

        return {
          description: `${first.projectName}: ${first.serviceName}`,
          unitCount: count,
          unitPrice: firstExt.unitPrice,
          totalPrice: numberToPrecision(price * count, 2),
          activities: group.map(([p]) => p),
        };
      },
    ),
    sortBy("description"),
  )(activities) as {
    description: string;
    unitCount: number;
    unitPrice: number;
    totalPrice: number;
    activities: ActivityTrackType[];
  }[];
}

export function activityAmount(item: ActivityTrackType) {
  return numberToPrecision(
    intervalToHours(item.start, item.end, 2) *
      item.hourlyRate *
      item.multiplier,
    2,
  );
}

export function activitiesAmount(items: ActivityTrackType[]) {
  return numberToPrecision(
    items.reduce((acc, p) => acc + activityAmount(p), 0),
    2,
  );
}
