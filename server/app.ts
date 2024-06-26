import { ServerRunMethods } from "@gasstack/rpc";
import { createClient, getClients } from "@server/actions/clients";
import { createProject, getProjects } from "@server/actions/project";
import { getServiceTypes, getServices } from "@server/actions/services";
import { trackActivity } from "@server/actions/activity";
import {
  getRoundActivities,
  getRoundTotalAmount,
  getRounds,
} from "./actions/rounds";
import { getSequences, getSettings, setSequences } from "./actions/settings";
import { emitInvoice } from "@server/actions/invoices";

const app = {
  getSequences,
  setSequences,
  getSettings,
  createClient,
  getClients,
  createProject,
  getProjects,
  getServiceTypes,
  getServices,
  trackActivity,
  getRounds,
  getRoundTotalAmount,
  getRoundActivities,
  emitInvoice,
} satisfies ServerRunMethods;

export default app;
