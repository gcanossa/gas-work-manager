import { insertAt, read } from "@gasstack/db";
import { NewActivityTrackType } from "@model/activity-track";
import { projectCtx, activityCtx, roundCtx } from "@server/contexts";

export function trackActivity(obj: NewActivityTrackType) {
  const projects = read(projectCtx);
  const rounds = read(roundCtx);

  const project = projects.find((p) => p.id === obj.projectId);
  if (!project) throw Error("Project not found");

  let currentRound = rounds.find(
    (p) => p.clientId === project!.clientId && !p.end,
  );
  if (!currentRound)
    currentRound = insertAt(
      roundCtx,
      {
        clientId: project.clientId,
        start: new Date(),
        end: null,
        status: "",
      },
      0,
    )[0];

  insertAt(
    activityCtx,
    {
      roundId: currentRound.id,
      projectId: obj.projectId,
      serviceId: obj.serviceId,
      description: obj.description,
      start: new Date(obj.start),
      end: new Date(obj.end),
      multiplier: obj.multiplier,
    },
    0,
  );
}
