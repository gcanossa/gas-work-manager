import { ActivityTrackType } from "@model/activity-track";
import { RoundType } from "@model/round";

export type SerializableRecord<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K];
};

export function roundToSerializable(
  round: RoundType,
): SerializableRecord<RoundType> {
  return {
    ...round,
    start: round?.start?.toISOString() ?? null,
    end: round?.end?.toISOString() ?? null,
  };
}

export function activityToSerializable(
  activity: ActivityTrackType,
): SerializableRecord<ActivityTrackType> {
  return {
    ...activity,
    start: activity?.start?.toISOString() ?? null,
    end: activity?.end?.toISOString() ?? null,
  };
}

export function activityFromSerializable(
  activity: SerializableRecord<ActivityTrackType>,
): ActivityTrackType {
  return {
    ...activity,
    start: new Date(activity.start),
    end: new Date(activity.end),
  };
}
