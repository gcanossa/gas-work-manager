import { read } from "@gasstack/db";
import { ActivityTrackType } from "@model/activity-track";
import { RoundType } from "@model/round";
import { activityCtx, roundCtx } from "@server/contexts";
import {
  ActivityTrackTypeSerialziable,
  activityToSerializable,
} from "./activity";

//TODO: put in gasstack/db
export type RoundTypeSerialziable = {
  [K in keyof RoundType]: RoundType[K] extends Date
    ? string
    : RoundType[K] extends Date | null
      ? string | null
      : RoundType[K];
};

//TODO: put in gasstack/db
export function roundToSerializable(round: RoundType): RoundTypeSerialziable {
  return {
    ...round,
    start: round?.start?.toISOString() ?? null,
    end: round?.end?.toISOString() ?? null,
  };
}

export function getRounds() {
  return read(roundCtx).map(roundToSerializable);
}

export function getRoundActivities(
  roundId: number,
): ActivityTrackTypeSerialziable[] {
  const round = read(roundCtx).find((p) => p.id === roundId);

  let activities: ActivityTrackType[] = [];
  let offset = 0;
  const size = 50;
  let result: ActivityTrackTypeSerialziable[] = [];
  do {
    //TODO: put in gasstack/db
    activities = read(activityCtx, offset, size).filter(
      (p) => p.roundId === roundId && p.start >= round!.start, //TODO: wrong not in that order
    );
    offset += size;

    result = result.concat(activities.map(activityToSerializable));
  } while (activities.length === size);

  return result;
}

export function getRoundTotalAmount(roundId: number): number {
  const activities = getRoundActivities(roundId);

  return activities.reduce(
    (total, item) =>
      total + (item.billable ? item.hourlyRate * item.multiplier : 0),
    0,
  );
}
