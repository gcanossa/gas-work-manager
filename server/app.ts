import { ServerRunMethods } from "@gasstack/rpc";
import { createClient, getClients } from "@server/actions/clients";
import { createProject } from "@server/actions/project";
import { createServiceType, getServiceTypes } from "@server/actions/services";

const app = {
  createClient,
  getClients,
  createProject,
  getServiceTypes,
  createServiceType,
} satisfies ServerRunMethods;

export default app;
