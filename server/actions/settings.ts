import { read, seqCurrent, seqReset } from "@gasstack/db";
import { clientOrgCtx, projectCtx, settingsCtx } from "@server/contexts";

export type SequencesValues = {
  clients_id: number;
  projects_id: number;
};

export function getSettings() {
  return read(settingsCtx).reduce(
    (acc, p) => {
      acc[p.key] = p.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function getSequences() {
  return {
    clients_id: seqCurrent(clientOrgCtx, "id") ?? 0,
    projects_id: seqCurrent(projectCtx, "id") ?? 0,
  } satisfies SequencesValues;
}

export function setSequences(values: Partial<SequencesValues>) {
  if (values.clients_id !== undefined)
    seqReset(clientOrgCtx, "id", values.clients_id ?? undefined);
  if (values.projects_id !== undefined)
    seqReset(projectCtx, "id", values.projects_id ?? undefined);
}
