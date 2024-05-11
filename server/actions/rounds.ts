import { querySortedRange, read } from "@gasstack/db";
import { ActivityTrackType } from "@model/activity-track";
import { activityCtx, roundCtx } from "@server/contexts";
import {
  SerializableRecord,
  activityToSerializable,
  roundToSerializable,
} from "./client-utils";
import { format } from "date-fns";

export function getRounds() {
  return read(roundCtx).map(roundToSerializable);
}

export function getRoundActivities(
  roundId: number,
): SerializableRecord<ActivityTrackType>[] {
  const round = read(roundCtx).find((p) => p.id === roundId);

  let activities = querySortedRange(
    activityCtx,
    "start",
    {
      min: new Date(format(round!.start, "yyyy-MM-dd")),
    },
    "desc",
  );

  return activities
    .filter((p) => p.roundId === round!.id)
    .map(activityToSerializable);
}

export function getRoundTotalAmount(roundId: number): number {
  const activities = getRoundActivities(roundId);

  return activities.reduce(
    (total, item) =>
      total + (item.billable ? item.hourlyRate * item.multiplier : 0),
    0,
  );
}
