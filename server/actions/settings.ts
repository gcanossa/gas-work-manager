import { read, seqCurrent, seqReset } from "@gasstack/db";
import {
  activityCtx,
  clientOrgCtx,
  emittedInvoiceCtx,
  moneyTransferCtx,
  projectCtx,
  roundCtx,
  serviceCtx,
  settingsCtx,
} from "@server/contexts";

export type SequencesValues = {
  clients_id: number;
  projects_id: number;
  services_id: number;
  rounds_id: number;
  activities_id: number;
  emittedInvoices_id: number;
  moneyTransfers_id: number;
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
    services_id: seqCurrent(serviceCtx, "id") ?? 0,
    rounds_id: seqCurrent(roundCtx, "id") ?? 0,
    activities_id: seqCurrent(activityCtx, "id") ?? 0,
    emittedInvoices_id: seqCurrent(emittedInvoiceCtx, "id") ?? 0,
    moneyTransfers_id: seqCurrent(moneyTransferCtx, "id") ?? 0,
  } satisfies SequencesValues;
}

export function setSequences(values: Partial<SequencesValues>) {
  if (values.clients_id !== undefined)
    seqReset(clientOrgCtx, "id", values.clients_id ?? undefined);
  if (values.projects_id !== undefined)
    seqReset(projectCtx, "id", values.projects_id ?? undefined);
  if (values.services_id !== undefined)
    seqReset(serviceCtx, "id", values.services_id ?? undefined);
  if (values.rounds_id !== undefined)
    seqReset(roundCtx, "id", values.rounds_id ?? undefined);
  if (values.activities_id !== undefined)
    seqReset(activityCtx, "id", values.activities_id ?? undefined);
  if (values.emittedInvoices_id !== undefined)
    seqReset(emittedInvoiceCtx, "id", values.emittedInvoices_id ?? undefined);
  if (values.moneyTransfers_id !== undefined)
    seqReset(moneyTransferCtx, "id", values.moneyTransfers_id ?? undefined);
}
