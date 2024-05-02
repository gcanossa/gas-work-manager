import { count, insertAt, read } from "@gasstack/db";
import { ActivityTrackType, NewActivityTrackType } from "@model/activity-track";
import { projectCtx, activityCtx, roundCtx } from "@server/contexts";

//TODO: put in gasstack/db
export type ActivityTrackTypeSerialziable = {
  [K in keyof ActivityTrackType]: ActivityTrackType[K] extends Date
    ? string
    : ActivityTrackType[K] extends Date | null
      ? string | null
      : ActivityTrackType[K];
};

//TODO: put in gasstack/db
export function activityToSerializable(
  round: ActivityTrackType,
): ActivityTrackTypeSerialziable {
  return {
    ...round,
    start: round?.start?.toISOString() ?? null,
    end: round?.end?.toISOString() ?? null,
  };
}

export function trackActivity(obj: NewActivityTrackType) {
  const projects = read(projectCtx);
  const rounds = read(roundCtx);

  const project = projects.find((p) => p.id === obj.projectId);
  if (!project) throw Error("Project not found");

  let currentRound = rounds.find(
    (p) => p.clientId === project!.clientId && !p.end,
  );
  if (!currentRound) {
    const newRoundIndex = count(roundCtx);
    currentRound = insertAt(
      roundCtx,
      {
        clientId: project.clientId,
        start: new Date(),
        end: null,
        status: "",
      },
      newRoundIndex - 1,
      true,
    )[0];
  }

  insertAt(
    activityCtx,
    {
      roundId: currentRound.id,
      projectId: obj.projectId,
      serviceId: obj.serviceId,
      description: obj.description,
      start: new Date(obj.start),
      end: new Date(obj.end),
      billable: obj.billable,
      multiplier: obj.multiplier,
    },
    count(activityCtx) - 1,
    true,
  );
}
